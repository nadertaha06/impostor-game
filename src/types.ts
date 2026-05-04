export type PlayerInput = {
  name: string;
  phone: string;
};

export type ThemeWord = {
  id: string;
  value: string;
  hint: string;
};

export type Theme = {
  id: string;
  name: string;
  words: ThemeWord[];
};

export type SmsSendResult = {
  success: boolean;
  providerMessageId?: string;
  error?: string;
};

export type SmsDeliveryResult = SmsSendResult & {
  playerName: string;
  phone: string;
  role: "IMPOSTOR" | "PLAYER";
};

export type RandomInt = (maxExclusive: number) => number;

export type StartedGameResult = {
  gameId: string;
  theme: string;
  playersCount: number;
  messagesSent: number;
  status: "STARTED" | "STARTED_WITH_SMS_ERRORS";
  deliveries: SmsDeliveryResult[];
  debug?: {
    secretWord: string;
    impostor: string;
    hint: string;
  };
};
