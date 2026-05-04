import type { SmsSendResult } from "../types";
import type { SmsService } from "./smsService";

export class FakeSmsService implements SmsService {
  async sendSms(phone: string, message: string): Promise<SmsSendResult> {
    console.info(`[FakeSmsService] SMS para ${phone}:\n${message}`);

    return {
      success: true,
      providerMessageId: `fake-${Date.now()}`
    };
  }
}
