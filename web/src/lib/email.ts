import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY not configured");
  }
  if (!_resend) {
    _resend = new Resend(key);
  }
  return _resend;
}

// While domain is not verified, Resend requires sending from onboarding@resend.dev
// Change to "VoltStock <noreply@voltstock.pt>" after domain verification
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "VoltStock <onboarding@resend.dev>";

// ── Types ───────────────────────────────────────────────────────────────────

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface OrderEmailData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    district: string;
  };
  nif?: string;
}

// ── Email Templates (inline HTML) ───────────────────────────────────────────

function orderConfirmationHtml(data: OrderEmailData): string {
  const itemRows = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #1a1f2e;color:#e2e8f0">${item.product_name}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #1a1f2e;color:#e2e8f0;text-align:center">${item.quantity}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #1a1f2e;color:#e2e8f0;text-align:right">${item.unit_price.toFixed(2)} €</td>
      <td style="padding:12px 16px;border-bottom:1px solid #1a1f2e;color:#e2e8f0;text-align:right">${item.total_price.toFixed(2)} €</td>
    </tr>`,
    )
    .join("");

  const addressLines = [
    data.shippingAddress.line1,
    data.shippingAddress.line2,
    `${data.shippingAddress.postalCode} ${data.shippingAddress.city}`,
    data.shippingAddress.district,
  ]
    .filter(Boolean)
    .join("<br/>");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#0a0e1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">

  <!-- Header -->
  <div style="text-align:center;padding:24px 0;border-bottom:1px solid #1a1f2e">
    <h1 style="color:#f97316;font-size:28px;margin:0;font-weight:700">⚡ VoltStock</h1>
    <p style="color:#94a3b8;margin:8px 0 0;font-size:14px">Confirmação de Encomenda</p>
  </div>

  <!-- Greeting -->
  <div style="padding:24px 0">
    <h2 style="color:#f8fafc;font-size:20px;margin:0 0 8px">Olá ${data.customerName}!</h2>
    <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0">
      A tua encomenda <strong style="color:#f97316">#${data.orderId.slice(0, 8).toUpperCase()}</strong> foi recebida com sucesso.
      Estamos a preparar tudo para envio.
    </p>
  </div>

  <!-- Order Items -->
  <table style="width:100%;border-collapse:collapse;background:#0f1424;border-radius:12px;overflow:hidden">
    <thead>
      <tr style="background:#161b2e">
        <th style="padding:12px 16px;color:#f97316;font-size:12px;text-transform:uppercase;text-align:left">Produto</th>
        <th style="padding:12px 16px;color:#f97316;font-size:12px;text-transform:uppercase;text-align:center">Qtd</th>
        <th style="padding:12px 16px;color:#f97316;font-size:12px;text-transform:uppercase;text-align:right">Preço</th>
        <th style="padding:12px 16px;color:#f97316;font-size:12px;text-transform:uppercase;text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3" style="padding:12px 16px;color:#94a3b8;text-align:right">Subtotal</td>
        <td style="padding:12px 16px;color:#e2e8f0;text-align:right">${data.subtotal.toFixed(2)} €</td>
      </tr>
      <tr>
        <td colspan="3" style="padding:12px 16px;color:#94a3b8;text-align:right">Envio</td>
        <td style="padding:12px 16px;color:#e2e8f0;text-align:right">${data.shippingCost === 0 ? "Grátis" : `${data.shippingCost.toFixed(2)} €`}</td>
      </tr>
      <tr style="background:#161b2e">
        <td colspan="3" style="padding:16px;color:#f8fafc;text-align:right;font-weight:700;font-size:16px">Total</td>
        <td style="padding:16px;color:#f97316;text-align:right;font-weight:700;font-size:16px">${data.total.toFixed(2)} €</td>
      </tr>
    </tfoot>
  </table>

  <!-- Shipping Address -->
  <div style="background:#0f1424;border-radius:12px;padding:20px;margin-top:16px">
    <h3 style="color:#f97316;font-size:14px;margin:0 0 12px;text-transform:uppercase">Morada de Envio</h3>
    <p style="color:#e2e8f0;font-size:14px;line-height:1.6;margin:0">
      ${data.customerName}<br/>
      ${addressLines}
      ${data.nif ? `<br/><span style="color:#94a3b8">NIF: ${data.nif}</span>` : ""}
    </p>
  </div>

  <!-- Footer -->
  <div style="text-align:center;padding:32px 0 16px;border-top:1px solid #1a1f2e;margin-top:24px">
    <p style="color:#94a3b8;font-size:13px;margin:0">
      Dúvidas? Responde a este email ou contacta-nos via
      <a href="https://wa.me/351961227666" style="color:#f97316;text-decoration:none">WhatsApp</a>.
    </p>
    <p style="color:#475569;font-size:12px;margin:16px 0 0">
      CMTecnologia, Lda. | NIF: 311848710 | Portugal
    </p>
  </div>

</div>
</body>
</html>`;
}

// ── Send Functions ──────────────────────────────────────────────────────────

export async function sendOrderConfirmation(data: OrderEmailData): Promise<void> {
  const resend = getResend();

  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Encomenda confirmada #${data.orderId.slice(0, 8).toUpperCase()} — VoltStock`,
    html: orderConfirmationHtml(data),
  });
}

export async function sendShippingNotification(
  email: string,
  name: string,
  orderId: string,
  trackingCode?: string,
): Promise<void> {
  const resend = getResend();

  const trackingHtml = trackingCode
    ? `<p style="color:#e2e8f0;font-size:15px;margin:16px 0">Código de rastreio: <strong style="color:#f97316">${trackingCode}</strong></p>`
    : "";

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Encomenda enviada #${orderId.slice(0, 8).toUpperCase()} — VoltStock`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#0a0e1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
  <div style="text-align:center;padding:24px 0;border-bottom:1px solid #1a1f2e">
    <h1 style="color:#f97316;font-size:28px;margin:0;font-weight:700">⚡ VoltStock</h1>
  </div>
  <div style="padding:24px 0">
    <h2 style="color:#f8fafc;font-size:20px;margin:0 0 12px">A tua encomenda foi enviada! 📦</h2>
    <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0">
      Olá ${name}, a encomenda <strong style="color:#f97316">#${orderId.slice(0, 8).toUpperCase()}</strong> já está a caminho.
    </p>
    ${trackingHtml}
  </div>
  <div style="text-align:center;padding:24px 0;border-top:1px solid #1a1f2e">
    <p style="color:#475569;font-size:12px">CMTecnologia, Lda. | NIF: 311848710 | Portugal</p>
  </div>
</div>
</body>
</html>`,
  });
}
