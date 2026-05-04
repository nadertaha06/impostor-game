import { env } from "../config/env";
import { FakeSmsService } from "./fakeSmsService";
import type { SmsService } from "./smsService";

export function createSmsService(): SmsService {
  switch (env.smsProvider) {
    case "fake":
      return new FakeSmsService();
    default:
      throw new Error(`SMS_PROVIDER=${env.smsProvider} ainda não está implementado. Use SMS_PROVIDER=fake.`);
  }
}
