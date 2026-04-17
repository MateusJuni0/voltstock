#!/usr/bin/env node
// Remove AE products that don't match their intended niche.
import fs from "node:fs";
import path from "node:path";

const env = Object.fromEntries(
  fs
    .readFileSync(path.join(process.cwd(), ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const REMOVE = {
  "1005008882136145": "magnets, not keyboard",
  "1005007168889184": "Ajazz (searched RK)",
  "1005007135778855": "Ajazz (searched RK)",
  "1005008600410715": "joystick, not headset",
  "1005007961199696": "wired mouse, not 7.1 headset",
  "1005007857182319": "Binnune, not Redragon",
  "1005009508910625": "MCHOSE, not Redragon",
  "1005007857093799": "Binnune, not Redragon",
};

for (const [id, why] of Object.entries(REMOVE)) {
  const r = await fetch(`${URL}/rest/v1/ae_products?ae_product_id=eq.${id}`, {
    method: "DELETE",
    headers: { apikey: KEY, authorization: `Bearer ${KEY}`, prefer: "return=minimal" },
  });
  console.log(r.ok ? `✓ removed ${id}  (${why})` : `✗ ${id}  ${r.status}`);
}
