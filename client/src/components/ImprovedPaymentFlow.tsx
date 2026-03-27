import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, Check, Upload, Mail, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
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

type FlowStep = "payment" | "proof" | "saving" | "email" | "success";

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
  const [email, setEmail] = useState("");
  const [proofUploaded, setProofUploaded] = useState(false);
  const [showProofUpload, setShowProofUpload] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [savingProgress, setSavingProgress] = useState(0);

  const USDC_ADDRESS = "0x3DbFf9E97b10a10d4A2079B4273473da7e6F4120";

  // 支付完成后自动跳转到上传凭证页面
  useEffect(() => {
    if (paymentConfirmed && currentStep === "payment") {
      setTimeout(() => {
        setCurrentStep("proof");
        toast.success(language === 'zh' ? '支付已确认，请上传付款凭证' : 'Payment confirmed! Please upload proof');
      }, 1000);
    }
  }, [paymentConfirmed, currentStep, language]);

  // 凭证验证后自动跳转到系统保存页面
  useEffect(() => {
    if (proofUploaded && currentStep === "proof") {
      setTimeout(() => {
        setCurrentStep("saving");
        toast.success(language === 'zh' ? '凭证已验证！系统正在保存...' : 'Proof verified! System saving...');
      }, 500);
    }
  }, [proofUploaded, currentStep, language]);

  // 系统保存页面显示2秒后自动跳转到邮箱页面
  useEffect(() => {
    if (currentStep === "saving") {
      setSavingProgress(0);
      const interval = setInterval(() => {
        setSavingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      const timer = setTimeout(() => {
        setCurrentStep("email");
        toast.success(language === 'zh' ? '凭证已保存！现在填写邮箱' : 'Proof saved! Now enter your email');
      }, 2000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [currentStep, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(USDC_ADDRESS);
    setCopied(true);
    toast.success(t.payment.copied);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentConfirmed = () => {
    setPaymentConfirmed(true);
  };

  const handleProofVerified = () => {
    setProofUploaded(true);
    setShowProofUpload(false);
    toast.success(language === 'zh' ? '凭证验证成功！' : 'Proof verified!');
  };

  const handleEmailSubmit = () => {
    if (!email) {
      toast.error(language === 'zh' ? '请输入邮箱地址' : 'Please enter email address');
      return;
    }
    if (!proofUploaded) {
      toast.error(language === 'zh' ? '必须先上传凭证' : 'Must upload proof first');
      return;
    }
    setCurrentStep("success");
  };

  const handleReset = () => {
    setCurrentStep("payment");
    setPaymentMethod("alipay");
    setEmail("");
    setProofUploaded(false);
    setPaymentConfirmed(false);
    setSavingProgress(0);
    onClose();
  };

  const amount = paymentMethod === "alipay" ? product.priceCNY : product.priceUSDC;
  const currency = paymentMethod === "alipay" ? "¥" : "$";

  // 步骤指示器
  const StepIndicator = () => {
    const steps = [
      { id: "payment", label: language === 'zh' ? "支付款项" : "Payment", emoji: "1️⃣" },
      { id: "proof", label: language === 'zh' ? "上传凭证" : "Upload Proof", emoji: "2️⃣" },
      { id: "saving", label: language === 'zh' ? "系统保存" : "System Saving", emoji: "3️⃣" },
      { id: "email", label: language === 'zh' ? "邮箱发货" : "Email Delivery", emoji: "4️⃣" },
    ] as const;

    const stepOrder = ["payment", "proof", "saving", "email"] as const;
    const currentIndex = stepOrder.indexOf(currentStep as any);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, idx) => {
            const isActive = stepOrder.indexOf(step.id as any) === currentIndex;
            const isCompleted = stepOrder.indexOf(step.id as any) < currentIndex;
            
            return (
              <div key={step.id} className="flex-1">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                      isCompleted
                        ? "bg-green-500/30 border border-green-500 text-green-400"
                        : isActive
                        ? "bg-blue-500/30 border border-blue-500 text-blue-400 animate-pulse"
                        : "bg-[oklch(0.2_0.03_260)] border border-[oklch(0.3_0.04_260)] text-[oklch(0.5_0.02_240)]"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : step.emoji}
                  </div>
                  <span className={`text-xs text-center font-medium ${
                    isActive ? "text-blue-400" : isCompleted ? "text-green-400" : "text-[oklch(0.5_0.02_240)]"
                  }`}>
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-0.5 mt-6 ${
                    isCompleted ? "bg-green-500/50" : "bg-[oklch(0.2_0.03_260)]"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
                {language === 'zh' 
                  ? "4步骤自动发货流程"
                  : "4-Step Automated Delivery Process"}
              </p>
            </DialogHeader>
          </div>

          {/* Step Indicator */}
          <div className="px-6 pt-6">
            <StepIndicator />
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Step 1: Payment */}
            {currentStep === "payment" && (
              <div className="space-y-6">
                <div className="bg-[oklch(0.15_0.04_240)] border border-[oklch(0.25_0.04_260)] rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[oklch(0.7_0.02_240)]">
                    {language === 'zh' 
                      ? '⚠️ 支付完成后，系统将自动跳转到上传凭证页面。'
                      : '⚠️ After payment, system will automatically proceed to upload proof.'}
                  </p>
                </div>

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
                        {language === 'zh' ? '扫描二维码或点击下方链接支付' : 'Scan QR code or click link below to pay'}
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
                  onClick={handlePaymentConfirmed}
                  className="w-full bg-gradient-to-r from-[oklch(0.72_0.22_240)] to-[oklch(0.65_0.2_300)]"
                >
                  {language === 'zh' ? '✓ 我已完成支付' : '✓ Payment Completed'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Upload Proof */}
            {currentStep === "proof" && (
              <div className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3 animate-pulse">
                  <Loader2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 animate-spin" />
                  <p className="text-sm text-blue-300">
                    {language === 'zh'
                      ? '✓ 支付已确认！现在上传付款凭证'
                      : '✓ Payment confirmed! Now upload proof'}
                  </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">
                    {language === 'zh'
                      ? '🔴 必须上传支付凭证并通过验证，才能继续！'
                      : '🔴 REQUIRED: Upload and verify payment proof to continue!'}
                  </p>
                </div>

                <div className="bg-[oklch(0.12_0.04_240)] border border-[oklch(0.2_0.03_260)] rounded-lg p-4">
                  <p className="text-sm text-[oklch(0.7_0.02_240)] mb-3 font-medium">
                    📸 {t.proof.subtitle}
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

                {proofUploaded ? (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-green-300">
                      {language === 'zh' ? '✅ 凭证已验证通过' : '✅ Proof verified'}
                    </span>
                  </div>
                ) : (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-center gap-2">
                    <span className="text-sm text-yellow-300">
                      {language === 'zh' ? '⏳ 等待凭证上传和验证' : '⏳ Waiting for proof upload and verification'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: System Saving */}
            {currentStep === "saving" && (
              <div className="space-y-6 text-center py-8">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto animate-pulse">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {language === 'zh' ? '系统正在保存凭证...' : 'System saving proof...'}
                </h3>
                <p className="text-sm text-[oklch(0.6_0.02_240)]">
                  {language === 'zh' ? '请稍候，系统正在验证和保存您的付款凭证' : 'Please wait while system verifies and saves your payment proof'}
                </p>
                <div className="mt-6 space-y-2">
                  <div className="h-2 bg-[oklch(0.2_0.03_260)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300"
                      style={{width: `${savingProgress}%`}}
                    />
                  </div>
                  <p className="text-xs text-[oklch(0.5_0.02_240)]">
                    {savingProgress}% {language === 'zh' ? '已完成' : 'Complete'}
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Email */}
            {currentStep === "email" && (
              <div className="space-y-6">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex gap-3 animate-pulse">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-300">
                    {language === 'zh'
                      ? '✅ 凭证已验证通过！现在填写邮箱完成发货'
                      : '✅ Proof verified! Now enter email to complete delivery'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-[oklch(0.7_0.02_240)] text-sm font-medium">
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
                    {language === 'zh' 
                      ? '产品下载链接将自动发送至此邮箱' 
                      : 'Download link will be sent to this email automatically'}
                  </p>
                </div>

                <Button
                  onClick={handleEmailSubmit}
                  className="w-full bg-gradient-to-r from-[oklch(0.72_0.22_240)] to-[oklch(0.65_0.2_300)]"
                >
                  {language === 'zh' ? '4️⃣ 发送到邮箱' : '4️⃣ Send to Email'} 🚀
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Success */}
            {currentStep === "success" && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">{t.payment.success}</h3>
                <p className="text-sm text-[oklch(0.6_0.02_240)]">
                  {language === 'zh'
                    ? `产品下载链接已发送至 ${email}`
                    : `Download link sent to ${email}`}
                  <br />
                  {language === 'zh'
                    ? '请检查收件箱（含垃圾邮件文件夹）'
                    : 'Check inbox (including spam folder)'}
                </p>
                <Button
                  onClick={handleReset}
                  className="w-full bg-gradient-to-r from-[oklch(0.72_0.22_240)] to-[oklch(0.65_0.2_300)]"
                >
                  {language === 'zh' ? '关闭' : 'Close'}
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
        orderId={0}
        expectedAmount={String(amount)}
        paymentMethod={paymentMethod}
        onVerified={handleProofVerified}
      />
    </>
  );
}
