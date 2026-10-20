import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SHOP_PRODUCTS_DATA, CLINIC_INFO } from '../data/therapyData';
import { ShopProduct, CartItem, ProductOrder, ShopCategory } from '../types/therapy';
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  Filter,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Star,
  MapPin,
  Truck,
  ShieldCheck,
  MessageCircle,
  Printer,
  X,
  ArrowRight,
  Sparkles,
  Phone,
  HelpCircle,
  Tag,
  Award
} from 'lucide-react';

interface ShopViewProps {
  onSelectTab: (tab: string) => void;
  cart: CartItem[];
  onAddToCart: (product: ShopProduct, quantity?: number) => void;
  onUpdateCartQty: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  onSelectTab,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart
}) => {
  const { lang, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>('all');
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [detailModalQty, setDetailModalQty] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('delivery');
  const [upazila, setUpazila] = useState(CLINIC_INFO.upazilas[0].en);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'clinic_pickup'>('cod');
  const [orderNotes, setOrderNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<ProductOrder | null>(null);

  const categories = [
    { id: 'all', en: 'All Products', bn: 'সকল পণ্য' },
    { id: 'hijama', en: 'Hijama & Cupping', bn: 'হিজামা ও কাপিং' },
    { id: 'herbal_oils', en: 'Pain Relief Oils', bn: 'ব্যথানাশক ভেষজ তেল' },
    { id: 'orthopedic', en: 'Orthopedic Belts', bn: 'অর্থোপেডিক বেল্ট' },
    { id: 'devices', en: 'Therapy Devices', bn: 'হোম থেরাপি ডিভাইস' },
    { id: 'unani', en: 'Unani & Digestive', bn: 'ইউনানি ও প্রাকৃতিক কেয়ার' }
  ];

  // Filtering products
  const filteredProducts = useMemo(() => {
    return SHOP_PRODUCTS_DATA.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName =
          p.nameEn.toLowerCase().includes(q) || p.nameBn.includes(q);
        const matchesDesc =
          p.descEn.toLowerCase().includes(q) || p.descBn.includes(q);
        const matchesBenefits = p.benefitsBn.some((b) => b.includes(q));
        return matchesName || matchesDesc || matchesBenefits;
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  // Cart Calculations
  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.priceBdt * item.quantity, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (deliveryType === 'pickup') return 0;
    if (upazila.includes('Town Chikandi') || upazila.includes('Sadar')) return 50;
    return 80;
  }, [deliveryType, upazila]);

  const totalAmount = subtotal + deliveryFee;

  const handleOpenDetailModal = (product: ShopProduct) => {
    setSelectedProduct(product);
    setDetailModalQty(1);
  };

  const handleAddFromDetail = () => {
    if (selectedProduct) {
      onAddToCart(selectedProduct, detailModalQty);
      setSelectedProduct(null);
      setIsCartOpen(true);
    }
  };

  const handleDirectBuy = (product: ShopProduct) => {
    onAddToCart(product, 1);
    setIsCartOpen(true);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError(t('Please enter customer full name', 'অনুগ্রহ করে ক্রেতার পূর্ণ নাম লিখুন'));
      return;
    }
    const cleanPhone = customerPhone.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setFormError(t('Please enter a valid mobile number (01...)', 'অনুগ্রহ করে সঠিক মোবাইল নম্বর দিন (০১৭... বা ০১৪...)'));
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      setFormError(t('Please enter detailed delivery address / village in Shariatpur', 'হোম ডেলিভারির জন্য আপনার পূর্ণ ঠিকানা বা গ্রামের নাম লিখুন'));
      return;
    }

    const orderId = `STH-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: ProductOrder = {
      id: orderId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryType,
      upazila,
      deliveryAddress: deliveryType === 'delivery' ? address.trim() : CLINIC_INFO.locationBn,
      items: [...cart],
      subtotalBdt: subtotal,
      deliveryFeeBdt: deliveryFee,
      totalBdt: totalAmount,
      paymentMethod,
      orderNotes: orderNotes.trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setConfirmedOrder(newOrder);
    onClearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  const constructWhatsAppOrderMsg = (ord: ProductOrder) => {
    const itemsList = ord.items
      .map(
        (it) =>
          `• ${it.product.nameBn} x ${it.quantity} = ৳${it.product.priceBdt * it.quantity}`
      )
      .join('\n');

    return encodeURIComponent(
      `*New Healthcare Product Order - Shariatpur Therapy Hub*\n` +
      `-----------------------------------------\n` +
      `*Order ID:* ${ord.id}\n` +
      `*Customer Name:* ${ord.customerName}\n` +
      `*Phone Number:* ${ord.customerPhone}\n` +
      `*Delivery Type:* ${ord.deliveryType === 'pickup' ? 'Clinic Pickup (টাউন চিকন্দি চেম্বার)' : `Home Delivery (${ord.upazila})`}\n` +
      (ord.deliveryAddress ? `*Delivery Address:* ${ord.deliveryAddress}\n` : '') +
      `*Payment Method:* ${ord.paymentMethod === 'cod' ? 'Cash on Delivery' : ord.paymentMethod === 'bkash' ? 'bKash / Nagad' : 'Clinic Pickup'}\n` +
      `-----------------------------------------\n` +
      `*Ordered Items:*\n${itemsList}\n` +
      `-----------------------------------------\n` +
      `*Subtotal:* ৳${ord.subtotalBdt}\n` +
      `*Delivery Fee:* ৳${ord.deliveryFeeBdt}\n` +
      `*Total Payable:* ৳${ord.totalBdt} BDT\n` +
      (ord.orderNotes ? `*Customer Note:* ${ord.orderNotes}\n` : '') +
      `-----------------------------------------\n` +
      `Please confirm my product order and dispatch schedule.`
    );
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-3">
            <img
              src={CLINIC_INFO.logo}
              alt="শরীয়তপুর থেরাপি হাব লোগো"
              className="w-12 h-12 rounded-full object-contain bg-white border border-amber-300 shrink-0"
            />
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                {lang === 'bn' ? CLINIC_INFO.subNameBn : CLINIC_INFO.subNameEn}
              </span>
              <span className="text-xs text-emerald-200">
                {t('Certified Health Products & Equipment Store', 'সার্টিফাইড স্বাস্থ্যপণ্য ও হোম থেরাপি সরঞ্জাম শপ')}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {t(
              'Online Healthcare & Holistic Therapy Shop',
              'শরীয়তপুর থেরাপি হাব অনলাইন স্বাস্থ্যসেবা শপ'
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
            {t(
              'Purchase genuine Hijama cupping kits, cold-pressed black seed oil, herbal pain massage oils, orthopedic spine/knee belts, and TENS devices directly with home delivery across Shariatpur or clinic pickup at Town Chikandi Bazar.',
              'সুন্নতি হিজামা কিট, কোল্ড-প্রেসড কালোজিরা তেল, বিশেষ ভেষজ বাত-ব্যথা মালিশ তেল, কোমর ও ঘাড়ের অর্থোপেডিক বেল্ট এবং হোম থেরাপি ডিভাইস ঘরে বসেই অর্ডার করুন। শরীয়তপুরের ৬টি উপজেলায় ক্যাশ অন ডেলিভারি সুবিধা।'
            )}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-slate-950" />
              <span>{t('View Cart', 'শপিং ব্যাগ দেখুন')}</span>
              {cartItemCount > 0 && (
                <span className="bg-slate-950 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>

            <a
              href={`https://wa.me/${CLINIC_INFO.whatsappClean}?text=${encodeURIComponent(
                'আসসালামু আলাইকুম, আমি শরীয়তপুর থেরাপি হাবের স্বাস্থ্যপণ্য সম্পর্কে জানতে ও অর্ডার করতে চাই।'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>{t('Product Hotline (01402893006)', 'পণ্য হটলাইন: ০১৪০২৮৯৩০০৬')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Trust Badges Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-semibold">{t('100% Genuine Quality', '১০০% খাঁটি ও গুণগত মানসম্পন্ন')}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-semibold">{t('Home Delivery in Shariatpur', 'শরীয়তপুরব্যাপী হোম ডেলিভারি')}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-semibold">{t('Town Chikandi Pickup', 'চিকন্দি বাজার কেন্দ্র থেকে সংগ্রহ')}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <Award className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-semibold">{t('Doctor Verified & Recommended', 'চিকিৎসক অনুমোদিত সরঞ্জাম')}</span>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(
              'Search products by name or condition (e.g., Hijama, Black seed, Lumbar belt, TENS)...',
              'পণ্যের নাম বা সমস্যা দিয়ে খুঁজুন (যেমন: হিজামা কিট, কালোজিরা তেল, কোমর ব্যথার বেল্ট, TENS)...'
            )}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-semibold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as ShopCategory)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lang === 'bn' ? cat.bn : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {t('No product found matching your search', 'আপনার অনুসন্ধানের সাথে কোনো পণ্য মেলেনি')}
          </h3>
          <p className="text-xs text-slate-500">
            {t('Try searching with different terms or reset category filters.', 'অনুসন্ধান শব্দ পরিবর্তন করুন বা অন্য ক্যাটাগরি বেছে নিন।')}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl hover:bg-emerald-100 transition-colors"
          >
            {t('Reset Filters', 'ফিল্টার রিসেট করুন')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-slate-100 cursor-pointer" onClick={() => handleOpenDetailModal(product)}>
                  <img
                    src={product.image}
                    alt={lang === 'bn' ? product.nameBn : product.nameEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {product.originalPriceBdt && (
                    <div className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                      {Math.round(((product.originalPriceBdt - product.priceBdt) / product.originalPriceBdt) * 100)}% ছাড়
                    </div>
                  )}
                  <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-md">
                    ৳{product.priceBdt}
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="text-emerald-700 font-semibold uppercase">
                      {product.category === 'hijama' && 'হিজামা সরঞ্জাম'}
                      {product.category === 'herbal_oils' && 'ভেষজ মালিশ তেল'}
                      {product.category === 'orthopedic' && 'অর্থোপেডিক বেল্ট'}
                      {product.category === 'devices' && 'থেরাপি ডিভাইস'}
                      {product.category === 'unani' && 'ইউনানি ফর্মুলা'}
                    </span>
                    <div className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => handleOpenDetailModal(product)}
                    className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 hover:text-emerald-700 cursor-pointer leading-snug"
                  >
                    {lang === 'bn' ? product.nameBn : product.nameEn}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {lang === 'bn' ? product.descBn : product.descEn}
                  </p>

                  {/* Highlights Tags */}
                  {product.recommendedFor && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.recommendedFor.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-2">
                <div className="flex items-baseline justify-between pt-2">
                  <div>
                    <span className="text-base sm:text-lg font-black text-emerald-800">৳{product.priceBdt}</span>
                    {product.originalPriceBdt && (
                      <span className="text-xs text-slate-400 line-through ml-2">৳{product.originalPriceBdt}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {t('In Stock', 'স্টকে আছে')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenDetailModal(product)}
                    className="py-2 px-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
                  >
                    {t('Details', 'বিস্তারিত')}
                  </button>

                  <button
                    onClick={() => handleDirectBuy(product)}
                    className="py-2 px-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{t('Add to Cart', 'ব্যাগে নিন')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-emerald-200 relative my-8">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
              <div className="sm:col-span-5 h-52 sm:h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.nameBn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="sm:col-span-7 space-y-2.5">
                <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  {selectedProduct.category}
                </span>

                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {lang === 'bn' ? selectedProduct.nameBn : selectedProduct.nameEn}
                </h2>

                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-emerald-800">৳{selectedProduct.priceBdt}</span>
                  {selectedProduct.originalPriceBdt && (
                    <span className="text-xs text-slate-400 line-through">৳{selectedProduct.originalPriceBdt}</span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'bn' ? selectedProduct.descBn : selectedProduct.descEn}
                </p>
              </div>
            </div>

            {/* Benefits Checklist */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 block">{t('Key Health Benefits & Features', 'উপকারিতা ও বিশেষ বৈশিষ্ট্য')}:</span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedProduct.benefitsBn.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Usage Instructions */}
            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100 text-xs text-emerald-950 space-y-1">
              <span className="font-bold block">{t('How to Use:', 'ব্যবহারবিধি:')}</span>
              <p className="leading-relaxed">{selectedProduct.usageBn}</p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <span className="text-xs font-semibold text-slate-600">{t('Quantity', 'পরিমাণ')}:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={() => setDetailModalQty((prev) => Math.max(1, prev - 1))}
                    className="p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900">{detailModalQty}</span>
                  <button
                    onClick={() => setDetailModalQty((prev) => prev + 1)}
                    className="p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleAddFromDetail}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t('Add to Bag (৳', 'ব্যাগে যুক্ত করুন (৳')}{selectedProduct.priceBdt * detailModalQty})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Drawer / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end">
          <div className="bg-white h-full max-w-md w-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-lg font-bold text-slate-900">
                    {t('Your Healthcare Cart', 'আপনার শপিং ব্যাগ')}
                  </h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-600">
                    {t('Your bag is currently empty', 'আপনার শপিং ব্যাগ বর্তমানে খালি')}
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl hover:bg-emerald-100"
                  >
                    {t('Start Shopping', 'পণ্য দেখুন ও যোগ করুন')}
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 py-3 space-y-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="pt-3 pb-2 flex items-start gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.nameBn}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {lang === 'bn' ? item.product.nameBn : item.product.nameEn}
                        </h4>
                        <span className="text-xs font-bold text-emerald-800 block mt-0.5">
                          ৳{item.product.priceBdt} x {item.quantity} = ৳{item.product.priceBdt * item.quantity}
                        </span>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                            <button
                              onClick={() => onUpdateCartQty(item.product.id, -1)}
                              className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateCartQty(item.product.id, 1)}
                              className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveFromCart(item.product.id)}
                            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{t('Remove', 'মুছুন')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{t('Subtotal', 'পণ্যের মোট মূল্য')}</span>
                    <span className="font-bold text-slate-900">৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{t('Estimated Delivery Fee', 'আনুমানিক ডেলিভারি চার্জ')}</span>
                    <span className="font-semibold text-emerald-700">
                      {deliveryType === 'pickup' ? t('Free (Pickup)', 'ফ্রি (ক্লিনিক সংগ্রহ)') : `৳${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-100">
                    <span>{t('Total Payable', 'সর্বমোট')}</span>
                    <span className="text-emerald-800 text-base">৳{totalAmount}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="col-span-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>{t('Proceed to Checkout', 'অর্ডার সম্পন্ন করুন (চেকআউট)')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClearCart}
                    className="col-span-2 py-1.5 text-xs text-slate-500 hover:text-slate-800 text-center cursor-pointer"
                  >
                    {t('Clear entire cart', 'শপিং ব্যাগ খালি করুন')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-emerald-200 relative my-8">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                {t('Fast Delivery Across Shariatpur', 'শরীয়তপুর জেলায় নির্ভরযোগ্য ডেলিভারি')}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {t('Customer Shipping & Order Form', 'ক্রেতার তথ্য ও ডেলিভারি ঠিকানা')}
              </h2>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('Customer Full Name *', 'ক্রেতার পূর্ণ নাম *')}</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t('e.g., Mohammad Ali', 'যেমন: মোহাম্মদ আলী')}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('Mobile Number (01...) *', 'সচল মোবাইল নম্বর (০১৭... বা ০১৪...) *')}</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs sm:text-sm"
                />
              </div>

              {/* Delivery Option */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('Delivery Method', 'ডেলিভারি পদ্ধতি')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-colors cursor-pointer ${
                      deliveryType === 'delivery'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{t('Home Delivery (হোম ডেলিভারি)', 'হোম ডেলিভারি')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-colors cursor-pointer ${
                      deliveryType === 'pickup'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{t('Clinic Pickup (টাউন চিকন্দি)', 'ক্লিনিক থেকে সংগ্রহ')}</span>
                  </button>
                </div>
              </div>

              {deliveryType === 'delivery' && (
                <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">{t('Select Upazila', 'উপজেলা নির্বাচন')}</label>
                    <select
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                    >
                      {CLINIC_INFO.upazilas.map((u) => (
                        <option key={u.en} value={u.en}>
                          {lang === 'bn' ? u.bn : u.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">{t('Village / Detailed Road Address *', 'গ্রাম, পাড়া ও বিস্তারিত ঠিকানা *')}</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t('e.g., Near Bazar, School Road...', 'যেমন: চিকন্দি বাজার সংলগ্ন, স্কুল রোড...')}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('Payment Method', 'মূল্য পরিশোধ পদ্ধতি')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-2 rounded-lg border text-center font-semibold transition-colors cursor-pointer ${
                      paymentMethod === 'cod' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {t('Cash on Delivery', 'ক্যাশ অন ডেলিভারি')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-2 rounded-lg border text-center font-semibold transition-colors cursor-pointer ${
                      paymentMethod === 'bkash' ? 'bg-pink-700 text-white border-pink-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {t('bKash / Nagad Send', 'বিকাশ / নগদ পেমেন্ট')}
                  </button>
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Special Instruction / Note', 'কোনো বিশেষ নির্দেশনা থাকলে')}</label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={t('e.g., Please call before arrival...', 'যেমন: আসার আগে কল দিবেন...')}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              {/* Summary */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span>{t('Items Total', 'পণ্যের দাম')}:</span>
                  <span className="font-bold">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>{t('Delivery Fee', 'ডেলিভারি ফি')}:</span>
                  <span className="font-bold">৳{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-emerald-950 font-black text-sm pt-1 border-t border-emerald-200">
                  <span>{t('Total Payable Amount', 'সর্বমোট প্রদেয়')}:</span>
                  <span>৳{totalAmount}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('Confirm Order Now', 'অর্ডার নিশ্চিত করুন')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Confirmed Receipt Modal with WhatsApp Dispatch */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-emerald-200 text-center relative my-8">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                {t('Order Placed Successfully', 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে')}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {t('Order Token: ', 'অর্ডার নম্বর: ')}
                <span className="text-emerald-700">{confirmedOrder.id}</span>
              </h2>
              <p className="text-xs text-slate-600">
                {t(
                  'Your order has been recorded. Click below to send your order slip directly to our clinic WhatsApp for priority dispatch.',
                  'আপনার অর্ডারটি সংরক্ষিত হয়েছে। দ্রুত ডেলিভারি কনফার্মেশনের জন্য স্লিপটি আমাদের অফিশিয়াল হোয়াটসঅ্যাপে পাঠিয়ে দিন।'
                )}
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">{t('Customer', 'ক্রেতা')}</span>
                <span className="font-bold text-slate-900">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">{t('Phone', 'মোবাইল')}</span>
                <span className="font-semibold">{confirmedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">{t('Delivery Address', 'ঠিকানা')}</span>
                <span className="font-medium text-slate-800 text-right">{confirmedOrder.deliveryAddress}</span>
              </div>
              <div className="border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 block mb-1">{t('Ordered Items', 'অর্ডারকৃত পণ্য')}:</span>
                {confirmedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700">
                    <span>{it.product.nameBn} x {it.quantity}</span>
                    <span className="font-bold">৳{it.product.priceBdt * it.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-slate-900">{t('Total Payable', 'সর্বমোট মূল্য')}</span>
                <span className="text-base font-black text-emerald-800">৳{confirmedOrder.totalBdt}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <a
                href={`https://wa.me/${CLINIC_INFO.whatsappClean}?text=${constructWhatsAppOrderMsg(confirmedOrder)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t('Send Order to WhatsApp (01402893006)', 'হোয়াটসঅ্যাপে অর্ডার স্লিপ পাঠান')}</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => window.print()}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t('Print Invoice', 'রসিদ প্রিন্ট')}</span>
                </button>

                <button
                  onClick={() => setConfirmedOrder(null)}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                >
                  <span>{t('Back to Shop', 'শপে ফিরুন')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
