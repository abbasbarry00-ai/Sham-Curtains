'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Define layout tags for store items
interface StoreItem {
  id: number;
  title: string;
  style: string;
  fabric: string;
  color: string;
  category: 'fabric' | 'roller' | 'classic';
  badge: string;
  price: string;
  whatsappText: string;
  curtainImage: string;
  windowImage: string;
}

const storeItems: StoreItem[] = [
  {
    id: 1,
    title: "ستارة ويفي كتان ناصعة البياض",
    style: "ويفي (Wave)",
    fabric: "كتان طبيعي",
    color: "أبيض",
    category: "fabric",
    badge: "الأكثر طلباً",
    price: "120$",
    whatsappText: "مرحباً معرض شام، أود الاستفسار عن تفصيل ستارة ويفي كتان بيضاء (كود المنتج: SHAM-01)",
    curtainImage: "/assets/gallery-1-curtain.jpg",
    windowImage: "/assets/gallery-1-window.jpg"
  },
  {
    id: 2,
    title: "ستارة مخملية كلاسيكية زرقاء داكنة",
    style: "كلاسيك بوري",
    fabric: "مخمل ثقيل",
    color: "كحلي",
    category: "classic",
    badge: "كلاسيك فاخر",
    price: "180$",
    whatsappText: "مرحباً معرض شام، أود الاستفسار عن تفصيل ستارة مخمل كلاسيك كحلي (كود المنتج: SHAM-02)",
    curtainImage: "/assets/gallery-2-curtain.jpg",
    windowImage: "/assets/gallery-2-window.jpg"
  },
  {
    id: 3,
    title: "ستارة رومانية مطوية من القطن الطبيعي",
    style: "روماني مطوي",
    fabric: "قطن ناعم",
    color: "أخضر زيتي",
    category: "roller",
    badge: "عملية وحديثة",
    price: "90$",
    whatsappText: "مرحباً معرض شام، أود الاستفسار عن تفصيل ستارة رومانية زيتي (كود المنتج: SHAM-03)",
    curtainImage: "/assets/gallery-3-curtain.jpg",
    windowImage: "/assets/gallery-3-window.jpg"
  },
  {
    id: 4,
    title: "ستارة شيفون ناعمة لتصفية الضوء",
    style: "بسيط هادئ",
    fabric: "شيفون ناعم",
    color: "بيج",
    category: "fabric",
    badge: "تصفية إضاءة",
    price: "80$",
    whatsappText: "مرحباً معرض شام، أود الاستفسار عن تفصيل ستارة شيفون بيج (كود المنتج: SHAM-04)",
    curtainImage: "/assets/gallery-4-curtain.jpg",
    windowImage: "/assets/gallery-4-window.jpg"
  },
  {
    id: 5,
    title: "ستارة حريرية ذهبية براقة كلاسيكية",
    style: "مسرحي كسرات",
    fabric: "حرير ناعم",
    color: "ذهبي",
    category: "classic",
    badge: "قصر فخم",
    price: "220$",
    whatsappText: "مرحباً معرض شام، أود الاستفسار عن تفصيل ستارة حريرية ذهبية كلاسيك (كود المنتج: SHAM-05)",
    curtainImage: "/assets/gallery-5-curtain.jpg",
    windowImage: "/assets/gallery-5-window.jpg"
  },
  {
    id: 6,
    title: "ستارة دانتيل بنقوش كلاسيكية ناعمة",
    style: "كسرات (Pleated)",
    fabric: "دانتيل منقوش",
    color: "وردي مغبر",
    category: "fabric",
    badge: "تصميم أنيق",
    price: "110$",
    whatsappText: "مرحباً معرض شام، أود الاستفسار عن تفصيل ستارة دانتيل وردي مغبر (كود المنتج: SHAM-06)",
    curtainImage: "/assets/gallery-6-curtain.jpg",
    windowImage: "/assets/gallery-6-window.jpg"
  }
];

function StoreCard({ item }: { item: StoreItem }) {
  const [showingWindow, setShowingWindow] = useState(false);

  return (
    <div 
      className="store-card"
      onMouseEnter={() => setShowingWindow(true)}
      onMouseLeave={() => setShowingWindow(false)}
    >
      <div className="store-image-box">
        <img 
          src={showingWindow ? item.windowImage : item.curtainImage} 
          alt={item.title} 
          className="store-img"
        />
        <span className="store-card-badge">{item.badge}</span>
        <button 
          className="simple-compare-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowingWindow(!showingWindow);
          }}
          style={{ background: 'rgba(255, 255, 255, 0.95)', color: '#000', border: '1px solid #ddd', fontWeight: 600 }}
        >
          {showingWindow ? "عرض الستارة" : "النافذة الأصلية"}
        </button>
      </div>
      <div className="store-card-info">
        <h3 className="store-card-title">{item.title}</h3>
        <div className="store-card-tags">
          <span className="store-card-tag">{item.style}</span>
          <span className="store-card-tag">{item.fabric}</span>
          <span className="store-card-tag">{item.color}</span>
        </div>
        <div className="store-card-footer">
          <span className="store-card-price">تفصيل يبدأ من <span>{item.price}</span></span>
          <a 
            href={`https://wa.me/9647700000000?text=${encodeURIComponent(item.whatsappText)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="store-order-btn"
          >
            طلب تفصيل مشابه 💬
          </a>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [filter, setFilter] = useState<'all' | 'fabric' | 'roller' | 'classic'>('all');

  const filteredItems = storeItems.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <>
      <Header activePage="gallery" />

      {/* Store Header */}
      <section style={{ padding: '60px 0 20px 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px' }}>معرض أعمال شام</h1>
          <p style={{ color: 'var(--accents-6)', maxWidth: '600px', margin: '0 auto' }}>
            تصفح كتالوج الستائر الحقيقية التي قمنا بتفصيلها وتركيبها لعملائنا. مرر الفأرة فوق أي تصميم لمشاهدة شكل النافذة قبل التركيب، واطلب تفصيل الموديل مباشرة عبر الواتساب.
          </p>
        </div>
      </section>

      {/* Store Filters */}
      <section style={{ padding: '20px 0' }}>
        <div className="container">
          <div className="store-filter-container">
            <button 
              className={`store-filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              الكل
            </button>
            <button 
              className={`store-filter-btn ${filter === 'fabric' ? 'active' : ''}`}
              onClick={() => setFilter('fabric')}
            >
              ستائر صالونات وأقمشة
            </button>
            <button 
              className={`store-filter-btn ${filter === 'roller' ? 'active' : ''}`}
              onClick={() => setFilter('roller')}
            >
              ستائر رول رومانية
            </button>
            <button 
              className={`store-filter-btn ${filter === 'classic' ? 'active' : ''}`}
              onClick={() => setFilter('classic')}
            >
              ستائر كلاسيكية وفخمة
            </button>
          </div>
        </div>
      </section>

      {/* Store Grid */}
      <section style={{ paddingBottom: '80px' }}>
        <div className="container">
          <div className="gallery-grid" style={{ marginTop: '0' }}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <StoreCard key={item.id} item={item} />
              ))
            ) : (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--accents-5)', padding: '40px 0' }}>
                لا توجد أعمال في هذا القسم حالياً.
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
