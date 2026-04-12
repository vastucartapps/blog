import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import type {
  Planet,
  Sign,
  House,
  Nakshatra,
  Gemstone,
  Rudraksha,
  Yantra,
  Stotra,
} from "./types";

const DIR = path.join(process.cwd(), "lib", "taxonomy");

function read<T>(name: string): T[] {
  const file = path.join(DIR, `${name}.json`);
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : Object.values(parsed);
  } catch {
    return [];
  }
}

function byId<T extends { id?: string | number; mukhi?: number }>(
  items: T[],
  key: "id" | "mukhi" = "id"
): Record<string, T> {
  const out: Record<string, T> = {};
  for (const item of items) {
    const k = (item as { [k: string]: unknown })[key];
    if (k != null) out[String(k)] = item;
  }
  return out;
}

export const getPlanets = cache(() => byId(read<Planet>("planets")));
export const getSigns = cache(() => byId(read<Sign>("signs")));
export const getHouses = cache(() => {
  const arr = read<House>("houses");
  const out: Record<string, House> = {};
  for (const h of arr) out[String(h.number)] = h;
  return out;
});
export const getNakshatras = cache(() => byId(read<Nakshatra>("nakshatras")));
export const getGemstones = cache(() => byId(read<Gemstone>("gemstones")));
export const getRudraksha = cache(() => byId(read<Rudraksha>("rudraksha"), "mukhi"));
export const getYantras = cache(() => byId(read<Yantra>("yantras")));
export const getStotras = cache(() => byId(read<Stotra>("stotras")));

export const getTaxonomyForBlocks = cache(() => ({
  gemstones: getGemstones(),
  rudraksha: getRudraksha(),
  yantras: getYantras(),
  stotras: getStotras(),
}));
