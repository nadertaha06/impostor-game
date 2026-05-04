import type { PlayerInput, Theme, ThemeWord } from "../types";

const PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

export class ValidationError extends Error {
  public readonly statusCode = 400;
  public readonly code: string;

  constructor(message: string, code = "VALIDATION_ERROR") {
    super(message);
    this.name = "ValidationError";
    this.code = code;
  }
}

export function validatePlayers(players: unknown): asserts players is PlayerInput[] {
  if (!Array.isArray(players)) {
    throw new ValidationError("players deve ser uma lista.", "INVALID_PLAYERS");
  }

  if (players.length < 3) {
    throw new ValidationError("A rodada precisa ter pelo menos 3 jogadores.", "MIN_PLAYERS");
  }

  const phones = new Set<string>();

  players.forEach((player, index) => {
    if (!isObject(player)) {
      throw new ValidationError(`Jogador ${index + 1} deve ser um objeto.`, "INVALID_PLAYER");
    }

    const name = typeof player.name === "string" ? player.name.trim() : "";
    const phone = typeof player.phone === "string" ? player.phone.trim() : "";

    if (!name) {
      throw new ValidationError(`Jogador ${index + 1} precisa ter nome.`, "PLAYER_NAME_REQUIRED");
    }

    if (!phone) {
      throw new ValidationError(`Jogador ${index + 1} precisa ter telefone.`, "PLAYER_PHONE_REQUIRED");
    }

    if (!PHONE_REGEX.test(phone)) {
      throw new ValidationError(
        `Telefone do jogador ${index + 1} deve estar em formato E.164, como +5511999999999.`,
        "INVALID_PHONE"
      );
    }

    if (phones.has(phone)) {
      throw new ValidationError("Não pode haver telefone duplicado na mesma rodada.", "DUPLICATE_PHONE");
    }

    phones.add(phone);
  });
}

export function normalizePlayers(players: PlayerInput[]): PlayerInput[] {
  return players.map((player) => ({
    name: player.name.trim(),
    phone: player.phone.trim()
  }));
}

export function validateTheme(theme: Theme | undefined, themeId: unknown): asserts theme is Theme {
  if (typeof themeId !== "string" || !themeId.trim()) {
    throw new ValidationError("themeId é obrigatório.", "THEME_ID_REQUIRED");
  }

  if (!theme) {
    throw new ValidationError("Tema escolhido não existe.", "THEME_NOT_FOUND");
  }

  if (!Array.isArray(theme.words) || theme.words.length < 1) {
    throw new ValidationError("Tema precisa ter pelo menos 1 palavra cadastrada.", "THEME_WITHOUT_WORDS");
  }

  theme.words.forEach((word) => validateThemeWord(word));
}

export function validateThemeWord(word: unknown): asserts word is ThemeWord {
  if (!isObject(word) || !word.value || typeof word.value !== "string") {
    throw new ValidationError("Toda palavra precisa ter um valor.", "WORD_VALUE_REQUIRED");
  }

  if (!("hint" in word)) {
    throw new ValidationError(`A palavra ${word.value} precisa ter uma dica.`, "WORD_HINT_REQUIRED");
  }

  if (typeof word.hint !== "string") {
    throw new ValidationError(`A dica da palavra ${word.value} deve ser uma string.`, "WORD_HINT_INVALID");
  }

  const hint = word.hint.trim();
  const secretWord = word.value.trim();

  if (!hint) {
    throw new ValidationError(`A palavra ${word.value} precisa ter uma dica.`, "WORD_HINT_REQUIRED");
  }

  if (/\s/.test(hint)) {
    throw new ValidationError(`A dica da palavra ${word.value} deve conter apenas uma palavra.`, "WORD_HINT_MULTIPLE_WORDS");
  }

  const normalizedHint = normalizeForComparison(hint);
  const normalizedSecretWord = normalizeForComparison(secretWord);

  if (normalizedHint === normalizedSecretWord) {
    throw new ValidationError("A dica não pode ser igual à palavra secreta.", "WORD_HINT_EQUALS_SECRET");
  }

  if (normalizedHint.includes(normalizedSecretWord)) {
    throw new ValidationError("A dica não pode conter a palavra secreta.", "WORD_HINT_CONTAINS_SECRET");
  }

  if (normalizedSecretWord.includes(normalizedHint)) {
    throw new ValidationError("A palavra secreta não pode conter a dica.", "SECRET_CONTAINS_HINT");
  }
}

export function validateSingleImpostor(impostorIndexes: number[]): void {
  if (impostorIndexes.length !== 1) {
    throw new ValidationError("Deve existir exatamente 1 impostor.", "INVALID_IMPOSTOR_COUNT");
  }
}

function normalizeForComparison(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
