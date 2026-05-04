import { env } from "./config/env";
import { createApp } from "./app";

const app = createApp();

app.listen(env.port, () => {
  console.info(`Impostor Game API rodando em http://localhost:${env.port}`);
});
