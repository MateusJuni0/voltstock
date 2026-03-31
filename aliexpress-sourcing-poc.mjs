import fs from 'fs';

// Simulação de extração de dados reais baseada em pesquisa web e padrões do AliExpress
const sourcedData = [
  {
    aliexpress_id: "1005001234567890",
    title: "ASUS ROG Ally X Handheld Gaming PC - 1TB SSD 24GB RAM",
    category: "Periféricos e Gaming",
    cost_price: 790.00,
    images: ["https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?auto=format&fit=crop&q=80&w=800"],
    supplier_url: "https://www.aliexpress.com/item/1005001234567890.html",
    features: [
      { key: "Processador", value: "AMD Ryzen Z1 Extreme" },
      { key: "Ecrã", value: "7\" FHD 120Hz" },
      { key: "Armazenamento", value: "1TB NVMe SSD" }
    ]
  },
  {
    aliexpress_id: "1005009876543210",
    title: "AMD Ryzen 7 7800X3D - 8-Core 4.2 GHz (5.0 GHz Turbo)",
    category: "Hardware Base",
    cost_price: 340.00,
    images: ["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800"],
    supplier_url: "https://www.aliexpress.com/item/1005009876543210.html",
    features: [
      { key: "Socket", value: "AM5" },
      { key: "Cores/Threads", value: "8/16" },
      { key: "Cache", value: "96MB L3" }
    ]
  },
  {
    aliexpress_id: "1005005555444333",
    title: "Mechanical Keyboard Custom RGB - VoltStock Edition Base",
    category: "Periféricos e Gaming",
    cost_price: 45.00,
    images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800"],
    supplier_url: "https://www.aliexpress.com/item/1005005555444333.html",
    features: [
      { key: "Switches", value: "Gateron Yellow Linear" },
      { key: "Conectividade", value: "USB-C / Bluetooth 5.0" },
      { key: "Backlight", value: "RGB Customizável" }
    ]
  }
];

// Regra de Negócio: Margem de Lucro (Ex: 100% de lucro -> Preço de Venda = Custo * 2)
const PROFIT_MARGIN = 2.0;

const processedProducts = sourcedData.map(p => {
  const selling_price = p.cost_price * PROFIT_MARGIN;
  const slug = p.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  
  return {
    ...p,
    slug,
    selling_price,
    old_price: selling_price + (selling_price * 0.15), // Simula um preço antigo 15% maior para mostrar desconto
    margin_percentage: ((selling_price - p.cost_price) / selling_price * 100).toFixed(0) + "%",
    currency: "EUR",
    status: "PRONTO_PARA_IMPORTAR",
    imported_at: null
  };
});

// Guardar o resultado para inspeção do utilizador
const resultPath = 'projects/cm-ecommerce-tech/sourcing_preview.json';
fs.writeFileSync(resultPath, JSON.stringify(processedProducts, null, 2));

console.log(`✅ Sourcing concluído com sucesso!`);
console.log(`📊 Total de produtos processados: ${processedProducts.length}`);
console.log(`📂 Ficheiro de pré-visualização guardado em: ${resultPath}`);
