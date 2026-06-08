'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Define layout tags for design items
interface GalleryItem {
  id: number;
  title: string;
  style: string;
  fabric: string;
  color: string;
  curtainImage: string;
  windowImage: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "ستارة مودرن ناصعة البياض",
    style: "مودرن",
    fabric: "كتان",
    color: "أبيض",
    curtainImage: "/assets/gallery-1-curtain.jpg",
    windowImage: "/assets/gallery-1-window.jpg"
  },
  {
    id: 2,
    title: "ستارة مخملية كلاسيكية فاخرة",
    style: "كلاسيك",
    fabric: "مخمل",
    color: "كحلي",
    curtainImage: "/assets/gallery-2-curtain.jpg",
    windowImage: "/assets/gallery-2-window.jpg"
  },
  {
    id: 3,
    title: "ستارة رومانية من القطن الطبيعي",
    style: "روماني",
    fabric: "قطن",
    color: "أخضر زيتي",
    curtainImage: "/assets/gallery-3-curtain.jpg",
    windowImage: "/assets/gallery-3-window.jpg"
  },
  {
    id: 4,
    title: "ستارة شيفون ناعمة لتصفية الضوء",
    style: "بسيط",
    fabric: "شيفون",
    color: "بيج",
    curtainImage: "/assets/gallery-4-curtain.jpg",
    windowImage: "/assets/gallery-4-window.jpg"
  },
  {
    id: 5,
    title: "ستارة حريرية ذهبية براقة",
    style: "كلاسيك",
    fabric: "حرير",
    color: "ذهبي",
    curtainImage: "/assets/gallery-5-curtain.jpg",
    windowImage: "/assets/gallery-5-window.jpg"
  },
  {
    id: 6,
    title: "ستارة دانتيل بنقوش كلاسيكية ناعمة",
    style: "مودرن",
    fabric: "دانتيل",
    color: "وردي مغبر",
    curtainImage: "/assets/gallery-6-curtain.jpg",
    windowImage: "/assets/gallery-6-window.jpg"
  }
];

function GalleryCard({ item }: { item: GalleryItem }) {
  const [showingWindow, setShowingWindow] = useState(false);

  return (
    <div 
      className="gallery-card"
      onMouseEnter={() => setShowingWindow(true)}
      onMouseLeave={() => setShowingWindow(false)}
    >
      <div className="gallery-image-box">
        <img 
          src={showingWindow ? item.windowImage : item.curtainImage} 
          alt={item.title} 
          className="gallery-img"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'src 0.2s ease' }}
        />
        <button 
          className="simple-compare-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowingWindow(!showingWindow);
          }}
        >
          {showingWindow ? "عرض الستارة" : "النافذة الأصلية"}
        </button>
      </div>
      <div className="gallery-info">
        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{item.title}</h3>
        <div className="gallery-tags">
          <span className="gallery-tag">{item.style}</span>
          <span className="gallery-tag">{item.fabric}</span>
          <span className="gallery-tag">{item.color}</span>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <>
      <Header activePage="gallery" />

      {/* Gallery Header */}
      <section style={{ padding: '60px 0 20px 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px' }}>معرض الإلهام</h1>
          <p style={{ color: 'var(--accents-6)', maxWidth: '600px', margin: '0 auto' }}>
            استعرض نماذج حقيقية لتصاميم الستائر المولدة بواسطة الذكاء الاصطناعي. مرر الفأرة فوق أي بطاقة لمشاهدة التحول الفوري للنافذة.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section style={{ paddingBottom: '80px' }}>
        <div className="container">
          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
