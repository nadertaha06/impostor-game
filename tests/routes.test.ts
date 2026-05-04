import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const body = {
  themeId: "frutas",
  players: [
    { name: "Nader", phone: "+5511999999999" },
    { name: "João", phone: "+5511988888888" },
    { name: "Maria", phone: "+5511977777777" }
  ]
};

describe("API routes", () => {
  beforeEach(() => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("GET /themes não retorna palavras nem dicas", async () => {
    const { createApp } = await import("../src/app");
    const response = await request(createApp()).get("/themes").expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "frutas",
          nome: "Frutas"
        })
      ])
    );
    expect(JSON.stringify(response.body)).not.toContain("words");
    expect(JSON.stringify(response.body)).not.toContain("palavras");
    expect(JSON.stringify(response.body)).not.toContain("hint");
    expect(JSON.stringify(response.body)).not.toContain("dica");
  });

  it("GET /themes/:themeId não retorna palavras nem dicas", async () => {
    const { createApp } = await import("../src/app");
    const response = await request(createApp()).get("/themes/frutas").expect(200);

    expect(response.body).toEqual({
      id: "frutas",
      nome: "Frutas",
      wordsCount: expect.any(Number)
    });
    expect(JSON.stringify(response.body)).not.toContain("wordsList");
    expect(JSON.stringify(response.body)).not.toContain("palavras");
    expect(JSON.stringify(response.body)).not.toContain("hint");
    expect(JSON.stringify(response.body)).not.toContain("dica");
  });

  it("POST /games/start não expõe palavra secreta, dica nem impostor por padrão", async () => {
    vi.stubEnv("SHOW_GAME_DEBUG", "false");
    const { createApp } = await import("../src/app");

    const response = await request(createApp()).post("/games/start").send(body).expect(201);

    expect(response.body).toEqual({
      gameId: expect.any(String),
      theme: "Frutas",
      playersCount: 3,
      messagesSent: 3,
      status: "STARTED"
    });
    expect(response.body).not.toHaveProperty("debug");
    expect(JSON.stringify(response.body)).not.toContain("secretWord");
    expect(JSON.stringify(response.body)).not.toContain("hint");
    expect(JSON.stringify(response.body)).not.toContain("impostor");
  });

  it("POST /games/start expõe debug apenas quando SHOW_GAME_DEBUG=true", async () => {
    vi.stubEnv("SHOW_GAME_DEBUG", "true");
    const { createApp } = await import("../src/app");

    const response = await request(createApp()).post("/games/start").send(body).expect(201);

    expect(response.body.debug).toEqual({
      secretWord: expect.any(String),
      impostor: expect.any(String),
      hint: expect.any(String)
    });
  });
});
