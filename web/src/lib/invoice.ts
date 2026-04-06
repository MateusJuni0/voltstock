/**
 * Invoice PDF generation using browser-native approach.
 * Generates an HTML invoice that can be printed to PDF client-side,
 * or rendered server-side via a simple HTML response.
 */

interface InvoiceItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface InvoiceData {
  invoiceNumber: string;
  orderId: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerNif?: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    district: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  ivaRate: number; // 23% for Portugal
}

export function generateInvoiceHtml(data: InvoiceData): string {
  const ivaAmount = data.total - data.total / (1 + data.ivaRate / 100);
  const baseAmount = data.total - ivaAmount;

  const itemRows = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0">${item.product_name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:center">${item.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:right">${item.unit_price.toFixed(2)} €</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:right">${item.total_price.toFixed(2)} €</td>
    </tr>`,
    )
    .join("");

  const address = [
    data.shippingAddress.line1,
    data.shippingAddress.line2,
    `${data.shippingAddress.postalCode} ${data.shippingAddress.city}`,
    data.shippingAddress.district,
  ]
    .filter(Boolean)
    .join("<br/>");

  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="utf-8"/>
  <title>Factura ${data.invoiceNumber} — VoltStock</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; }
      .no-print { display: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      background: #fff;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8fafc; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
  </style>
</head>
<body>

  <!-- Print button -->
  <div class="no-print" style="text-align:right;margin-bottom:20px">
    <button onclick="window.print()" style="padding:10px 24px;background:#f97316;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600">
      Imprimir / Guardar PDF
    </button>
  </div>

  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px">
    <div>
      <h1 style="font-size:28px;margin:0;color:#f97316;font-weight:700">⚡ VoltStock</h1>
      <p style="color:#64748b;margin:4px 0 0;font-size:13px">Powered by CMTecnologia, Lda.</p>
    </div>
    <div style="text-align:right">
      <h2 style="font-size:24px;margin:0;color:#1e293b">FACTURA</h2>
      <p style="color:#64748b;margin:4px 0 0;font-size:14px">${data.invoiceNumber}</p>
      <p style="color:#64748b;margin:2px 0 0;font-size:13px">Data: ${data.date}</p>
    </div>
  </div>

  <!-- Parties -->
  <div style="display:flex;justify-content:space-between;margin-bottom:32px">
    <div>
      <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;margin:0 0 8px">Emitente</h3>
      <p style="margin:0;font-size:14px;line-height:1.6">
        <strong>CMTecnologia, Lda.</strong><br/>
        NIF: 311848710<br/>
        Portugal<br/>
        V0ltSt0ck22@gmail.com
      </p>
    </div>
    <div style="text-align:right">
      <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;margin:0 0 8px">Cliente</h3>
      <p style="margin:0;font-size:14px;line-height:1.6">
        <strong>${data.customerName}</strong><br/>
        ${address}<br/>
        ${data.customerEmail}
        ${data.customerNif ? `<br/>NIF: ${data.customerNif}` : ""}
      </p>
    </div>
  </div>

  <!-- Items -->
  <table style="margin-bottom:24px">
    <thead>
      <tr>
        <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #e2e8f0">Descrição</th>
        <th style="padding:10px 12px;text-align:center;border-bottom:2px solid #e2e8f0">Qtd</th>
        <th style="padding:10px 12px;text-align:right;border-bottom:2px solid #e2e8f0">Preço Unit.</th>
        <th style="padding:10px 12px;text-align:right;border-bottom:2px solid #e2e8f0">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
      ${
        data.shippingCost > 0
          ? `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0">Envio</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:center">1</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:right">${data.shippingCost.toFixed(2)} €</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:right">${data.shippingCost.toFixed(2)} €</td>
      </tr>`
          : ""
      }
    </tbody>
  </table>

  <!-- Totals -->
  <div style="display:flex;justify-content:flex-end">
    <table style="width:280px">
      <tr>
        <td style="padding:6px 12px;color:#64748b">Base Tributável</td>
        <td style="padding:6px 12px;text-align:right">${baseAmount.toFixed(2)} €</td>
      </tr>
      <tr>
        <td style="padding:6px 12px;color:#64748b">IVA (${data.ivaRate}%)</td>
        <td style="padding:6px 12px;text-align:right">${ivaAmount.toFixed(2)} €</td>
      </tr>
      <tr style="border-top:2px solid #1e293b">
        <td style="padding:12px;font-weight:700;font-size:16px">Total</td>
        <td style="padding:12px;text-align:right;font-weight:700;font-size:16px;color:#f97316">${data.total.toFixed(2)} €</td>
      </tr>
    </table>
  </div>

  <!-- Legal -->
  <div style="margin-top:48px;padding-top:16px;border-top:1px solid #e2e8f0">
    <p style="font-size:11px;color:#94a3b8;text-align:center;margin:0">
      IVA incluído nos preços apresentados, à taxa legal em vigor (${data.ivaRate}%).
      Documento emitido por CMTecnologia, Lda. — NIF: 311848710 — voltstock.pt
    </p>
    <p style="font-size:11px;color:#94a3b8;text-align:center;margin:4px 0 0">
      Encomenda: #${data.orderId.slice(0, 8).toUpperCase()} | Ref: ${data.invoiceNumber}
    </p>
  </div>

</body>
</html>`;
}

export function generateInvoiceNumber(orderId: string, date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const seq = orderId.slice(0, 6).toUpperCase();
  return `FT ${year}/${month}-${seq}`;
}
