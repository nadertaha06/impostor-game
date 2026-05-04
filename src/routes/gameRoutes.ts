import { Router } from "express";
import { startGame } from "../controllers/gameController";

export const gameRoutes = Router();

gameRoutes.post("/start", startGame);
