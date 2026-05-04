import cors from "cors";
import express from "express";
import { gameRoutes } from "./routes/gameRoutes";
import { themeRoutes } from "./routes/themeRoutes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use("/themes", themeRoutes);
  app.use("/games", gameRoutes);

  app.use((_request, response) => {
    response.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Rota não encontrada."
      }
    });
  });

  return app;
}
