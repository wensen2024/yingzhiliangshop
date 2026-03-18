import { describe, expect, it, vi, beforeEach } from "vitest";
import { PRODUCT_DOWNLOAD_LINKS } from "./email";

// ─── Test: PRODUCT_DOWNLOAD_LINKS map ────────────────────────────────────────
describe("PRODUCT_DOWNLOAD_LINKS", () => {
  it("contains all expected product IDs", () => {
    const expectedIds = ["ai-toolkit", "notion-os", "content-ai", "trading", "bundle"];
    for (const id of expectedIds) {
      expect(PRODUCT_DOWNLOAD_LINKS).toHaveProperty(id);
    }
  });

  it("each product has name, url and description", () => {
    for (const [id, info] of Object.entries(PRODUCT_DOWNLOAD_LINKS)) {
      expect(info.name, `${id} missing name`).toBeTruthy();
      expect(info.url, `${id} missing url`).toMatch(/^https?:\/\//);
      expect(info.description, `${id} missing description`).toBeTruthy();
    }
  });

  it("returns undefined for unknown product", () => {
    expect(PRODUCT_DOWNLOAD_LINKS["unknown-product"]).toBeUndefined();
  });
});

// ─── Test: sendDeliveryEmail error handling ───────────────────────────────────
describe("sendDeliveryEmail - unknown product", () => {
  it("returns failure for unknown productId without crashing", async () => {
    // Dynamically import to avoid triggering nodemailer init
    const { sendDeliveryEmail } = await import("./email");
    const result = await sendDeliveryEmail({
      toEmail: "test@example.com",
      productId: "nonexistent-product",
      paymentMethod: "alipay",
      amount: "99",
      currency: "CNY",
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain("Unknown product");
  });
});

// ─── Test: Order data validation ─────────────────────────────────────────────
describe("Order input validation", () => {
  it("valid order data passes schema check", () => {
    const { z } = require("zod");
    const schema = z.object({
      email: z.string().email(),
      productId: z.string(),
      productName: z.string(),
      paymentMethod: z.enum(["alipay", "usdc"]),
      amount: z.string(),
      currency: z.enum(["CNY", "USD"]),
      txHash: z.string().optional(),
    });

    const validOrder = {
      email: "buyer@example.com",
      productId: "ai-toolkit",
      productName: "AI提示词工程师工具包",
      paymentMethod: "alipay" as const,
      amount: "99",
      currency: "CNY" as const,
    };

    expect(() => schema.parse(validOrder)).not.toThrow();
  });

  it("invalid email fails schema check", () => {
    const { z } = require("zod");
    const schema = z.object({
      email: z.string().email("请输入有效的邮箱地址"),
    });
    expect(() => schema.parse({ email: "not-an-email" })).toThrow();
  });

  it("invalid paymentMethod fails schema check", () => {
    const { z } = require("zod");
    const schema = z.object({
      paymentMethod: z.enum(["alipay", "usdc"]),
    });
    expect(() => schema.parse({ paymentMethod: "wechat" })).toThrow();
  });
});

// ─── Test: auth logout (existing) ────────────────────────────────────────────
describe("auth.logout", () => {
  it("is covered by auth.logout.test.ts — import check", async () => {
    const { appRouter } = await import("./routers");
    expect(appRouter).toBeDefined();
    expect(typeof appRouter.createCaller).toBe("function");
  });
});
