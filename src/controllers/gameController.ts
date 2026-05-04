import type { Request, Response } from "express";
import { env } from "../config/env";
import { GameService } from "../services/gameService";
import { createSmsService } from "../services/smsProviderFactory";
import { ValidationError } from "../utils/validation";

const gameService = new GameService(createSmsService());

export async function startGame(request: Request, response: Response) {
  try {
    const result = await gameService.startGame({
      themeId: request.body?.themeId,
      players: request.body?.players,
      showDebug: env.showGameDebug
    });

    const { deliveries: _deliveries, ...safeResult } = result;
    response.status(201).json(safeResult);
  } catch (error) {
    if (error instanceof ValidationError) {
      response.status(error.statusCode).json({
        error: {
          code: error.code,
          message: error.message
        }
      });
      return;
    }

    response.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Erro interno ao iniciar rodada."
      }
    });
  }
}
