import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createOrder, updateOrderStatus } from "./db";
import { sendDeliveryEmail, PRODUCT_DOWNLOAD_LINKS } from "./email";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Orders ───────────────────────────────────────────────────────────────
  orders: router({
    /**
     * Submit a purchase order and trigger automatic email delivery.
     * Called from the frontend after the user fills in their email and
     * selects a payment method.
     */
    submit: publicProcedure
      .input(
        z.object({
          email: z.string().email("请输入有效的邮箱地址"),
          productId: z.string(),
          productName: z.string(),
          paymentMethod: z.enum(["alipay", "usdc"]),
          amount: z.string(),
          currency: z.enum(["CNY", "USD"]),
          txHash: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // 1. Persist order to database
        const orderId = await createOrder({
          email: input.email,
          productId: input.productId,
          productName: input.productName,
          paymentMethod: input.paymentMethod,
          amount: input.amount,
          currency: input.currency,
          txHash: input.txHash ?? null,
          status: "pending",
        });

        // 2. Send delivery email
        const emailResult = await sendDeliveryEmail({
          toEmail: input.email,
          productId: input.productId,
          paymentMethod: input.paymentMethod,
          amount: input.amount,
          currency: input.currency,
        });

        // 3. Update order status
        if (emailResult.success) {
          await updateOrderStatus(orderId, "delivered", new Date());
        } else {
          await updateOrderStatus(orderId, "failed");
          console.error(`[Order ${orderId}] Email delivery failed:`, emailResult.error);
        }

        // 4. Notify owner of new sale
        const amountLabel = input.currency === "CNY" ? `¥${input.amount}` : `$${input.amount} USDC`;
        await notifyOwner({
          title: `💰 新订单 — ${input.productName}`,
          content: `买家邮箱：${input.email}\n产品：${input.productName}\n支付方式：${input.paymentMethod === "alipay" ? "支付宝" : "Polygon USDC"}\n金额：${amountLabel}\n发货状态：${emailResult.success ? "✅ 已发送" : "❌ 发送失败"}`,
        });

        return {
          success: true,
          orderId,
          emailSent: emailResult.success,
          message: emailResult.success
            ? "购买成功！下载链接已发送至您的邮箱，请查收。"
            : "订单已记录，但邮件发送遇到问题，请联系 121126652qq@gmail.com 获取产品。",
        };
      }),

    /**
     * Get available products list (for frontend reference)
     */
    getProducts: publicProcedure.query(() => {
      return Object.entries(PRODUCT_DOWNLOAD_LINKS).map(([id, info]) => ({
        id,
        name: info.name,
        description: info.description,
      }));
    }),
  }),
});

export type AppRouter = typeof appRouter;
