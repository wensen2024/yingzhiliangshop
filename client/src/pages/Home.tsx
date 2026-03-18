/**
 * DigitalFlow Studio - 2026全球热销数字产品商店
 * Design Philosophy: Deep Space Tech — Dark cosmic aesthetic with neon accents
 * Color: Deep space navy (#07080f) + Electric blue + Gold
 * Typography: Syne (headings) + Space Grotesk (body)
 * Layout: Asymmetric sections with diagonal cuts and floating elements
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Zap, Star, Shield, Download, Globe, TrendingUp, Users,
  ChevronRight, Copy, Check, X, Menu, ExternalLink,
  Sparkles, Lock, Clock, Award, BarChart3, Brain, FileText, Cpu
} from "lucide-react";

// ─── Asset URLs ───────────────────────────────────────────────────────────────
const ASSETS = {
  heroBg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663451731631/LimBCtLaywKd7az4jrTc8V/hero-bg-ewQexaGjZamNHsbrDuSDhW.webp",
  productAI: "https://d2xsxph8kpxj0f.cloudfront.net/310519663451731631/LimBCtLaywKd7az4jrTc8V/product-ai-toolkit-jcPWycCbKvjRNkK65CTBGV.webp",
  productNotion: "https://d2xsxph8kpxj0f.cloudfront.net/310519663451731631/LimBCtLaywKd7az4jrTc8V/product-notion-Ad6yEcvmGiZt6WVxhnXWNc.webp",
  productContent: "https://d2xsxph8kpxj0f.cloudfront.net/310519663451731631/LimBCtLaywKd7az4jrTc8V/product-content-ai-2AqYWzfFm6cXrmP7ccLxnB.webp",
  productTrading: "https://d2xsxph8kpxj0f.cloudfront.net/310519663451731631/LimBCtLaywKd7az4jrTc8V/product-trading-gnKb5GgSKA9rgv2bdX9uAB.webp",
  alipayQR: "https://d2xsxph8kpxj0f.cloudfront.net/310519663451731631/LimBCtLaywKd7az4jrTc8V/alipay-qr_8719856e.jpg",
};

// ─── Product Data ─────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "ai-toolkit",
    badge: "HOT",
    badgeType: "hot",
    icon: Brain,
    title: "AI提示词工程师工具包",
    subtitle: "Prompt Engineering Toolkit 2026",
    image: ASSETS.productAI,
    priceCNY: 99,
    priceUSDC: 14,
    originalPriceCNY: 299,
    rating: 4.9,
    sales: 2847,
    description: "包含500+精选提示词模板，覆盖ChatGPT、Claude、Gemini、Midjourney全平台。附赠提示词优化框架、角色扮演系统、思维链模板，让你的AI输出质量提升300%。",
    features: [
      "500+ 跨平台精选提示词模板",
      "ChatGPT / Claude / Gemini / Midjourney 全覆盖",
      "提示词优化框架 CRAFT 方法论",
      "商业写作、代码生成、创意设计专项模板",
      "终身更新，持续添加新模板",
      "PDF + Notion 双格式交付",
    ],
    deliveryNote: "购买后立即通过邮件发送下载链接",
    color: "blue",
  },
  {
    id: "notion-os",
    badge: "BEST",
    badgeType: "new",
    icon: FileText,
    title: "Notion商业运营系统",
    subtitle: "Business OS Template Pack",
    image: ASSETS.productNotion,
    priceCNY: 79,
    priceUSDC: 11,
    originalPriceCNY: 199,
    rating: 4.8,
    sales: 1923,
    description: "一套完整的Notion商业操作系统，包含CRM客户管理、项目管理、财务追踪、内容日历、OKR目标管理5大核心模块，让你的个人或团队效率提升5倍。",
    features: [
      "CRM客户关系管理数据库",
      "敏捷项目管理看板系统",
      "财务收支追踪与分析",
      "内容创作日历与发布计划",
      "OKR目标与关键结果追踪",
      "中英双语版本，即买即用",
    ],
    deliveryNote: "购买后立即发送Notion模板链接",
    color: "purple",
  },
  {
    id: "content-ai",
    badge: "NEW",
    badgeType: "new",
    icon: Cpu,
    title: "AI自媒体内容创作系统",
    subtitle: "Content Creator AI System",
    image: ASSETS.productContent,
    priceCNY: 129,
    priceUSDC: 18,
    originalPriceCNY: 399,
    rating: 4.9,
    sales: 1456,
    description: "2026年最完整的AI辅助自媒体运营系统。覆盖抖音、小红书、YouTube、Twitter全平台，包含爆款选题框架、AI脚本生成、数据分析模板，月入过万的创作者都在用。",
    features: [
      "全平台爆款选题生成框架",
      "AI辅助脚本与文案创作流程",
      "数据分析与内容优化模板",
      "粉丝增长策略手册（附案例）",
      "变现路径规划与执行清单",
      "私域流量搭建完整方案",
    ],
    deliveryNote: "购买后立即发送完整资料包",
    color: "orange",
  },
  {
    id: "trading",
    badge: "PRO",
    badgeType: "hot",
    icon: BarChart3,
    title: "量化交易策略手册",
    subtitle: "Quant Trading Playbook 2026",
    image: ASSETS.productTrading,
    priceCNY: 199,
    priceUSDC: 28,
    originalPriceCNY: 599,
    rating: 4.7,
    sales: 892,
    description: "专为散户设计的量化交易入门到进阶完整手册。包含10+实战策略、风险管理框架、Python回测代码模板，以及2026年最新的加密货币量化交易专项内容。",
    features: [
      "10+ 实战量化策略详解",
      "Python回测代码模板（即用）",
      "风险管理与仓位控制框架",
      "加密货币量化交易专项章节",
      "技术指标组合优化方法",
      "附赠：交易心理学精华摘要",
    ],
    deliveryNote: "购买后立即发送PDF + 代码包",
    color: "green",
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "张明远", location: "上海", product: "AI提示词工具包", text: "买了之后用了一周，写方案的效率直接翻倍，老板以为我加班了。强烈推荐！", rating: 5 },
  { name: "Sarah K.", location: "Singapore", product: "Notion Business OS", text: "This template pack saved me weeks of setup time. The CRM module alone is worth the price.", rating: 5 },
  { name: "李晓雯", location: "北京", product: "AI内容创作系统", text: "用了这套系统之后，我的小红书粉丝两个月涨了3万。内容选题框架真的太好用了！", rating: 5 },
  { name: "Marcus T.", location: "London", product: "Quant Trading Playbook", text: "The Python backtesting templates are incredibly well-documented. Great value for the price.", rating: 4 },
  { name: "王建国", location: "深圳", product: "量化交易手册", text: "作为一个量化小白，这本手册让我少走了很多弯路。风险管理那章写得特别好。", rating: 5 },
  { name: "Priya M.", location: "Mumbai", product: "AI Prompt Toolkit", text: "500+ templates is no joke. I use these daily for my content agency. Worth every penny.", rating: 5 },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "7,118+", label: "已售产品", icon: Download },
  { value: "98.6%", label: "好评率", icon: Star },
  { value: "4.8/5", label: "平均评分", icon: Award },
  { value: "50+", label: "国家用户", icon: Globe },
];

// ─── Color Map ────────────────────────────────────────────────────────────────
const COLOR_MAP = {
  blue: {
    glow: "shadow-[0_0_30px_oklch(0.72_0.22_240/0.3)]",
    border: "border-[oklch(0.72_0.22_240/0.4)]",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    btn: "bg-[oklch(0.72_0.22_240)] hover:bg-[oklch(0.65_0.22_240)] text-[oklch(0.07_0.015_260)]",
    accent: "text-blue-400",
  },
  purple: {
    glow: "shadow-[0_0_30px_oklch(0.65_0.2_300/0.3)]",
    border: "border-[oklch(0.65_0.2_300/0.4)]",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    btn: "bg-[oklch(0.65_0.2_300)] hover:bg-[oklch(0.58_0.2_300)] text-white",
    accent: "text-purple-400",
  },
  orange: {
    glow: "shadow-[0_0_30px_oklch(0.75_0.2_45/0.3)]",
    border: "border-[oklch(0.75_0.2_45/0.4)]",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    btn: "bg-[oklch(0.75_0.2_45)] hover:bg-[oklch(0.68_0.2_45)] text-[oklch(0.07_0.015_260)]",
    accent: "text-orange-400",
  },
  green: {
    glow: "shadow-[0_0_30px_oklch(0.7_0.2_160/0.3)]",
    border: "border-[oklch(0.7_0.2_160/0.4)]",
    badge: "bg-green-500/20 text-green-300 border-green-500/30",
    btn: "bg-[oklch(0.7_0.2_160)] hover:bg-[oklch(0.63_0.2_160)] text-[oklch(0.07_0.015_260)]",
    accent: "text-green-400",
  },
};

// ─── Payment Modal ────────────────────────────────────────────────────────────
function PaymentModal({
  product,
  open,
  onClose,
}: {
  product: (typeof PRODUCTS)[0] | null;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const USDC_ADDRESS = "0x3DbFf9E97b10a10d4A2079B4273473da7e6F4120";

  const handleCopy = () => {
    navigator.clipboard.writeText(USDC_ADDRESS);
    setCopied(true);
    toast.success("地址已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[oklch(0.09_0.02_260)] border-[oklch(0.25_0.04_260)] text-foreground p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[oklch(0.12_0.04_240)] to-[oklch(0.12_0.03_280)] p-6 border-b border-[oklch(0.2_0.03_260)]">
          <DialogHeader>
            <DialogTitle className="font-['Syne'] text-xl text-white">
              购买 · {product.title}
            </DialogTitle>
            <p className="text-sm text-[oklch(0.6_0.02_240)] mt-1">选择您偏好的支付方式完成购买</p>
          </DialogHeader>
        </div>

        <div className="p-6">
          <Tabs defaultValue="alipay" className="w-full">
            <TabsList className="w-full bg-[oklch(0.12_0.02_260)] border border-[oklch(0.2_0.03_260)] mb-6">
              <TabsTrigger value="alipay" className="flex-1 data-[state=active]:bg-[oklch(0.18_0.04_240)] data-[state=active]:text-white">
                <span className="mr-2">💙</span> 支付宝
                <span className="ml-2 text-xs text-green-400 font-semibold">¥{product.priceCNY}</span>
              </TabsTrigger>
              <TabsTrigger value="usdc" className="flex-1 data-[state=active]:bg-[oklch(0.18_0.04_240)] data-[state=active]:text-white">
                <span className="mr-2">🔷</span> USDC
                <span className="ml-2 text-xs text-blue-400 font-semibold">${product.priceUSDC}</span>
              </TabsTrigger>
            </TabsList>

            {/* Alipay Tab */}
            <TabsContent value="alipay" className="mt-0">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-3xl font-['Syne'] font-bold text-white">¥{product.priceCNY}</span>
                  <span className="text-sm text-[oklch(0.45_0.02_240)] line-through">¥{product.originalPriceCNY}</span>
                  <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded">
                    省{product.originalPriceCNY - product.priceCNY}元
                  </span>
                </div>
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-[oklch(0.72_0.22_240/0.1)] rounded-xl blur-xl" />
                  <img
                    src={ASSETS.alipayQR}
                    alt="支付宝收款码"
                    className="relative w-56 h-56 object-cover rounded-xl border-2 border-[oklch(0.72_0.22_240/0.3)] mx-auto"
                  />
                </div>
                <div className="bg-[oklch(0.12_0.02_260)] rounded-lg p-3 border border-[oklch(0.2_0.03_260)]">
                  <p className="text-sm text-[oklch(0.7_0.02_240)]">
                    <span className="text-yellow-400 font-semibold">⚡ 付款备注：</span>
                    请备注您的邮箱地址，我们将在10分钟内发送下载链接
                  </p>
                </div>
                <p className="text-xs text-[oklch(0.45_0.02_240)]">
                  打开支付宝 → 扫一扫 → 完成支付
                </p>
              </div>
            </TabsContent>

            {/* USDC Tab */}
            <TabsContent value="usdc" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-3xl font-['Syne'] font-bold text-white">${product.priceUSDC} USDC</span>
                </div>

                {/* Network Badge */}
                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center gap-2 bg-[oklch(0.65_0.2_300/0.15)] border border-[oklch(0.65_0.2_300/0.3)] rounded-full px-4 py-1.5">
                    <div className="w-2 h-2 rounded-full bg-[oklch(0.65_0.2_300)] animate-pulse" />
                    <span className="text-sm font-semibold text-[oklch(0.8_0.15_300)]">Polygon Network (MATIC)</span>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-[oklch(0.12_0.02_260)] rounded-xl p-4 border border-[oklch(0.25_0.04_260)]">
                  <p className="text-xs text-[oklch(0.5_0.02_240)] mb-2 uppercase tracking-wider">收款地址 (Polygon USDC)</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs text-[oklch(0.75_0.15_240)] break-all font-mono leading-relaxed">
                      {USDC_ADDRESS}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="shrink-0 p-2 rounded-lg bg-[oklch(0.18_0.04_240)] hover:bg-[oklch(0.22_0.06_240)] transition-colors border border-[oklch(0.3_0.06_240)]"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-[oklch(0.7_0.15_240)]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <p className="text-xs text-yellow-300 flex items-start gap-2">
                    <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>
                      <strong>重要：</strong>请确保使用 Polygon 网络发送 USDC，发送其他网络或代币将导致资产损失。
                      付款后请将交易哈希发送至邮件获取产品。
                    </span>
                  </p>
                </div>

                <div className="bg-[oklch(0.12_0.02_260)] rounded-lg p-3 border border-[oklch(0.2_0.03_260)]">
                  <p className="text-sm text-[oklch(0.7_0.02_240)]">
                    <span className="text-blue-400 font-semibold">📧 发货邮箱：</span>
                    付款后发送交易截图至{" "}
                    <span className="text-[oklch(0.72_0.22_240)]">support@digitalflow.studio</span>
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Guarantee */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[oklch(0.5_0.02_240)]">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-400" /> 7天无理由退款</span>
            <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-blue-400" /> 安全加密支付</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-yellow-400" /> 10分钟内发货</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  onBuy,
}: {
  product: (typeof PRODUCTS)[0];
  onBuy: (p: (typeof PRODUCTS)[0]) => void;
}) {
  const colors = COLOR_MAP[product.color as keyof typeof COLOR_MAP];
  const Icon = product.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`relative glass-card rounded-2xl overflow-hidden border ${colors.border} ${colors.glow} group`}
    >
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className={product.badgeType === "hot" ? "badge-hot" : "badge-new"}>
          {product.badge}
        </span>
      </div>

      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.09_0.02_260)] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-['Syne'] font-bold text-lg text-white leading-tight">{product.title}</h3>
            <p className="text-xs text-[oklch(0.5_0.02_240)] mt-0.5">{product.subtitle}</p>
          </div>
          <div className={`p-2 rounded-lg bg-[oklch(0.15_0.03_260)] ${colors.accent}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>

        {/* Rating & Sales */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-[oklch(0.3_0.02_240)]"}`}
              />
            ))}
            <span className="text-xs text-[oklch(0.6_0.02_240)] ml-1">{product.rating}</span>
          </div>
          <span className="text-xs text-[oklch(0.45_0.02_240)]">·</span>
          <span className="text-xs text-[oklch(0.55_0.02_240)]">{product.sales.toLocaleString()} 已售</span>
        </div>

        <p className="text-sm text-[oklch(0.6_0.02_240)] leading-relaxed mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Features Preview */}
        <ul className="space-y-1.5 mb-5">
          {product.features.slice(0, 3).map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-[oklch(0.65_0.02_240)]">
              <Check className={`w-3.5 h-3.5 shrink-0 ${colors.accent}`} />
              {f}
            </li>
          ))}
          <li className="text-xs text-[oklch(0.45_0.02_240)] pl-5">+{product.features.length - 3} 更多内容...</li>
        </ul>

        {/* Pricing */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-['Syne'] font-bold text-white">¥{product.priceCNY}</span>
              <span className="text-sm text-[oklch(0.4_0.02_240)] line-through">¥{product.originalPriceCNY}</span>
            </div>
            <p className="text-xs text-[oklch(0.5_0.02_240)]">或 ${product.priceUSDC} USDC (Polygon)</p>
          </div>
          <div className="text-right">
            <div className="text-xs bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-1 rounded">
              节省 {Math.round((1 - product.priceCNY / product.originalPriceCNY) * 100)}%
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => onBuy(product)}
          className={`w-full font-semibold py-5 ${colors.btn} transition-all duration-200 group/btn`}
        >
          <Zap className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
          立即购买
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<(typeof PRODUCTS)[0] | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBuy = (product: (typeof PRODUCTS)[0]) => {
    setSelectedProduct(product);
    setPaymentOpen(true);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.07_0.015_260)] text-foreground overflow-x-hidden">
      {/* ── Navigation ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[oklch(0.07_0.015_260/0.95)] backdrop-blur-xl border-b border-[oklch(0.18_0.03_260)]"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.72_0.22_240)] to-[oklch(0.65_0.2_280)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-['Syne'] font-bold text-white text-lg tracking-tight">
              Digital<span className="text-[oklch(0.72_0.22_240)]">Flow</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["产品", "评价", "关于", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="text-sm text-[oklch(0.6_0.02_240)] hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-[oklch(0.55_0.02_240)]">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              实时在线销售
            </div>
            <Button
              size="sm"
              className="bg-[oklch(0.72_0.22_240)] hover:bg-[oklch(0.65_0.22_240)] text-[oklch(0.07_0.015_260)] font-semibold"
              onClick={() => document.getElementById("产品")?.scrollIntoView({ behavior: "smooth" })}
            >
              浏览产品
            </Button>
            <button
              className="md:hidden p-2 text-[oklch(0.6_0.02_240)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[oklch(0.09_0.02_260)] border-t border-[oklch(0.18_0.03_260)] px-4 py-4 space-y-3"
            >
              {["产品", "评价", "关于", "FAQ"].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="block text-sm text-[oklch(0.6_0.02_240)] hover:text-white py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero Section ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        id="首页"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={ASSETS.heroBg}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.07_0.015_260/0.3)] via-[oklch(0.07_0.015_260/0.5)] to-[oklch(0.07_0.015_260)]" />
          <div className="absolute inset-0 grid-bg opacity-30" />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[oklch(0.72_0.22_240/0.08)] blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-[oklch(0.65_0.2_300/0.06)] blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />

        <div className="container relative z-10 pt-24 pb-16">
          <div className="max-w-4xl">
            {/* Announcement Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-[oklch(0.72_0.22_240/0.1)] border border-[oklch(0.72_0.22_240/0.3)] rounded-full px-4 py-2 mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-[oklch(0.72_0.22_240)] animate-pulse" />
              <span className="text-sm text-[oklch(0.75_0.15_240)]">2026年全球热销数字产品 · 每日更新</span>
              <TrendingUp className="w-4 h-4 text-[oklch(0.72_0.22_240)]" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-['Syne'] text-5xl md:text-7xl font-extrabold text-white leading-[1.05] mb-6"
            >
              用AI工具
              <br />
              <span className="gradient-text-blue">解锁你的</span>
              <br />
              数字收入
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-[oklch(0.65_0.02_240)] max-w-2xl leading-relaxed mb-10"
            >
              精选4款2026年全球最热门数字产品——AI提示词工具包、Notion商业模板、内容创作系统、量化交易手册。
              一次购买，终身使用，立即开始你的数字副业之旅。
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-16"
            >
              <Button
                size="lg"
                className="bg-[oklch(0.72_0.22_240)] hover:bg-[oklch(0.65_0.22_240)] text-[oklch(0.07_0.015_260)] font-bold px-8 py-6 text-base pulse-glow"
                onClick={() => document.getElementById("产品")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Zap className="w-5 h-5 mr-2" />
                立即选购产品
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[oklch(0.3_0.06_240)] text-[oklch(0.75_0.15_240)] hover:bg-[oklch(0.12_0.03_260)] px-8 py-6 text-base"
                onClick={() => document.getElementById("评价")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Star className="w-5 h-5 mr-2" />
                查看用户评价
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="glass-card rounded-xl p-4 border border-[oklch(0.2_0.03_260)]">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-[oklch(0.72_0.22_240)]" />
                      <span className="text-xl font-['Syne'] font-bold text-white">{stat.value}</span>
                    </div>
                    <p className="text-xs text-[oklch(0.5_0.02_240)]">{stat.label}</p>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-[oklch(0.72_0.22_240/0.5)] to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.22_240)]" />
        </div>
      </section>

      {/* ── Products Section ── */}
      <section id="产品" className="py-24 relative">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="container relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-[oklch(0.82_0.18_85/0.1)] border border-[oklch(0.82_0.18_85/0.3)] rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-[oklch(0.82_0.18_85)]" />
              <span className="text-sm text-[oklch(0.82_0.18_85)]">2026年精选爆款</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-['Syne'] text-4xl md:text-5xl font-extrabold text-white mb-4"
            >
              全球热销数字产品
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[oklch(0.55_0.02_240)] max-w-xl mx-auto"
            >
              每款产品均经过市场验证，支持支付宝人民币付款和Polygon网络USDC加密支付
            </motion.p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} onBuy={handleBuy} />
            ))}
          </div>

          {/* Bundle Offer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 relative overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.72_0.22_240/0.15)] via-[oklch(0.65_0.2_300/0.1)] to-[oklch(0.82_0.18_85/0.15)]" />
            <div className="absolute inset-0 border border-[oklch(0.72_0.22_240/0.3)] rounded-2xl" />
            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="badge-hot">限时特惠</span>
                  <span className="text-sm text-[oklch(0.6_0.02_240)]">4合1全套组合</span>
                </div>
                <h3 className="font-['Syne'] text-2xl md:text-3xl font-bold text-white mb-2">
                  全套产品组合包
                </h3>
                <p className="text-[oklch(0.6_0.02_240)] max-w-lg">
                  一次性获得全部4款产品，享受最大折扣。包含AI工具包 + Notion模板 + 内容系统 + 交易手册，
                  总价值¥1,496，现仅需¥399。
                </p>
              </div>
              <div className="text-center md:text-right shrink-0">
                <div className="flex items-baseline gap-2 justify-center md:justify-end mb-1">
                  <span className="text-4xl font-['Syne'] font-extrabold text-white">¥399</span>
                  <span className="text-lg text-[oklch(0.4_0.02_240)] line-through">¥1,496</span>
                </div>
                <p className="text-xs text-[oklch(0.5_0.02_240)] mb-4">或 $55 USDC (Polygon)</p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[oklch(0.72_0.22_240)] to-[oklch(0.65_0.2_300)] hover:opacity-90 text-white font-bold px-8"
                  onClick={() => {
                    setSelectedProduct({
                      ...PRODUCTS[0],
                      title: "全套产品组合包",
                      priceCNY: 399,
                      priceUSDC: 55,
                      originalPriceCNY: 1496,
                    });
                    setPaymentOpen(true);
                  }}
                >
                  <Award className="w-5 h-5 mr-2" />
                  获取全套组合
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section id="关于" className="py-24 bg-[oklch(0.09_0.018_260)]">
        <div className="container">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-['Syne'] text-4xl font-extrabold text-white mb-4"
            >
              为什么选择我们
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "即时交付",
                desc: "付款后10分钟内通过邮件发送下载链接，无需等待，立即开始使用。",
                color: "text-yellow-400",
                bg: "bg-yellow-400/10",
              },
              {
                icon: Shield,
                title: "7天退款保障",
                desc: "对产品不满意？7天内无条件全额退款，零风险购买体验。",
                color: "text-green-400",
                bg: "bg-green-400/10",
              },
              {
                icon: Globe,
                title: "全球双渠道收款",
                desc: "支持支付宝人民币付款（国内用户）和Polygon USDC加密支付（海外用户）。",
                color: "text-blue-400",
                bg: "bg-blue-400/10",
              },
              {
                icon: TrendingUp,
                title: "持续更新",
                desc: "所有产品随市场变化持续迭代更新，一次购买，终身受益。",
                color: "text-purple-400",
                bg: "bg-purple-400/10",
              },
              {
                icon: Users,
                title: "7000+用户验证",
                desc: "超过7000名来自全球50+国家的用户已经购买并使用，98.6%好评率。",
                color: "text-orange-400",
                bg: "bg-orange-400/10",
              },
              {
                icon: Lock,
                title: "安全支付",
                desc: "支付宝官方渠道 + Polygon区块链透明可查，资金安全有保障。",
                color: "text-cyan-400",
                bg: "bg-cyan-400/10",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card rounded-xl p-6 border border-[oklch(0.2_0.03_260)] hover:border-[oklch(0.3_0.06_260)] transition-colors"
                >
                  <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="font-['Syne'] font-bold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-[oklch(0.55_0.02_240)] leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="评价" className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-['Syne'] text-4xl font-extrabold text-white mb-4"
            >
              用户真实评价
            </motion.h2>
            <p className="text-[oklch(0.55_0.02_240)]">来自全球50+国家的真实用户反馈</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-card rounded-xl p-6 border border-[oklch(0.2_0.03_260)]"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-[oklch(0.7_0.02_240)] leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-[oklch(0.45_0.02_240)]">{t.location}</p>
                  </div>
                  <span className="text-xs bg-[oklch(0.15_0.03_260)] border border-[oklch(0.22_0.04_260)] text-[oklch(0.55_0.02_240)] px-2 py-1 rounded">
                    {t.product}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="FAQ" className="py-24 bg-[oklch(0.09_0.018_260)]">
        <div className="container max-w-3xl">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-['Syne'] text-4xl font-extrabold text-white mb-4"
            >
              常见问题
            </motion.h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "购买后如何获取产品？",
                a: "付款后请在支付备注中填写您的邮箱地址（支付宝），或将USDC交易截图发送至 support@digitalflow.studio。我们将在10分钟内发送下载链接至您的邮箱。",
              },
              {
                q: "USDC支付需要使用哪个网络？",
                a: "请务必使用 Polygon（MATIC）网络发送USDC，收款地址为 0x3DbFf9E97b10a10d4A2079B4273473da7e6F4120。请勿使用以太坊主网或其他网络，否则资产将无法找回。",
              },
              {
                q: "产品是否支持退款？",
                a: "支持7天无理由退款。如果您对产品不满意，请在购买后7天内联系我们，我们将全额退款，无需任何理由。",
              },
              {
                q: "产品会持续更新吗？",
                a: "是的，所有产品均会随市场变化持续更新迭代。一次购买即可获得所有未来更新，无需额外付费。",
              },
              {
                q: "是否有组合优惠？",
                a: "有的！购买全套4款产品组合包仅需¥399（或$55 USDC），相比单独购买节省超过70%。这是我们最受欢迎的选项。",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl p-6 border border-[oklch(0.2_0.03_260)]"
              >
                <h3 className="font-['Syne'] font-semibold text-white mb-3 flex items-start gap-2">
                  <span className="text-[oklch(0.72_0.22_240)] mt-0.5">Q.</span>
                  {faq.q}
                </h3>
                <p className="text-sm text-[oklch(0.6_0.02_240)] leading-relaxed pl-5">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.72_0.22_240/0.08)] via-transparent to-[oklch(0.65_0.2_300/0.06)]" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-['Syne'] text-4xl md:text-6xl font-extrabold text-white mb-6">
              开始你的<br />
              <span className="gradient-text-gold">数字产品之旅</span>
            </h2>
            <p className="text-[oklch(0.6_0.02_240)] text-lg max-w-xl mx-auto mb-10">
              加入7000+全球用户，用AI工具和数字产品开启你的被动收入新篇章。
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[oklch(0.72_0.22_240)] hover:bg-[oklch(0.65_0.22_240)] text-[oklch(0.07_0.015_260)] font-bold px-10 py-6 text-lg pulse-glow"
                onClick={() => document.getElementById("产品")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Zap className="w-5 h-5 mr-2" />
                立即选购
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-[oklch(0.45_0.02_240)]">
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-green-400" /> 7天退款保障</span>
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-blue-400" /> 安全支付</span>
              <span className="flex items-center gap-1.5"><Download className="w-4 h-4 text-yellow-400" /> 即时交付</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-[oklch(0.15_0.025_260)] bg-[oklch(0.06_0.012_260)]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[oklch(0.72_0.22_240)] to-[oklch(0.65_0.2_280)] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-['Syne'] font-bold text-white">
                Digital<span className="text-[oklch(0.72_0.22_240)]">Flow</span> Studio
              </span>
            </div>
            <div className="text-center">
              <p className="text-xs text-[oklch(0.4_0.02_240)]">
                © 2026 DigitalFlow Studio · 全球数字产品销售平台
              </p>
              <p className="text-xs text-[oklch(0.35_0.02_240)] mt-1">
                支持支付宝 · Polygon USDC · 7天退款保障
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-[oklch(0.4_0.02_240)]">
              <span>USDC: Polygon Network</span>
              <span>·</span>
              <span className="font-mono text-[oklch(0.5_0.1_240)]">0x3DbF...4120</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Payment Modal ── */}
      <PaymentModal
        product={selectedProduct}
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
      />
    </div>
  );
}
