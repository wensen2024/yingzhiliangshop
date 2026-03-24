import { invokeLLM } from "./_core/llm";
import { storagePut, storageGet } from "./storage";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { orders } from "../drizzle/schema";

/**
 * Verify payment proof image using LLM vision capabilities
 * Analyzes the image to detect payment amount, transaction ID, and payment method
 */
export async function verifyPaymentProof(
  imageUrl: string,
  orderId: number,
  expectedAmount: string,
  paymentMethod: "alipay" | "usdc"
): Promise<{
  verified: boolean;
  reason: string;
  detectedAmount?: string;
  detectedTxId?: string;
}> {
  try {
    // Use LLM to analyze the payment proof image
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a payment verification expert. Analyze the payment proof image and extract:
1. Payment amount (in CNY for Alipay, in USD for USDC)
2. Transaction ID or hash
3. Payment method confirmation (Alipay or USDC/Polygon)
4. Payment status (completed/success)

Respond in JSON format: {"amount": "...", "txId": "...", "method": "...", "status": "...", "isValid": true/false, "reason": "..."}`,
        },
        {
          role: "user",
          content: [
            {
              type: "text" as const,
              text: `Verify this ${paymentMethod === "alipay" ? "Alipay" : "USDC/Polygon"} payment proof. Expected amount: ${expectedAmount}. Is this a valid payment proof?`,
            },
            {
              type: "image_url" as const,
              image_url: {
                url: imageUrl,
                detail: "high" as const,
              },
            },
          ] as any,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "payment_verification",
          strict: true,
          schema: {
            type: "object",
            properties: {
              amount: { type: "string", description: "Detected payment amount" },
              txId: { type: "string", description: "Transaction ID or hash" },
              method: { type: "string", description: "Payment method" },
              status: { type: "string", description: "Payment status" },
              isValid: { type: "boolean", description: "Is valid payment proof" },
              reason: { type: "string", description: "Verification reason" },
            },
            required: ["amount", "txId", "method", "status", "isValid", "reason"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message.content;
    if (!content || typeof content !== "string") {
      return {
        verified: false,
        reason: "Failed to analyze image",
      };
    }

    const result = JSON.parse(content);

    // Verify amount matches (allow 1% tolerance for exchange rate fluctuation)
    const expectedNum = parseFloat(expectedAmount);
    const detectedNum = parseFloat(result.amount || "0");
    const tolerance = expectedNum * 0.01;
    const amountMatches = Math.abs(detectedNum - expectedNum) <= tolerance;

    const verified =
      result.isValid &&
      amountMatches &&
      result.status?.toLowerCase().includes("success") &&
      result.method?.toLowerCase().includes(paymentMethod === "alipay" ? "alipay" : "usdc");

    // Update order with verification result
    const db = await getDb();
    if (db && verified) {
      await db
        .update(orders)
        .set({
          proofVerified: "verified",
          txHash: result.txId,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId));
    }

    return {
      verified,
      reason: verified
        ? "Payment proof verified successfully"
        : `Verification failed: ${result.reason}`,
      detectedAmount: result.amount,
      detectedTxId: result.txId,
    };
  } catch (error) {
    console.error("[Payment Proof Verification Error]", error);
    return {
      verified: false,
      reason: `Verification error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Upload payment proof image to S3 and return URL
 */
export async function uploadPaymentProof(
  fileBuffer: Buffer,
  orderId: number,
  fileName: string
): Promise<{ url: string; key: string }> {
  const fileKey = `payment-proofs/${orderId}-${Date.now()}-${fileName}`;
  return storagePut(fileKey, fileBuffer, "image/jpeg");
}
