import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, Check, Upload, Mail, Loader2, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import { PaymentProofUpload } from "./PaymentProofUpload";

interface ImprovedPaymentFlowProps {
  product: {
    id: string;
    title: string;
    priceCNY: number;
    priceUSDC: number;
  };
  open: boolean;
  onClose: () => void;
}

type FlowStep = "payment" | "proof" | "email" | "success";

export function ImprovedPaymentFlow({
  product,
  open,
  onClose,
}: ImprovedPaymentFlowProps) {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [currentStep, setCurrentStep] = useState<FlowStep>("payment");
  const [paymentMethod, setPaymentMethod] = useState<"alipay" | "usdc">("alipay");
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [proofUploaded, setProofUploaded] = useState(false);
  const [showProofUpload, setShowProofUpload] = useState(false);

  const USDC_ADDRESS = "0x3DbFf9E97b10a10d4A2079B4273473da7e6F4120";

  const handleCopy = () => {
    navigator.clipboard.writeText(USDC_ADDRESS);
    setCopied(true);
    toast.success(t.payment.copied);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProofVerified = () => {
    setProofUploaded(true);
    setShowProofUpload(false);
    setCurrentStep("email");
  };

  const handleEmailSubmit = () => {
    if (!email) {
      toast.error(t.payment.emailPlaceholder);
      return;
    }
    setCurrentStep("success");
  };

  const handleReset = () => {
    setCurrentStep("payment");
    setPaymentMethod("alipay");
    setEmail("");
    setProofUploaded(false);
    setOrderId(null);
    onClose();
  };

  const amount = paymentMethod === "alipay" ? product.priceCNY : product.priceUSDC;
  const currency = paymentMethod === "alipay" ? "¥" : "$";

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg bg-[oklch(0.09_0.02_260)] border-[oklch(0.25_0.04_260)] text-foreground p-0 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[oklch(0.12_0.04_240)] to-[oklch(0.12_0.03_280)] p-6 border-b border-[oklch(0.2_0.03_260)]">
            <DialogHeader>
              <DialogTitle className="font-['Syne'] text-xl text-white">
                {t.payment.title} · {product.title}
              </DialogTitle>
              <p className="text-sm text-[oklch(0.6_0.02_240)] mt-2">
                {t.payment.step1} → {t.payment.step2} → {t.payment.step3} → {t.payment.step4}
              </p>
            </DialogHeader>
          </div>

          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {/* Step 1: Payment Method & QR Code */}
            {currentStep === "payment" && (
              <div className="space-y-6">
                <div>
                  <Label className="text-[oklch(0.7_0.02_240)] text-sm mb-3 block">
                    {t.payment.selectMethod}
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["alipay", "usdc"] as const).map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-4 rounded-lg border-2 transition ${
                          paymentMethod === method
                            ? "border-[oklch(0.72_0.22_240)] bg-[oklch(0.15_0.04_240)]"
                            : "border-[oklch(0.2_0.03_260)] hover:border-[oklch(0.3_0.04_260)]"
                        }`}
                      >
                        <div className="text-sm font-medium text-white">
                          {method === "alipay" ? t.payment.alipay : t.payment.usdc}
                        </div>
                        <div className="text-xs text-[oklch(0.6_0.02_240)] mt-1">
                          {currency}{amount}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-[oklch(0.12_0.04_240)] border border-[oklch(0.2_0.03_260)] rounded-lg p-4 space-y-3">
                  <div className="text-sm">
                    <div className="text-[oklch(0.6_0.02_240)] mb-1">{t.payment.amount}</div>
                    <div className="text-2xl font-bold text-white">
                      {currency}{amount}
                    </div>
                  </div>

                  {paymentMethod === "alipay" ? (
                    <div className="space-y-2">
                      <p className="text-xs text-[oklch(0.6_0.02_240)]">
                        扫描二维码或点击下方链接支付
                      </p>
                      <img
                        src="https://d2xsxph8kpxj0f.cloudfront.net/310519663451731631/LimBCtLaywKd7az4jrTc8V/alipay-qr_8719856e.jpg"
                        alt="Alipay QR"
                        className="w-32 h-32 rounded border border-[oklch(0.2_0.03_260)]"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-[oklch(0.6_0.02_240)]">
                        Polygon Network Address
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs bg-[oklch(0.08_0.02_260)] p-2 rounded border border-[oklch(0.15_0.03_260)] text-[oklch(0.72_0.22_240)] overflow-x-auto">
                          {USDC_ADDRESS}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopy}
                          className="flex-shrink-0"
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => setCurrentStep("proof")}
                  className="w-full bg-gradient-to-r from-[oklch(0.72_0.22_240)] to-[oklch(0.65_0.2_300)]"
                >
                  {t.payment.step2}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Upload Proof */}
            {currentStep === "proof" && (
              <div className="space-y-6">
                <div className="bg-[oklch(0.12_0.04_240)] border border-[oklch(0.2_0.03_260)] rounded-lg p-4">
                  <p className="text-sm text-[oklch(0.7_0.02_240)] mb-3">
                    {t.proof.subtitle}
                  </p>
                  <Button
                    onClick={() => setShowProofUpload(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {t.payment.step2}
                  </Button>
                </div>

                {proofUploaded && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-green-300">凭证已验证通过</span>
                  </div>
                )}

                <Button
                  onClick={() => setCurrentStep("email")}
                  disabled={!proofUploaded}
                  className="w-full bg-gradient-to-r from-[oklch(0.72_0.22_240)] to-[oklch(0.65_0.2_300)]"
                >
                  {t.payment.step3}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 3: Email */}
            {currentStep === "email" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[oklch(0.7_0.02_240)] text-sm">
                    <Mail className="w-3.5 h-3.5 inline mr-1.5" />
                    {t.payment.email}
                  </Label>
                  <Input
                    type="email"
                    placeholder={t.payment.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[oklch(0.12_0.02_260)] border-[oklch(0.25_0.04_260)] text-white"
                  />
                  <p className="text-xs text-[oklch(0.45_0.02_240)]">
                    {language === 'zh' ? '产品下载链接将自动发送至此邮箱' : 'Download link will be sent to this email automatically'}
                  </p>
                </div>

                <Button
                  onClick={handleEmailSubmit}
                  className="w-full bg-gradient-to-r from-[oklch(0.72_0.22_240)] to-[oklch(0.65_0.2_300)]"
                >
                  {t.payment.step4}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 4: Success */}
            {currentStep === "success" && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">{t.payment.success}</h3>
                <p className="text-sm text-[oklch(0.6_0.02_240)]">
                  {t.payment.successMsg} <span className="text-[oklch(0.72_0.22_240)]">{email}</span>
                  <br />
                  {t.payment.checkInbox}
                </p>
                <Button
                  onClick={handleReset}
                  className="w-full bg-gradient-to-r from-[oklch(0.72_0.22_240)] to-[oklch(0.65_0.2_300)]"
                >
                  关闭
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Proof Upload Modal */}
      <PaymentProofUpload
        open={showProofUpload}
        onClose={() => setShowProofUpload(false)}
        orderId={orderId || 0}
        expectedAmount={String(amount)}
        paymentMethod={paymentMethod}
        onVerified={handleProofVerified}
      />
    </>
  );
}
