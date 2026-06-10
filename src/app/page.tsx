import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header activePage="home" />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="badge">
            <span className="badge-dot"></span>
            <span>بتقنية Flux-Kontext-Pro المتطورة</span>
          </div>
          <h1>صمم ستائرك بالذكاء الاصطناعي</h1>
          <p>
            ارفع صورة نافذتك وغرفتك الحقيقية بالكامل، واختر الستايل واللون والنوع المفضل لديك لتشاهد ستارتك الجديدة كأنها حقيقية تماماً في غرفتك بضغطة زر واحدة من معرض ستائر شام.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '48px' }}>
            <Link href="/app" className="btn btn-primary btn-large">
              ابدأ تجربة التصميم مجاناً
            </Link>
            <Link href="/gallery" className="btn btn-secondary btn-large">
              تصفح معرض أعمالنا
            </Link>
          </div>
          
          {/* Reusable React Before/After Slider */}
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <BeforeAfterSlider
              beforeImage="/assets/window-empty.jpg"
              afterImage="/assets/window-curtain.jpg"
              beforeAlt="نافذة بدون ستارة"
              afterAlt="نافذة مع ستارة مصممة بالذكاء الاصطناعي"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '60px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 800, marginBottom: '48px' }}>
            لماذا تختار معرض ستائر شام؟
          </h2>
          <div className="grid-3">
            <div className="card">
              <div className="card-icon">🪟</div>
              <h3 className="card-title">نافذتك الحقيقية</h3>
              <p className="card-desc">
                لا حاجة لتخيل التصاميم على غرف نموذجية، يمكنك رفع صورة غرفتك ونوافذك الخاصة لرؤية دقيقة بنسبة 100%.
              </p>
            </div>
            <div className="card">
              <div className="card-icon">✨</div>
              <h3 className="card-title">تعديل تلقائي بالكامل</h3>
              <p className="card-desc">
                وداعاً للفرشاة والتظليل اليدوي. بفضل نموذج Flux Kontext Pro الذكي، يتعرف النظام على النافذة ويركب الستارة بشكل تلقائي تماماً.
              </p>
            </div>
            <div className="card">
              <div className="card-icon">🎨</div>
              <h3 className="card-title">تنسيق واقعي للألوان والظلال</h3>
              <p className="card-desc">
                تندمج الستائر بدقة مع توزيع الإضاءة الطبيعية وظلال غرفتك الأصلية، مما يمنحك نتيجة تبدو كصورة فوتوغرافية حقيقية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Works Gallery Preview Section */}
      <section style={{ padding: '60px 0 80px 0', borderTop: '1px solid var(--border)', background: 'var(--accents-1)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
            من أعمالنا الحقيقية في معرض شام
          </h2>
          <p style={{ color: 'var(--accents-6)', maxWidth: '600px', margin: '0 auto 48px auto', fontSize: '16px' }}>
            شاهد تصاميم حقيقية تم تفصيلها وتركيبها لعملائنا بجودة فائقة وخامات متميزة.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {/* Work 1 */}
            <div className="store-card">
              <div className="store-image-box">
                <img src="/assets/gallery-1-curtain.jpg" alt="ستارة ويفي كتان" className="store-img" />
                <span className="store-card-badge">الأكثر طلباً</span>
              </div>
              <div className="store-card-info">
                <h3 className="store-card-title">ستارة ويفي كتان ناصعة البياض</h3>
                <div className="store-card-tags">
                  <span className="store-card-tag">ويفي (Wave)</span>
                  <span className="store-card-tag">كتان طبيعي</span>
                  <span className="store-card-tag">صالون ضيوف</span>
                </div>
                <div className="store-card-footer">
                  <span className="store-card-price">تفصيل يبدأ من <span>120$</span></span>
                  <a href="https://wa.me/9647700000000?text=مرحباً، أريد الاستفسار عن ستارة ويفي كتان بيضاء" target="_blank" rel="noopener noreferrer" className="store-order-btn">
                    طلب تفصيل مشابه 💬
                  </a>
                </div>
              </div>
            </div>

            {/* Work 2 */}
            <div className="store-card">
              <div className="store-image-box">
                <img src="/assets/gallery-2-curtain.jpg" alt="ستارة مخمل كلاسيك" className="store-img" />
                <span className="store-card-badge">كلاسيك فاخر</span>
              </div>
              <div className="store-card-info">
                <h3 className="store-card-title">ستارة مخملية زرقاء داكنة كلاسيكية</h3>
                <div className="store-card-tags">
                  <span className="store-card-tag">كلاسيك بوري</span>
                  <span className="store-card-tag">مخمل ثقيل</span>
                  <span className="store-card-tag">غرفة جلوس</span>
                </div>
                <div className="store-card-footer">
                  <span className="store-card-price">تفصيل يبدأ من <span>180$</span></span>
                  <a href="https://wa.me/9647700000000?text=مرحباً، أريد الاستفسار عن ستارة مخمل كلاسيك كحلي" target="_blank" rel="noopener noreferrer" className="store-order-btn">
                    طلب تفصيل مشابه 💬
                  </a>
                </div>
              </div>
            </div>

            {/* Work 3 */}
            <div className="store-card">
              <div className="store-image-box">
                <img src="/assets/gallery-3-curtain.jpg" alt="ستارة روماني زيتي" className="store-img" />
                <span className="store-card-badge">عملية وحديثة</span>
              </div>
              <div className="store-card-info">
                <h3 className="store-card-title">ستارة رومانية مطوية من القطن الطبيعي</h3>
                <div className="store-card-tags">
                  <span className="store-card-tag">روماني مطوي</span>
                  <span className="store-card-tag">قطن ناعم</span>
                  <span className="store-card-tag">غرفة نوم</span>
                </div>
                <div className="store-card-footer">
                  <span className="store-card-price">تفصيل يبدأ من <span>90$</span></span>
                  <a href="https://wa.me/9647700000000?text=مرحباً، أريد الاستفسار عن ستارة رومانية قطن زيتي" target="_blank" rel="noopener noreferrer" className="store-order-btn">
                    طلب تفصيل مشابه 💬
                  </a>
                </div>
              </div>
            </div>
          </div>

          <Link href="/gallery" className="btn btn-secondary btn-large">
            تصفح معرض الأعمال الكامل والأسعار 🛍️
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
