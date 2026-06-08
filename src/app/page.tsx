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
            ارفع صورة نافذتك وغرفتك الحقيقية بالكامل، واختر الستايل واللون والنوع المفضل لديك لتشاهد ستارتك الجديدة كأنها حقيقية تماماً في غرفتك بضغطة زر واحدة.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '48px' }}>
            <Link href="/app" className="btn btn-primary btn-large">
              ابدأ تجربة التصميم مجاناً
            </Link>
            <Link href="/gallery" className="btn btn-secondary btn-large">
              تصفح معرض التصاميم
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
            لماذا تختار ستارة AI؟
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

      <Footer />
    </>
  );
}
