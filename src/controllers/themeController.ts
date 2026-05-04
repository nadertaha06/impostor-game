import type { Request, Response } from "express";
import { findThemeById, listPublicThemes } from "../data/themes";

export function listThemes(_request: Request, response: Response) {
  response.json(listPublicThemes());
}

export function getThemeDetails(request: Request, response: Response) {
  const themeId = Array.isArray(request.params.themeId) ? request.params.themeId[0] : request.params.themeId;
  const theme = findThemeById(themeId);

  if (!theme) {
    response.status(404).json({
      error: {
        code: "THEME_NOT_FOUND",
        message: "Tema não encontrado."
      }
    });
    return;
  }

  response.json({
    id: theme.id,
    nome: theme.name,
    wordsCount: theme.words.length
  });
}
