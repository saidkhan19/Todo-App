import { Dumbbell } from "lucide-react";

export const COLOR_PALETTES = [
  { id: "purple", primary: "#916DFF", soft: "#DBD2FF", name: "Фиолетовый" },
  { id: "green", primary: "#52B33D", soft: "#CFF6D4", name: "Зеленый" },
  { id: "orange", primary: "#E8A933", soft: "#FFE4BE", name: "Оранжевый" },
  { id: "blue", primary: "#3A8DFF", soft: "#D0E6FF", name: "Синий" },
  { id: "red", primary: "#E14A4A", soft: "#FFD6D6", name: "Красный" },
  { id: "pink", primary: "#D85BA1", soft: "#FFE1F1", name: "Розовый" },
  { id: "teal", primary: "#2DB5A7", soft: "#C6F1EC", name: "Бирюзовый" },
  { id: "indigo", primary: "#5C6BC0", soft: "#E3E6FB", name: "Индиго" },
  { id: "brown", primary: "#A1724F", soft: "#F3E3D7", name: "Коричневый" },
  { id: "lime", primary: "#B3C100", soft: "#F6FBCF", name: "Лаймовый" },
  { id: "cyan", primary: "#00B8D9", soft: "#CFF6FB", name: "Голубой" },
];

export const DEFAULT_PALETTE = {
  id: "black",
  primary: "#1C1C1E",
  soft: "#E5E5E7",
  name: "Чёрный",
};

export const ICONS = [{ id: "dumbbell", icon: Dumbbell, name: "Гантель" }];
