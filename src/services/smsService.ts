import type { SmsSendResult } from "../types";

export interface SmsService {
  sendSms(phone: string, message: string): Promise<SmsSendResult>;
}
