/**
 * 盈指量有限公司 — 2026全球热销数字产品商店
 * Design: Deep Space Tech — Dark cosmic aesthetic with neon accents
 * New features: 24h countdown timer per product card + purchase form with auto email delivery
 */

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { ImprovedPaymentFlow } from "@/components/ImprovedPaymentFlow";
import {
  Zap, Star, Shield, Download, Globe, TrendingUp, Users,
  ChevronRight, Copy, Check, X, Menu, ExternalLink,
  Sparkles, Lock, Clock, Award, BarChart3, Brain, FileText, Cpu,
  Mail, Loader2, Timer,
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

const COLOR_MAP = {
  blue: {
    glow: "shadow-[0_0_30px_oklch(0.72_0.22_240/0.3)]",
    border: "border-[oklch(0.72_0.22_240/0.4)]",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    btn: "bg-[oklch(0.72_0.22_240)] hover:bg-[oklch(0.65_0.22_240)] text-[oklch(0.07_0.015_260)]",
    accent: "text-blue-400",
    timer: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  },
  purple: {
    glow: "shadow-[0_0_30px_oklch(0.65_0.2_300/0.3)]",
    border: "border-[oklch(0.65_0.2_300/0.4)]",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    btn: "bg-[oklch(0.65_0.2_300)] hover:bg-[oklch(0.58_0.2_300)] text-white",
    accent: "text-purple-400",
    timer: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  },
  orange: {
    glow: "shadow-[0_0_30px_oklch(0.75_0.2_45/0.3)]",
    border: "border-[oklch(0.75_0.2_45/0.4)]",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    btn: "bg-[oklch(0.75_0.2_45)] hover:bg-[oklch(0.68_0.2_45)] text-[oklch(0.07_0.015_260)]",
    accent: "text-orange-400",
    timer: "text-orange-400 border-orange-500/30 bg-orange-500/10",
  },
  green: {
    glow: "shadow-[0_0_30px_oklch(0.7_0.2_160/0.3)]",
    border: "border-[oklch(0.7_0.2_160/0.4)]",
    badge: "bg-green-500/20 text-green-300 border-green-500/30",
    btn: "bg-[oklch(0.7_0.2_160)] hover:bg-[oklch(0.63_0.2_160)] text-[oklch(0.07_0.015_260)]",
    accent: "text-green-400",
    timer: "text-green-400 border-green-500/30 bg-green-500/10",
  },
};

// ─── 24h Countdown Hook ───────────────────────────────────────────────────────
// Each product gets a stable 24h deadline stored in sessionStorage so it
// persists across re-renders but resets on a new browser session.
function useCountdown(productId: string) {
  const storageKey = `countdown_${productId}`;

  const getDeadline = () => {
    const stored = sessionStorage.getItem(storageKey);
    if (stored) return parseInt(stored, 10);
    const deadline = Date.now() + 24 * 60 * 60 * 1000;
    sessionStorage.setItem(storageKey, String(deadline));
    return deadline;
  };

  const [deadline] = useState(getDeadline);
  const [remaining, setRemaining] = useState(() => Math.max(0, deadline - Date.now()));

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1000);

  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
    expired: remaining === 0,
  };
}

