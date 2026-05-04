import type { SmsSendResult } from "../src/types";
import type { SmsService } from "../src/services/smsService";

export class RecordingSmsService implements SmsService {
  public readonly sentMessages: Array<{ phone: string; message: string }> = [];

  constructor(private readonly response: SmsSendResult = { success: true, providerMessageId: "test-message" }) {}

  async sendSms(phone: string, message: string): Promise<SmsSendResult> {
    this.sentMessages.push({ phone, message });
    return this.response;
  }
}

export const validPlayers = [
  { name: "Nader", phone: "+5511999999999" },
  { name: "João", phone: "+5511988888888" },
  { name: "Maria", phone: "+5511977777777" }
];
