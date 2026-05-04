import type { Theme } from "../types";

export const themes: Theme[] = [
  {
    id: "frutas",
    name: "Frutas",
    words: [
      { id: "banana", value: "banana", hint: "amarela" },
      { id: "maca", value: "maçã", hint: "vermelha" },
      { id: "uva", value: "uva", hint: "cacho" },
      { id: "abacaxi", value: "abacaxi", hint: "coroa" },
      { id: "melancia", value: "melancia", hint: "verde" },
      { id: "laranja", value: "laranja", hint: "gomo" },
      { id: "morango", value: "morango", hint: "semente" },
      { id: "manga", value: "manga", hint: "tropical" }
    ]
  },
  {
    id: "animais",
    name: "Animais",
    words: [
      { id: "cachorro", value: "cachorro", hint: "coleira" },
      { id: "gato", value: "gato", hint: "miado" },
      { id: "leao", value: "leão", hint: "juba" },
      { id: "cavalo", value: "cavalo", hint: "sela" },
      { id: "peixe", value: "peixe", hint: "aquário" },
      { id: "elefante", value: "elefante", hint: "tromba" },
      { id: "passaro", value: "pássaro", hint: "asa" },
      { id: "tartaruga", value: "tartaruga", hint: "casco" }
    ]
  },
  {
    id: "paises",
    name: "Países",
    words: [
      { id: "brasil", value: "Brasil", hint: "samba" },
      { id: "japao", value: "Japão", hint: "sushi" },
      { id: "franca", value: "França", hint: "torre" },
      { id: "italia", value: "Itália", hint: "massa" },
      { id: "argentina", value: "Argentina", hint: "tango" },
      { id: "canada", value: "Canadá", hint: "neve" },
      { id: "egito", value: "Egito", hint: "pirâmide" },
      { id: "mexico", value: "México", hint: "sombrero" }
    ]
  },
  {
    id: "filmes",
    name: "Filmes",
    words: [
      { id: "titanic", value: "Titanic", hint: "navio" },
      { id: "avatar", value: "Avatar", hint: "azul" },
      { id: "matrix", value: "Matrix", hint: "código" },
      { id: "shrek", value: "Shrek", hint: "ogro" },
      { id: "batman", value: "Batman", hint: "morcego" },
      { id: "rocky", value: "Rocky", hint: "boxe" },
      { id: "jumanji", value: "Jumanji", hint: "tabuleiro" },
      { id: "frozen", value: "Frozen", hint: "gelo" }
    ]
  },
  {
    id: "comidas",
    name: "Comidas",
    words: [
      { id: "pizza", value: "pizza", hint: "forno" },
      { id: "hamburguer", value: "hambúrguer", hint: "pão" },
      { id: "sushi", value: "sushi", hint: "arroz" },
      { id: "macarrao", value: "macarrão", hint: "molho" },
      { id: "churrasco", value: "churrasco", hint: "brasa" },
      { id: "lasanha", value: "lasanha", hint: "camadas" },
      { id: "taco", value: "taco", hint: "tortilha" },
      { id: "panqueca", value: "panqueca", hint: "frigideira" }
    ]
  },
  {
    id: "objetos",
    name: "Objetos",
    words: [
      { id: "cadeira", value: "cadeira", hint: "assento" },
      { id: "celular", value: "celular", hint: "tela" },
      { id: "relogio", value: "relógio", hint: "ponteiro" },
      { id: "oculos", value: "óculos", hint: "lente" },
      { id: "mochila", value: "mochila", hint: "zíper" },
      { id: "caneta", value: "caneta", hint: "tinta" },
      { id: "chave", value: "chave", hint: "fechadura" },
      { id: "livro", value: "livro", hint: "página" }
    ]
  },
  {
    id: "profissoes",
    name: "Profissões",
    words: [
      { id: "medico", value: "médico", hint: "jaleco" },
      { id: "professor", value: "professor", hint: "lousa" },
      { id: "motorista", value: "motorista", hint: "volante" },
      { id: "cozinheiro", value: "cozinheiro", hint: "panela" },
      { id: "advogado", value: "advogado", hint: "tribunal" },
      { id: "bombeiro", value: "bombeiro", hint: "mangueira" },
      { id: "engenheiro", value: "engenheiro", hint: "projeto" },
      { id: "dentista", value: "dentista", hint: "broca" }
    ]
  },
  {
    id: "esportes",
    name: "Esportes",
    words: [
      { id: "futebol", value: "futebol", hint: "bola" },
      { id: "tenis", value: "tênis", hint: "raquete" },
      { id: "natacao", value: "natação", hint: "piscina" },
      { id: "basquete", value: "basquete", hint: "cesta" },
      { id: "corrida", value: "corrida", hint: "pista" },
      { id: "volei", value: "vôlei", hint: "rede" },
      { id: "surfe", value: "surfe", hint: "onda" },
      { id: "boxe", value: "boxe", hint: "luva" }
    ]
  }
];

export function listPublicThemes() {
  return themes.map(({ id, name }) => ({ id, nome: name }));
}

export function findThemeById(themeId: string) {
  return themes.find((theme) => theme.id === themeId);
}
