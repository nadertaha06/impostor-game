import { randomUUID } from "node:crypto";
import { findThemeById } from "../data/themes";
import type { PlayerInput, RandomInt, SmsDeliveryResult, StartedGameResult, ThemeWord } from "../types";
import { cryptoRandomInt } from "../utils/random";
import {
  normalizePlayers,
  validatePlayers,
  validateSingleImpostor,
  validateTheme,
  validateThemeWord
} from "../utils/validation";
import type { SmsService } from "./smsService";

export type StartGameInput = {
  themeId: string;
  players: PlayerInput[];
  showDebug?: boolean;
};

export class GameService {
  constructor(
    private readonly smsService: SmsService,
    private readonly randomInt: RandomInt = cryptoRandomInt
  ) {}

  async startGame(input: StartGameInput): Promise<StartedGameResult> {
    validatePlayers(input.players);

    const players = normalizePlayers(input.players);
    const theme = findThemeById(input.themeId);

    validateTheme(theme, input.themeId);

    const secretWord = this.pickSecretWord(theme.words);
    validateThemeWord(secretWord);

    const impostorIndex = this.randomInt(players.length);
    const impostorIndexes = [impostorIndex];
    validateSingleImpostor(impostorIndexes);

    const messages = players.map((player, index) => {
      const isImpostor = index === impostorIndex;

      return {
        player,
        role: isImpostor ? ("IMPOSTOR" as const) : ("PLAYER" as const),
        message: isImpostor
          ? buildImpostorMessage(theme.name, secretWord.hint)
          : buildPlayerMessage(theme.name, secretWord.value)
      };
    });

    assertGameMessagePrivacy(messages, secretWord, impostorIndex);

    const deliveries: SmsDeliveryResult[] = [];
    const sentPhones = new Set<string>();

    for (const item of messages) {
      if (sentPhones.has(item.player.phone)) {
        continue;
      }

      sentPhones.add(item.player.phone);

      try {
        const result = await this.smsService.sendSms(item.player.phone, item.message);
        deliveries.push({
          ...result,
          playerName: item.player.name,
          phone: item.player.phone,
          role: item.role
        });
      } catch (error) {
        deliveries.push({
          success: false,
          error: error instanceof Error ? error.message : "Erro desconhecido no envio de SMS.",
          playerName: item.player.name,
          phone: item.player.phone,
          role: item.role
        });
      }
    }

    const messagesSent = deliveries.filter((delivery) => delivery.success).length;
    const result: StartedGameResult = {
      gameId: randomUUID(),
      theme: theme.name,
      playersCount: players.length,
      messagesSent,
      status: messagesSent === players.length ? "STARTED" : "STARTED_WITH_SMS_ERRORS",
      deliveries
    };

    if (input.showDebug) {
      result.debug = {
        secretWord: secretWord.value,
        impostor: players[impostorIndex].name,
        hint: secretWord.hint
      };
    }

    return result;
  }

  private pickSecretWord(words: ThemeWord[]): ThemeWord {
    const index = this.randomInt(words.length);
    const secretWord = words[index];

    if (!secretWord) {
      throw new Error("Não foi possível sortear a palavra secreta.");
    }

    return secretWord;
  }
}

export function buildPlayerMessage(themeName: string, secretWord: string): string {
  return [
    "Impostor Game",
    `Tema: ${themeName}`,
    `Sua palavra é: ${secretWord}`,
    "Não mostre esta mensagem para ninguém."
  ].join("\n");
}

export function buildImpostorMessage(themeName: string, hint: string): string {
  return [
    "Impostor Game",
    "Você é o IMPOSTOR.",
    `Tema: ${themeName}`,
    `Sua dica é: ${hint}`,
    "Fale uma palavra relacionada e tente descobrir a palavra dos outros jogadores."
  ].join("\n");
}

function assertGameMessagePrivacy(
  messages: Array<{ role: "IMPOSTOR" | "PLAYER"; message: string }>,
  secretWord: ThemeWord,
  impostorIndex: number
): void {
  const impostorMessages = messages.filter((message) => message.role === "IMPOSTOR");
  validateSingleImpostor(impostorMessages.map((_, index) => index));

  messages.forEach((item, index) => {
    if (index === impostorIndex) {
      if (item.message.includes(secretWord.value)) {
        throw new Error("O impostor nunca pode receber a palavra secreta.");
      }

      if (!item.message.includes(secretWord.hint)) {
        throw new Error("O impostor deve receber a dica correta da palavra sorteada.");
      }

      return;
    }

    if (!item.message.includes(secretWord.value)) {
      throw new Error("Jogadores comuns devem receber a mesma palavra secreta.");
    }

    if (item.message.includes(secretWord.hint)) {
      throw new Error("Jogadores comuns não podem receber a dica.");
    }
  });
}