// ─── Countdown Badge Component ────────────────────────────────────────────────
function CountdownBadge({ productId, colorClass }: { productId: string; colorClass: string }) {
  const { h, m, s, expired } = useCountdown(productId);
  const { t } = useTranslation();
  if (expired) return null;
  return (
    <div className={`flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-lg border ${colorClass}`}>
      <Timer className="w-3 h-3" />
      <span>{t("countdown.limitedOffer")}</span>
      <span className="opacity-60">|</span>
      <span>{h}:{m}:{s}</span>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  onBuy,
}: {
  product: {
    id: string;
    badge: string;
    badgeType: string;
    icon: any;
    title: string;
    subtitle: string;
    image: string;
    priceCNY: number;
    priceUSDC: number;
    originalPriceCNY: number;
    rating: number;
    sales: number;
    description: string;
    features: string[];
    color: string;
  };
  onBuy: (p: any) => void;
}) {
  const colors = COLOR_MAP[product.color as keyof typeof COLOR_MAP];
  const Icon = product.icon;
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`relative glass-card rounded-2xl overflow-hidden border ${colors.border} ${colors.glow} group flex flex-col`}
    >
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className={product.badgeType === "hot" ? "badge-hot" : 
          product.badgeType === "new" ? "badge-new" : "badge-best"}>
          {product.badge}
        </span>
      </div>

      {/* Countdown */}
      <div className="absolute top-4 right-4 z-10">
        <CountdownBadge productId={product.id} colorClass={colors.timer} />
      </div>

      <div className="p-6 flex flex-col items-center text-center flex-grow">
        <Icon className={`w-12 h-12 mb-4 ${colors.accent}`} />
        <h3 className="text-xl font-bold mb-2 text-white">{product.title}</h3>
        <p className="text-gray-400 text-sm mb-4 flex-grow">{product.description}</p>
        
        <div className="flex items-center mb-4">
          <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
          <span className="text-gray-300 text-sm mr-2">{product.rating}</span>
          <span className="text-gray-500 text-xs">({product.sales} {t("product.salesText")})</span>
        </div>

        <ul className="text-gray-300 text-sm text-left w-full mb-6 space-y-2">
          {product.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className="w-4 h-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto w-full">
          <div className="flex items-baseline justify-center mb-4">
            <span className="text-4xl font-extrabold text-white mr-2">¥{product.priceCNY.toLocaleString()}</span>
            {product.originalPriceCNY && (
              <span className="text-gray-500 line-through">¥{product.originalPriceCNY.toLocaleString()}</span>
            )}
          </div>
          <Button className={`w-full text-lg ${colors.btn}`} onClick={() => onBuy(product)}>
            {t("product.buyNow")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
  const { t, i18n } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const PRODUCTS = [
    {
      id: "ai-toolkit",
      badge: t("product.badge.hot"),
      badgeType: "hot",
      icon: Brain,
      title: t("product.aiToolkit.title"),
      subtitle: t("product.aiToolkit.subtitle"),
      image: ASSETS.productAI,
      priceCNY: 99,
      priceUSDC: 14,
      originalPriceCNY: 299,
      rating: 4.9,
      sales: 2847,
      description: t("product.aiToolkit.description"),
      features: [
        t("product.aiToolkit.feature1"),
        t("product.aiToolkit.feature2"),
        t("product.aiToolkit.feature3"),
        t("product.aiToolkit.feature4"),
        t("product.aiToolkit.feature5"),
        t("product.aiToolkit.feature6"),
      ],
      color: "blue",
    },
    {
      id: "notion-os",
      badge: t("product.badge.best"),
      badgeType: "new",
      icon: FileText,
      title: t("product.notionOS.title"),
      subtitle: t("product.notionOS.subtitle"),
      image: ASSETS.productNotion,
      priceCNY: 79,
      priceUSDC: 11,
      originalPriceCNY: 199,
      rating: 4.8,
      sales: 1923,
      description: t("product.notionOS.description"),
      features: [
        t("product.notionOS.feature1"),
        t("product.notionOS.feature2"),
        t("product.notionOS.feature3"),
        t("product.notionOS.feature4"),
        t("product.notionOS.feature5"),
        t("product.notionOS.feature6"),
      ],
      color: "purple",
    },
    {
      id: "content-ai",
      badge: t("product.badge.new"),
      badgeType: "new",
      icon: Cpu,
      title: t("product.contentAI.title"),
      subtitle: t("product.contentAI.subtitle"),
      image: ASSETS.productContent,
      priceCNY: 129,
      priceUSDC: 18,
      originalPriceCNY: 399,
      rating: 4.7,
      sales: 1588,
      description: t("product.contentAI.description"),
      features: [
        t("product.contentAI.feature1"),
        t("product.contentAI.feature2"),
        t("product.contentAI.feature3"),
        t("product.contentAI.feature4"),
        t("product.contentAI.feature5"),
        t("product.contentAI.feature6"),
      ],
      color: "orange",
    },
    {
      id: "trading-playbook",
      badge: t("product.badge.pro"),
      badgeType: "hot",
      icon: BarChart3,
      title: t("product.trading.title"),
      subtitle: t("product.trading.subtitle"),
      image: ASSETS.productTrading,
      priceCNY: 69999,
      priceUSDC: 9999,
      originalPriceCNY: 29999,
      rating: 4.9,
      sales: 742,
      description: t("product.trading.description"),
      features: [
        t("product.trading.feature1"),
        t("product.trading.feature2"),
        t("product.trading.feature3"),
        t("product.trading.feature4"),
        t("product.trading.feature5"),
        t("product.trading.feature6"),
      ],
      color: "green",
    },
    {
      id: "bundle",
      badge: t("product.badge.ultimate"),
      badgeType: "best",
      icon: Sparkles,
      title: t("product.bundle.title"),
      subtitle: t("product.bundle.subtitle"),
      image: ASSETS.heroBg,
      priceCNY: 70099,
      priceUSDC: 10014,
      originalPriceCNY: 99999,
      rating: 5.0,
      sales: 312,
      description: t("product.bundle.description"),
      features: [
        t("product.bundle.feature1"),
        t("product.bundle.feature2"),
        t("product.bundle.feature3"),
        t("product.bundle.feature4"),
        t("product.bundle.feature5"),
        t("product.bundle.feature6"),
      ],
      color: "blue",
    },
  ];

  const TESTIMONIALS = [
    {
      name: t("testimonials.zhangmingyuan.name"),
      location: t("testimonials.zhangmingyuan.location"),
      product: t("testimonials.zhangmingyuan.product"),
      text: t("testimonials.zhangmingyuan.text"),
    },
    {
      name: t("testimonials.sarahk.name"),
      location: t("testimonials.sarahk.location"),
      product: t("testimonials.sarahk.product"),
      text: t("testimonials.sarahk.text"),
    },
    {
      name: t("testimonials.lixiaowen.name"),
      location: t("testimonials.lixiaowen.location"),
      product: t("testimonials.lixiaowen.product"),
      text: t("testimonials.lixiaowen.text"),
    },
    {
      name: t("testimonials.marcust.name"),
      location: t("testimonials.marcust.location"),
      product: t("testimonials.marcust.product"),
      text: t("testimonials.marcust.text"),
    },
    {
      name: t("testimonials.wangjianguo.name"),
      location: t("testimonials.wangjianguo.location"),
      product: t("testimonials.wangjianguo.product"),
      text: t("testimonials.wangjianguo.text"),
    },
    {
      name: t("testimonials.priyam.name"),
      location: t("testimonials.priyam.location"),
      product: t("testimonials.priyam.product"),
      text: t("testimonials.priyam.text"),
    },
  ];

  const STATS = [
    { value: "10,000+", label: t("stats.soldProducts") },
    { value: "99%", label: t("stats.positiveReviews") },
    { value: "4.9/5.0", label: t("stats.averageRating") },
    { value: "80+", label: t("stats.countriesServed") },
  ];

  const FAQ = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];

  const handleBuy = (product: any) => {
    setSelectedProduct(product);
    setIsPaymentModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPaymentModalOpen(false);
    setIsEmailSent(false);
    setEmail("");
  };

  const sendEmailMutation = trpc.sendEmail.useMutation();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(t("payment.emailRequired"));
      return;
    }
    try {
      await sendEmailMutation.mutateAsync({ email, product: selectedProduct });
      setIsEmailSent(true);
      toast.success(t("payment.emailSentSuccess"));
    } catch (error) {
      toast.error("Failed to send email. Please try again.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success(t("footer.emailCopied"));
    });
  };

  const navLinks = [
    { href: "#products", label: t("nav.products") },
    { href: "#reviews", label: t("nav.reviews") },
    { href: "#about", label: t("nav.about") },
    { href: "#faq", label: t("nav.faq") },
  ];

  return (
    <div className="bg-black text-gray-200 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Sparkles className="w-8 h-8 text-blue-400 mr-2" />
              <span className="text-xl font-bold text-white">{t("common.brandName")}</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} className="text-gray-300 hover:text-white transition-colors">
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="hidden md:flex items-center">
              <LanguageSwitcher />
            </div>
            <div className="md:hidden">
              <Button variant="ghost" onClick={() => setIsMenuOpen(true)}>
                <Menu />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-gray-900 p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-white">{t("common.brandName")}</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <X />
                </Button>
              </div>
              <nav className="flex flex-col space-y-4">
                {navLinks.map(link => (
                  <a key={link.href} href={link.href} className="text-gray-300 hover:text-white text-lg" onClick={() => setIsMenuOpen(false)}>
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-8">
                <LanguageSwitcher />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <main className="pt-16">
        <section
          id="hero"
          className="relative min-h-screen flex items-center justify-center text-center overflow-hidden"
          style={{ backgroundImage: `url(${ASSETS.heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="relative z-10 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-4 text-sm font-bold badge-hot">{t("hero.badge")}</Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
                {t("hero.title")}<br />
                <span className="text-blue-400">{t("hero.titleHighlight")}</span> {t("hero.titleEnd")}
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
                {t("hero.subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600 text-white text-lg">
                  <a href="#products">{t("hero.cta1")}</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg border-gray-600 hover:bg-gray-800">
                  <a href="#reviews">{t("hero.cta2")}</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-20 sm:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12">{t("product.title")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PRODUCTS.map(product => (
                <ProductCard key={product.id} product={product} onBuy={handleBuy} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="reviews" className="py-20 sm:py-24 bg-gray-900/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12">{t("testimonials.title")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TESTIMONIALS.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card p-6 rounded-lg border border-gray-700"
                >
                  <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-white mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">{testimonial.location} &middot; {testimonial.product}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="about" className="py-20 sm:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12">{t("stats.title")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <p className="text-4xl md:text-5xl font-extrabold text-blue-400 mb-2">{stat.value}</p>
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 sm:py-24 bg-gray-900/50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12">{t("faq.title")}</h2>
            <div className="space-y-4">
              {FAQ.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card p-6 rounded-lg border border-gray-700"
                >
                  <h3 className="font-bold text-lg text-white mb-2">{item.q}</h3>
                  <p className="text-gray-400">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="hover:text-white">{t("footer.privacyPolicy")}</a>
            <a href="#" className="hover:text-white">{t("footer.termsOfService")}</a>
            <a href="mailto:wensen@yingzhiliang.space" onClick={(e) => { e.preventDefault(); copyToClipboard("wensen@yingzhiliang.space"); }} className="hover:text-white">{t("footer.contactUs")}</a>
          </div>
          <p>&copy; {new Date().getFullYear()} {t("footer.copyright")}. {t("footer.allRightsReserved")}.</p>
        </div>
      </footer>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>{t("payment.modalTitle")} - {selectedProduct?.title}</DialogTitle>
          </DialogHeader>
          <ImprovedPaymentFlow product={selectedProduct} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' },
  ];

  return (
    <div className="relative">
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
