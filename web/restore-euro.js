const fs = require('fs');

function restoreEuro(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/99,00 '/g, '99,00 €');
  content = content.replace(/49,90 '/g, '49,90 €');
  content = content.replace(/29,90 '/g, '29,90 €');
  content = content.replace(/89,90 '/g, '89,90 €');
  content = content.replace(/,90 '/g, ',90 €');
  content = content.replace(/} €`/g, "} €`");
  fs.writeFileSync(file, content, 'utf8');
}

restoreEuro('projects/cm-ecommerce-tech/web/src/data/products.ts');
restoreEuro('projects/cm-ecommerce-tech/web/src/components/FeaturedProducts.tsx');
restoreEuro('projects/cm-ecommerce-tech/web/src/components/ProductsPage.tsx');
console.log('Restored euros');
