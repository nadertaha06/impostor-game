import { Router } from "express";
import { getThemeDetails, listThemes } from "../controllers/themeController";

export const themeRoutes = Router();

themeRoutes.get("/", listThemes);
themeRoutes.get("/:themeId", getThemeDetails);
