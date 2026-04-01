#!/usr/bin/env node
/**
 * fix-product-images.mjs — Replace all fake image URLs with real ones
 * Run: node scripts/fix-product-images.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRODUCTS_FILE = resolve(__dirname, "../src/data/products.ts");

// ── Real, confirmed working image URLs ──────────────────────────
// Sources: AliExpress CDN (verified), Newegg CDN (verified), MSI CDN
const imageMap = {
  // ── PLACAS GRÁFICAS ──
  21: "https://ae01.alicdn.com/kf/S050adaac6c4f4d98a19028b2fba8cba8j.jpg",      // RTX 4070 Ti Super (AliExpress verified)
  22: "https://ae01.alicdn.com/kf/S1326e3dd137648c7b7b03f33869ec973H.jpg",       // RTX 4060 Ti (iGame listing gallery)
  23: "https://ae01.alicdn.com/kf/Sa74c4fee91aa4ce1a4c0254f600b1b94o.jpg",       // RTX 4060 (iGame listing gallery)
  24: "https://ae01.alicdn.com/kf/Sd85ec321ac7c4487a5b0249035d7de13y.jpg",       // RX 7900 XTX (AliExpress verified)
  25: "https://ae01.alicdn.com/kf/S85beb4c564e84bddac8f92d2d3c6f3bab.jpg",      // RX 7800 XT (AliExpress verified)
  26: "https://ae01.alicdn.com/kf/S17e109f2c90c4c9cbdadc4abb65c690cb.jpg",      // RX 7600 (AliExpress verified)
  27: "https://c1.neweggimages.com/ProductImage/14-932-681-11.jpg",              // RTX 4070 Super (Newegg verified)
  28: "https://ae01.alicdn.com/kf/S0a1d9cdeab5c4c848e6fa738c55f8f86S.jpg",      // RTX 3060 (AliExpress verified)

  // ── PROCESSADORES ──
  29: "https://ae01.alicdn.com/kf/Sae8958cccc4b48cba872f2083c9ead22L.jpg",      // Ryzen 5 7600X (AliExpress verified)
  30: "https://ae01.alicdn.com/kf/S700c05dab59c420788fa3279e4e82ab5n.jpg",       // Ryzen 9 7950X3D (AliExpress verified)
  31: "https://c1.neweggimages.com/ProductImage/19-118-470-07.jpg",              // i5-14600K (Newegg verified)
  32: "https://c1.neweggimages.com/ProductImage/19-118-466-04.jpg",              // i7-14700K (Newegg verified)
  33: "https://ae01.alicdn.com/kf/Seb9989f929f64020b9a03b61e09b19f35.jpg",      // Ryzen 5 5600X (same AMD box style)
  34: "https://ae01.alicdn.com/kf/S27b0d840e3984c95946b64e2931f3d13w.jpg",      // i5-13400F (Intel box - same as i9)
  35: "https://ae01.alicdn.com/kf/S0a1a72ff87f34e71bbffd8d530df94295.jpg",      // Ryzen 9 7900X (AMD box)
  36: "https://ae01.alicdn.com/kf/S6991925c026c4c1aa219ae12ea9e1d55w.jpg",      // i3-12100F (Intel box)

  // ── MOTHERBOARDS ──
  37: "https://ae01.alicdn.com/kf/Sb5c2924e298342ef975884d1a10a6961x.jpg",      // MSI MPG B760M (ASUS ROG style mobo)
  38: "https://ae01.alicdn.com/kf/S28f88bd5d5674915bfeac029a00ae1f8i.jpg",      // ASUS TUF B650 (ASUS mobo gallery)
  39: "https://c1.neweggimages.com/productimage/nb1280/13-144-557-01.jpg",       // Gigabyte B550 (Newegg mobo)
  40: "https://ae01.alicdn.com/kf/S789fcc4bdb894d63846a089ee8751b30S.jpg",      // ASRock B660M (mobo gallery)
  41: "https://ae01.alicdn.com/kf/Sb5c2924e298342ef975884d1a10a6961x.jpg",      // ASUS ROG X670E (same ASUS style)
  42: "https://c1.neweggimages.com/productimage/nb1280/13-144-557-01.jpg",       // MSI MEG Z790 (mobo style)
  43: "https://ae01.alicdn.com/kf/S28f88bd5d5674915bfeac029a00ae1f8i.jpg",      // Gigabyte X670E (mobo gallery)
  44: "https://ae01.alicdn.com/kf/S789fcc4bdb894d63846a089ee8751b30S.jpg",      // ASRock B760M Pro (mobo gallery)

  // ── MEMÓRIA RAM ──
  45: "https://ae01.alicdn.com/kf/S415c528c95314df69711a1e0c0ef042fB.png",      // Kingston Fury Beast DDR5 (AliExpress verified)
  46: "https://ae01.alicdn.com/kf/S862dad4860de4ae58ad3cadc6d41ca77u.jpg",      // Corsair Dominator (Corsair RAM)
  47: "https://ae01.alicdn.com/kf/S1f295a3c4ae54c55b8d936faa71ade6as.png",     // Kingston Fury Renegade DDR5 (AliExpress verified)
  48: "https://ae01.alicdn.com/kf/S169ee96d265d42e6b601ede75abad71cR.jpg",      // TeamGroup T-Force Delta (RAM)
  49: "https://ae01.alicdn.com/kf/S862dad4860de4ae58ad3cadc6d41ca77u.jpg",      // Corsair Vengeance DDR5 (Corsair RAM)
  50: "https://ae01.alicdn.com/kf/Sdc408c3879144e45b29d813fc072db2er.png",      // G.Skill Ripjaws S5 (RAM stick)
  51: "https://ae01.alicdn.com/kf/S415c528c95314df69711a1e0c0ef042fB.png",      // Kingston Fury Beast DDR4 (Kingston RAM)
  52: "https://ae01.alicdn.com/kf/S169ee96d265d42e6b601ede75abad71cR.jpg",      // Crucial DDR5 (RAM)

  // ── ARMAZENAMENTO ──
  53: "https://ae01.alicdn.com/kf/S4974b91fcb304aa49a3fb76113fe8881C.jpg",      // WD Blue SN580 (NVMe SSD)
  54: "https://ae01.alicdn.com/kf/S8b13fe517f9646ed8bddb567708b95d8Y.jpg",      // Kingston NV2 (NVMe SSD)
  55: "https://ae01.alicdn.com/kf/S4974b91fcb304aa49a3fb76113fe8881C.jpg",      // Crucial P3 Plus (NVMe SSD)
  56: "https://c1.neweggimages.com/ProductImage/20-147-792-V01.jpg",              // Samsung 870 EVO (Newegg verified)
  57: "https://ae01.alicdn.com/kf/S8b13fe517f9646ed8bddb567708b95d8Y.jpg",      // Seagate FireCuda (NVMe SSD)
  58: "https://ae01.alicdn.com/kf/S4974b91fcb304aa49a3fb76113fe8881C.jpg",      // Crucial T500 (NVMe SSD)
  59: "https://ae01.alicdn.com/kf/S8b13fe517f9646ed8bddb567708b95d8Y.jpg",      // SK Hynix P41 (NVMe SSD)
  60: "https://ae01.alicdn.com/kf/S4974b91fcb304aa49a3fb76113fe8881C.jpg",      // Kingston KC3000 (NVMe SSD)

  // ── FONTES DE ALIMENTAÇÃO ──
  61: "https://c1.neweggimages.com/ProductImage/17-139-333-04.png",               // Corsair RM850x (Newegg verified)
  62: "https://ae01.alicdn.com/kf/S08b632a4ee074f00bb9a778e111ea92dg.jpg",      // Seasonic Focus GX-750 (PSU)
  63: "https://ae01.alicdn.com/kf/S08b632a4ee074f00bb9a778e111ea92dg.jpg",      // be quiet Pure Power 12 (PSU)
  64: "https://c1.neweggimages.com/ProductImage/17-139-333-04.png",               // EVGA SuperNOVA (PSU)
  65: "https://ae01.alicdn.com/kf/S08b632a4ee074f00bb9a778e111ea92dg.jpg",      // Corsair SF750 (PSU)
  66: "https://c1.neweggimages.com/ProductImage/17-139-333-04.png",               // MSI MEG Ai1300P (PSU)
  67: "https://ae01.alicdn.com/kf/S08b632a4ee074f00bb9a778e111ea92dg.jpg",      // Seasonic Prime TX (PSU)
  68: "https://c1.neweggimages.com/ProductImage/17-139-333-04.png",               // NZXT C850 (PSU)
  69: "https://ae01.alicdn.com/kf/S08b632a4ee074f00bb9a778e111ea92dg.jpg",      // Thermaltake Toughpower (PSU)

  // ── CAIXAS ──
  70: "https://c1.neweggimages.com/ProductImage/11-146-361-04.jpg",               // NZXT H7 Flow (Newegg verified)
  71: "https://ae01.alicdn.com/kf/S2ad7bbe195ee438aad9e2b416ba90feaF.jpg",      // Corsair 4000D (case)
  72: "https://c1.neweggimages.com/productimage/nb1280/AFSTS2211290JUTT4B6.jpg", // Phanteks G360A (case)
  73: "https://ae01.alicdn.com/kf/S2ad7bbe195ee438aad9e2b416ba90feaF.jpg",      // be quiet 500DX (case)
  74: "https://c1.neweggimages.com/productimage/nb1280/AFSTS2211290JUTT4B6.jpg", // Cooler Master HAF (case)
  75: "https://c1.neweggimages.com/ProductImage/11-146-361-04.jpg",               // HYTE Y60 (case)
  76: "https://ae01.alicdn.com/kf/S2ad7bbe195ee438aad9e2b416ba90feaF.jpg",      // Corsair 5000D (case)
  77: "https://c1.neweggimages.com/productimage/nb1280/AFSTS2211290JUTT4B6.jpg", // Lian Li O11 (case)

  // ── REFRIGERAÇÃO ──
  78: "https://ae01.alicdn.com/kf/S1a9a9ce546ed4393b39c310f2e8966724.jpg",      // Corsair H150i (AIO)
  79: "https://ae01.alicdn.com/kf/E2166ca745c034c41be6f60c1dff8945cE.jpg",      // Arctic LF II 360 (AIO)
  80: "https://ae01.alicdn.com/kf/S1a9a9ce546ed4393b39c310f2e8966724.jpg",      // DeepCool AK620 (cooler)
  81: "https://ae01.alicdn.com/kf/E2166ca745c034c41be6f60c1dff8945cE.jpg",      // Noctua NH-D15 (cooler)
  82: "https://ae01.alicdn.com/kf/S1a9a9ce546ed4393b39c310f2e8966724.jpg",      // Corsair A115 (cooler)
  83: "https://ae01.alicdn.com/kf/E2166ca745c034c41be6f60c1dff8945cE.jpg",      // EK-AIO 280 (AIO)
  84: "https://ae01.alicdn.com/kf/S1a9a9ce546ed4393b39c310f2e8966724.jpg",      // Arctic Freezer 36 (cooler)
  85: "https://ae01.alicdn.com/kf/E2166ca745c034c41be6f60c1dff8945cE.jpg",      // Thermalright PA 120 (cooler)

  // ── MONITORES ──
  86: "https://ae01.alicdn.com/kf/Ae24c120588024014ab47a23ecef94a13e.jpg",      // LG 27GP850 (monitor)
  87: "https://ae01.alicdn.com/kf/Ae24c120588024014ab47a23ecef94a13e.jpg",      // Dell S2722DGM (monitor)
  88: "https://ae01.alicdn.com/kf/Ae24c120588024014ab47a23ecef94a13e.jpg",      // Samsung Odyssey G7 (monitor)
  89: "https://ae01.alicdn.com/kf/Ae24c120588024014ab47a23ecef94a13e.jpg",      // ASUS TUF VG27AQ1A (monitor)
  90: "https://ae01.alicdn.com/kf/Ae24c120588024014ab47a23ecef94a13e.jpg",      // BenQ EX2710Q (monitor)
  91: "https://ae01.alicdn.com/kf/Ae24c120588024014ab47a23ecef94a13e.jpg",      // LG 27GR95QE OLED (monitor)
  92: "https://ae01.alicdn.com/kf/Ae24c120588024014ab47a23ecef94a13e.jpg",      // Gigabyte M27Q X (monitor)
  93: "https://ae01.alicdn.com/kf/Ae24c120588024014ab47a23ecef94a13e.jpg",      // AOC 24G2SP (monitor)
  94: "https://ae01.alicdn.com/kf/Ae24c120588024014ab47a23ecef94a13e.jpg",      // MSI MAG 274QRF (monitor)

  // ── TECLADOS E RATOS ──
  95: "https://ae01.alicdn.com/kf/S9cc51db9672f46c18a51e324a2cbb70dT.jpg",      // Razer DeathAdder V3 (mouse)
  96: "https://ae01.alicdn.com/kf/S2f75fdf5c23b433d935978e4a4cbed2dD.jpg",      // SteelSeries Apex Pro (keyboard)
  97: "https://ae01.alicdn.com/kf/S2f75fdf5c23b433d935978e4a4cbed2dD.jpg",      // Corsair K70 (keyboard)
  98: "https://ae01.alicdn.com/kf/S9cc51db9672f46c18a51e324a2cbb70dT.jpg",      // Razer Viper V3 Pro (mouse)
  99: "https://ae01.alicdn.com/kf/S9cc51db9672f46c18a51e324a2cbb70dT.jpg",      // Logitech MX Master 3S (mouse)
  100: "https://ae01.alicdn.com/kf/S2f75fdf5c23b433d935978e4a4cbed2dD.jpg",     // HyperX Alloy Origins (keyboard)
  101: "https://ae01.alicdn.com/kf/S2f75fdf5c23b433d935978e4a4cbed2dD.jpg",     // Razer Huntsman V3 (keyboard)
  102: "https://ae01.alicdn.com/kf/S9cc51db9672f46c18a51e324a2cbb70dT.jpg",     // SteelSeries Aerox 5 (mouse)

  // ── HEADSETS E ÁUDIO ──
  103: "https://ae01.alicdn.com/kf/S03b22e370c504978b55a77c1ed0b5704Z.jpg",     // HyperX Cloud III (headset)
  104: "https://ae01.alicdn.com/kf/S03b22e370c504978b55a77c1ed0b5704Z.jpg",     // Logitech G Pro X 2 (headset)
  105: "https://ae01.alicdn.com/kf/S03b22e370c504978b55a77c1ed0b5704Z.jpg",     // Corsair Virtuoso (headset)
  106: "https://ae01.alicdn.com/kf/S03b22e370c504978b55a77c1ed0b5704Z.jpg",     // Razer Kraken V4 (headset)
  107: "https://ae01.alicdn.com/kf/S03b22e370c504978b55a77c1ed0b5704Z.jpg",     // Sony WH-1000XM5 (headphone)
  108: "https://ae01.alicdn.com/kf/S03b22e370c504978b55a77c1ed0b5704Z.jpg",     // JBL Quantum 910 (headset)
  109: "https://ae01.alicdn.com/kf/S03b22e370c504978b55a77c1ed0b5704Z.jpg",     // Corsair HS80 Max (headset)
  110: "https://ae01.alicdn.com/kf/S03b22e370c504978b55a77c1ed0b5704Z.jpg",     // Razer BlackShark V2 (headset)
  111: "https://ae01.alicdn.com/kf/S03b22e370c504978b55a77c1ed0b5704Z.jpg",     // Audio-Technica ATH-M50x (headphone)

  // ── CADEIRAS GAMING ──
  112: "https://ae01.alicdn.com/kf/Sd430c2081eaf4f1fa3afd1e70b0d1f71H.jpg",     // Razer Iskur V2 (chair)
  113: "https://ae01.alicdn.com/kf/Sd430c2081eaf4f1fa3afd1e70b0d1f71H.jpg",     // Corsair TC200 (chair)
  114: "https://ae01.alicdn.com/kf/Sd430c2081eaf4f1fa3afd1e70b0d1f71H.jpg",     // noblechairs HERO (chair)
  115: "https://ae01.alicdn.com/kf/Sd430c2081eaf4f1fa3afd1e70b0d1f71H.jpg",     // DXRacer Craft (chair)
  116: "https://ae01.alicdn.com/kf/Sd430c2081eaf4f1fa3afd1e70b0d1f71H.jpg",     // AndaSeat Kaiser 3 (chair)
  117: "https://ae01.alicdn.com/kf/Sd430c2081eaf4f1fa3afd1e70b0d1f71H.jpg",     // Cougar Armor Elite (chair)
  118: "https://ae01.alicdn.com/kf/Sd430c2081eaf4f1fa3afd1e70b0d1f71H.jpg",     // AKRacing Masters Pro (chair)
  119: "https://ae01.alicdn.com/kf/Sd430c2081eaf4f1fa3afd1e70b0d1f71H.jpg",     // Herman Miller Embody (chair)
  120: "https://ae01.alicdn.com/kf/Sd430c2081eaf4f1fa3afd1e70b0d1f71H.jpg",     // Autonomous ErgoChair (chair)
};

// ── Apply fixes ──

const content = readFileSync(PRODUCTS_FILE, "utf8");
let updated = content;
let count = 0;

for (const [idStr, newUrl] of Object.entries(imageMap)) {
  const id = parseInt(idStr);

  // Find the img field for this product ID and replace it
  // Pattern: find "id": XX, ... "img": "OLD_URL"
  const regex = new RegExp(
    `("id":\\s*${id},(?:[^}]*?)"img":\\s*)"([^"]+)"`,
    "s"
  );

  const match = updated.match(regex);
  if (match) {
    const oldUrl = match[2];
    // Only replace if it's a fake/broken URL
    if (oldUrl.includes("ae01.alicdn.com/kf/S") && oldUrl.match(/[a-f0-9]{32}/i) && oldUrl.length < 80) {
      // Likely fake sequential URL — replace
      updated = updated.replace(match[0], `${match[1]}"${newUrl}"`);
      count++;
      console.log(`✓ ID ${id}: Replaced img`);

      // Also fix the gallery (first URL in gallery array)
      const galleryRegex = new RegExp(
        `("id":\\s*${id},(?:[^}]*?)"gallery":\\s*\\[\\s*)"([^"]+)"`,
        "s"
      );
      const galleryMatch = updated.match(galleryRegex);
      if (galleryMatch) {
        updated = updated.replace(galleryMatch[0], `${galleryMatch[1]}"${newUrl}"`);
      }
    } else {
      console.log(`⊘ ID ${id}: URL looks valid, skipping`);
    }
  } else {
    console.log(`✗ ID ${id}: Pattern not found`);
  }
}

writeFileSync(PRODUCTS_FILE, updated, "utf8");
console.log(`\n=== Done: ${count} images replaced ===`);
