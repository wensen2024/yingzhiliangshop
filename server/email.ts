import nodemailer from "nodemailer";

// ─── Gmail SMTP transporter ───────────────────────────────────────────────────
// Uses Gmail App Password (16-char) — no OAuth needed.
// Set GMAIL_USER and GMAIL_APP_PASSWORD in environment secrets.
let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!_transporter) {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    if (!user || !pass) {
      throw new Error("GMAIL_USER or GMAIL_APP_PASSWORD is not configured");
    }
    _transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return _transporter;
}

// ─── Product download links map ───────────────────────────────────────────────
export const PRODUCT_DOWNLOAD_LINKS: Record<
  string,
  { name: string; url: string; description: string }
> = {
  "ai-toolkit": {
    name: "AI提示词工程师工具包 2026",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663451731631/LimBCtLaywKd7az4jrTc8V/product1_ai_toolkit_2620414b.pdf",
    description: "包含500+精选提示词模板，覆盖ChatGPT、Claude、Gemini、Midjourney全平台",
  },
  "notion-os": {
    name: "Notion商业运营系统",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663451731631/LimBCtLaywKd7az4jrTc8V/product2_notion_os_cad89f49.pdf",
    description: "完整的Notion商业操作系统，含CRM、项目管理、财务追踪等5大模块",
  },
  "content-ai": {
    name: "AI自媒体内容创作系统",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663451731631/LimBCtLaywKd7az4jrTc8V/product3_content_ai_9672ad9c.pdf",
    description: "2026年最完整的AI辅助自媒体运营系统，覆盖抖音、小红书、YouTube全平台",
  },
  trading: {
    name: "量化交易策略手册 2026",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663451731631/LimBCtLaywKd7az4jrTc8V/product4_trading_bc7aa265.pdf",
    description: "专为散户设计的量化交易入门到进阶完整手册，含10+实战策略和Python代码",
  },
  bundle: {
    name: "全套产品组合包（4合1）",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663451731631/LimBCtLaywKd7az4jrTc8V/product1_ai_toolkit_2620414b.pdf",
    description: "包含全部4款产品的完整内容，一次性获得所有资料",
  },
};

// ─── Send delivery email via Gmail ───────────────────────────────────────────
export async function sendDeliveryEmail(params: {
  toEmail: string;
  productId: string;
  paymentMethod: "alipay" | "usdc";
  amount: string;
  currency: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const product = PRODUCT_DOWNLOAD_LINKS[params.productId];
  if (!product) {
    return { success: false, error: `Unknown product: ${params.productId}` };
  }

  const paymentLabel = params.paymentMethod === "alipay" ? "支付宝" : "Polygon USDC";
  const amountLabel =
    params.currency === "CNY" ? `¥${params.amount}` : `$${params.amount} USDC`;
  const senderEmail = process.env.GMAIL_USER ?? "121126652qq@gmail.com";

  const html = `
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>您的产品已发货 — DigitalFlow Studio</title>
</head>
<body style="margin:0;padding:0;background:#07080f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#07080f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#0d0f1a;border-radius:16px;border:1px solid #1e2340;overflow:hidden;max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f1729,#1a0f2e);padding:40px 40px 30px;text-align:center;border-bottom:1px solid #1e2340;">
              <div style="margin-bottom:16px;">
                <span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Digital<span style="color:#4f9cf9;">Flow</span> Studio</span>
              </div>
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#fff;line-height:1.2;">
                🎉 您的产品已发货！
              </h1>
              <p style="margin:12px 0 0;color:#6b7db3;font-size:15px;">感谢您的购买，请点击下方按钮立即下载</p>
            </td>
          </tr>

          <!-- Order Info -->
          <tr>
            <td style="padding:32px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:12px;border:1px solid #1e2340;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #1e2340;">
                    <p style="margin:0;font-size:12px;color:#4b5563;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">购买产品</p>
                    <p style="margin:0;font-size:18px;font-weight:700;color:#fff;">${product.name}</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#6b7db3;">${product.description}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:50%;padding-right:12px;">
                          <p style="margin:0;font-size:12px;color:#4b5563;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">支付方式</p>
                          <p style="margin:0;font-size:14px;color:#9ca3af;">${paymentLabel}</p>
                        </td>
                        <td style="width:50%;padding-left:12px;">
                          <p style="margin:0;font-size:12px;color:#4b5563;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">支付金额</p>
                          <p style="margin:0;font-size:14px;color:#9ca3af;">${amountLabel}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Download Button -->
          <tr>
            <td style="padding:32px 40px;">
              <div style="text-align:center;">
                <a href="${product.url}"
                   style="display:inline-block;background:linear-gradient(135deg,#4f9cf9,#7c5cbf);color:#fff;font-size:16px;font-weight:700;text-decoration:none;padding:16px 48px;border-radius:12px;letter-spacing:0.3px;">
                  ⬇️ 立即下载产品
                </a>
                <p style="margin:16px 0 0;font-size:12px;color:#4b5563;">
                  链接永久有效 · 如遇问题请回复此邮件
                </p>
              </div>
            </td>
          </tr>

          <!-- Tips -->
          <tr>
            <td style="padding:0 40px 32px;">
              <div style="background:#0a1628;border:1px solid #1e3a5f;border-radius:12px;padding:20px 24px;">
                <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#4f9cf9;">📌 使用提示</p>
                <ul style="margin:0;padding-left:18px;color:#6b7db3;font-size:13px;line-height:1.8;">
                  <li>PDF文件建议使用 Adobe Reader 或系统自带阅读器打开</li>
                  <li>Notion模板请复制到您自己的工作区后使用</li>
                  <li>Python代码文件需要安装 Python 3.10+ 环境</li>
                  <li>产品将持续更新，请保存此邮件以便重新下载</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1e2340;text-align:center;">
              <p style="margin:0;font-size:13px;color:#374151;">
                如有任何问题，请联系：
                <a href="mailto:${senderEmail}" style="color:#4f9cf9;text-decoration:none;">${senderEmail}</a>
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#1f2937;">
                © 2026 DigitalFlow Studio · 7天无理由退款保障
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: `"DigitalFlow Studio" <${senderEmail}>`,
      to: params.toEmail,
      subject: `🎉 您的产品已发货 — ${product.name}`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Email] Gmail SMTP send failed:", msg);
    return { success: false, error: msg };
  }
}
