import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload, Check, AlertCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface PaymentProofUploadProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
  expectedAmount: string;
  paymentMethod: "alipay" | "usdc";
  onVerified?: () => void;
}

export function PaymentProofUpload({
  open,
  onClose,
  orderId,
  expectedAmount,
  paymentMethod,
  onVerified,
}: PaymentProofUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const verifyProof = trpc.orders.verifyProof.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("✅ 支付凭证验证成功！产品下载链接已发送至您的邮箱");
        onVerified?.();
        onClose();
      } else {
        toast.error(`❌ 验证失败：${data.reason}`);
      }
    },
    onError: (err) => {
      toast.error(`上传失败：${err.message}`);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件（JPG、PNG等）");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("文件大小不能超过5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("请先选择支付凭证图片");
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      if (!base64) {
        toast.error("文件转换失败");
        return;
      }

      verifyProof.mutate({
        orderId,
        proofImageBase64: base64,
        fileName: selectedFile.name,
        expectedAmount,
        paymentMethod,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[oklch(0.09_0.02_260)] border-[oklch(0.25_0.04_260)] text-foreground">
        <DialogHeader>
          <DialogTitle className="font-['Syne'] text-lg text-white">
            上传支付凭证
          </DialogTitle>
          <p className="text-sm text-[oklch(0.6_0.02_240)] mt-2">
            上传您的支付截图，我们将自动验证并发送产品
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* File input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Preview or upload area */}
          {preview ? (
            <div className="space-y-3">
              <div className="relative">
                <img
                  src={preview}
                  alt="Payment proof preview"
                  className="w-full h-48 object-cover rounded-lg border border-[oklch(0.2_0.03_260)]"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1.5 transition"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-[oklch(0.6_0.02_240)]">
                文件：{selectedFile?.name}
              </p>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-[oklch(0.25_0.04_260)] rounded-lg p-6 hover:border-[oklch(0.72_0.22_240)] transition flex flex-col items-center gap-2 cursor-pointer"
            >
              <Upload className="w-8 h-8 text-[oklch(0.6_0.02_240)]" />
              <span className="text-sm text-[oklch(0.7_0.02_240)] font-medium">
                点击选择图片
              </span>
              <span className="text-xs text-[oklch(0.45_0.02_240)]">
                支持 JPG、PNG 等格式，最大 5MB
              </span>
            </button>
          )}

          {/* Info box */}
          <div className="bg-[oklch(0.12_0.04_240)] border border-[oklch(0.2_0.03_260)] rounded-lg p-3 space-y-2">
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 text-[oklch(0.72_0.22_240)] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[oklch(0.6_0.02_240)] space-y-1">
                <p className="font-medium">验证要求：</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>清晰显示支付金额：{expectedAmount}</li>
                  <li>显示支付方式：{paymentMethod === "alipay" ? "支付宝" : "Polygon USDC"}</li>
                  <li>显示交易状态为"成功"或"已完成"</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={verifyProof.isPending}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || verifyProof.isPending}
              className="flex-1 bg-gradient-to-r from-[oklch(0.72_0.22_240)] to-[oklch(0.65_0.2_300)]"
            >
              {verifyProof.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  验证中...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  验证并发货
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
