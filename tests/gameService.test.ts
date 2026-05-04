import { describe, expect, it } from "vitest";
import { GameService } from "../src/services/gameService";
import { themes } from "../src/data/themes";
import { ValidationError } from "../src/utils/validation";
import { RecordingSmsService, validPlayers } from "./helpers";

describe("GameService", () => {
  it("uma rodada válida escolhe exatamente 1 impostor", async () => {
    const { result } = await startDeterministicGame();

    expect(result.status).toBe("STARTED");
    expect(result.playersCount).toBe(3);
    expect(result.messagesSent).toBe(3);
    expect(result.deliveries.filter((delivery) => delivery.role === "IMPOSTOR")).toHaveLength(1);
  });

  it("o impostor não recebe a palavra secreta", async () => {
    const { impostorMessage, secretWord } = await startDeterministicGame();

    expect(impostorMessage?.message).not.toContain(secretWord);
  });

  it("o impostor recebe a dica correta da palavra sorteada", async () => {
    const { impostorMessage, hint } = await startDeterministicGame();

    expect(impostorMessage?.message).toContain(`Sua dica é: ${hint}`);
  });

  it("a dica recebida pelo impostor tem exatamente uma palavra", async () => {
    const { hint } = await startDeterministicGame();

    expect(hint.trim().split(/\s+/)).toHaveLength(1);
  });

  it("a dica recebida pelo impostor não contém espaços", async () => {
    const { hint } = await startDeterministicGame();

    expect(hint).not.toMatch(/\s/);
  });

  it("a dica recebida pelo impostor não é igual à palavra secreta", async () => {
    const { hint, secretWord } = await startDeterministicGame();

    expect(hint.toLocaleLowerCase("pt-BR")).not.toBe(secretWord.toLocaleLowerCase("pt-BR"));
  });

  it("os jogadores comuns recebem a palavra secreta", async () => {
    const { playerMessages, secretWord } = await startDeterministicGame();

    for (const playerMessage of playerMessages) {
      expect(playerMessage.message).toContain(`Sua palavra é: ${secretWord}`);
    }
  });

  it("os jogadores comuns não recebem a dica", async () => {
    const { playerMessages, hint } = await startDeterministicGame();

    for (const playerMessage of playerMessages) {
      expect(playerMessage.message).not.toContain(`Sua dica é: ${hint}`);
    }
  });

  it("todos os jogadores recebem exatamente uma mensagem", async () => {
    const { smsService } = await startDeterministicGame();

    const phones = smsService.sentMessages.map((message) => message.phone);
    expect(smsService.sentMessages).toHaveLength(3);
    expect(new Set(phones).size).toBe(phones.length);
  });

  it("falha com menos de 3 jogadores antes de enviar SMS", async () => {
    const smsService = new RecordingSmsService();
    const service = new GameService(smsService, () => 0);

    await expect(
      service.startGame({
        themeId: "frutas",
        players: validPlayers.slice(0, 2)
      })
    ).rejects.toThrow(ValidationError);

    expect(smsService.sentMessages).toHaveLength(0);
  });

  it("falha com tema inexistente antes de enviar SMS", async () => {
    const smsService = new RecordingSmsService();
    const service = new GameService(smsService, () => 0);

    await expect(
      service.startGame({
        themeId: "tema-inexistente",
        players: validPlayers
      })
    ).rejects.toThrow("Tema escolhido não existe.");

    expect(smsService.sentMessages).toHaveLength(0);
  });

  it("falha com telefone duplicado antes de enviar SMS", async () => {
    const smsService = new RecordingSmsService();
    const service = new GameService(smsService, () => 0);

    await expect(
      service.startGame({
        themeId: "frutas",
        players: [
          validPlayers[0],
          validPlayers[1],
          { name: "Outro", phone: validPlayers[1].phone }
        ]
      })
    ).rejects.toThrow("Não pode haver telefone duplicado");

    expect(smsService.sentMessages).toHaveLength(0);
  });

  it("falha se alguma dica do tema tiver mais de uma palavra antes de enviar SMS", async () => {
    const originalHint = themes[0].words[0].hint;
    themes[0].words[0].hint = "fruta amarela";
    const smsService = new RecordingSmsService();
    const service = new GameService(smsService, () => 0);

    try {
      await expect(
        service.startGame({
          themeId: "frutas",
          players: validPlayers
        })
      ).rejects.toThrow("deve conter apenas uma palavra");
      expect(smsService.sentMessages).toHaveLength(0);
    } finally {
      themes[0].words[0].hint = originalHint;
    }
  });
});

async function startDeterministicGame() {
  const smsService = new RecordingSmsService();
  const randomValues = [0, 1];
  const service = new GameService(smsService, () => randomValues.shift() ?? 0);

  const result = await service.startGame({
    themeId: "frutas",
    players: validPlayers,
    showDebug: true
  });

  const secretWord = "banana";
  const hint = "amarela";
  const impostorPhone = validPlayers[1].phone;
  const impostorMessage = smsService.sentMessages.find((message) => message.phone === impostorPhone);
  const playerMessages = smsService.sentMessages.filter((message) => message.phone !== impostorPhone);

  expect(result.debug).toEqual({
    secretWord,
    impostor: "João",
    hint
  });
  expect(impostorMessage?.message).toContain("Você é o IMPOSTOR.");

  return {
    result,
    smsService,
    secretWord,
    hint,
    impostorMessage,
    playerMessages
  };
}
