import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import Link from 'next/link';


export default function Home() {
  return (
    <>
      <Header activePage="home" />

      {/* Hero Section — Architectural Grid */}
      <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>

        {/* SVG Geometric Grid Background */}
        <svg
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#E5E7EB" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>



        {/* Main Hero Content */}
        <div className="container hero-container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="hero-content-center">

            <div className="hero-copy-center">
              <h1>
                شاهد ستارتك الجديدة <span className="hero-accent">في غرفتك</span>، قبل أن تقتنيها
              </h1>
              <p>
                ارفع صورة حقيقية لغرفتك، اختر الطراز والقماش واللون، ودع الذكاء الاصطناعي يركّب الستارة بإضاءة وظلال واقعية خلال ثوانٍ من معرض ستائر شام.
              </p>

              {/* Dual CTA Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {/* Primary: Manual Design */}
                  <Link href="/app" className="hero-primary-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                    صمّم بنفسك
                  </Link>

                  {/* Secondary: AI Suggestion */}
                  <Link href="/app?magic=true" className="hero-ai-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
                      <path d="M20 3v4"/><path d="M22 5h-4"/>
                    </svg>
                    اللمسة السحرية
                  </Link>
                </div>

                {/* AI hint text */}
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, textAlign: 'center', maxWidth: '360px', lineHeight: 1.6 }}>
                  سيقوم الذكاء الاصطناعي بتحليل إضاءة وألوان غرفتك لاقتراح الستارة المثالية
                </p>
              </div>
            </div>

            {/* Hero Stats */}
            <div className="hero-stats-center">
              <div className="hero-stat-item">
                <strong>+150</strong>
                <span>تركيبة من الطرز والأقمشة والألوان</span>
              </div>
              <div className="hero-stat-item">
                <strong>~30 ثانية</strong>
                <span>من رفع الصورة حتى النتيجة</span>
              </div>
              <div className="hero-stat-item">
                <strong>مجاناً</strong>
                <span>بدون تسجيل أو بطاقة دفع</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Hero BeforeAfter Comparison Section */}
      <section className="section" style={{ padding: '48px 0 24px 0' }}>
        <div className="container">
          <h2 className="section-title">شاهد الستارة في غرفتك قبل وبعد التركيب</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <BeforeAfterSlider
              beforeImage="/assets/window-empty.jpg"
              afterImage="/assets/window-curtain.jpg"
              beforeAlt="غرفة معيشة بنافذة بدون ستارة"
              afterAlt="الغرفة نفسها بستارة مصممة بالذكاء الاصطناعي"
              aspectRatio="1/1"
            />
          </div>
          
          <div className="hero-frame-caption">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 18-6-6 6-6"></path>
              <path d="m15 6 6 6-6 6"></path>
            </svg>
            <span>اسحب المقبض لمقارنة الغرفة قبل وبعد</span>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="section section--tinted">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="section-title">ثلاث خطوات تفصلك عن ستارتك الجديدة</h2>
          
          <div className="steps">
            <div className="step">
              <span className="step-num">01</span>
              <h3>ارفع صورة غرفتك</h3>
              <p>صوّر نافذتك بإضاءة نهارية واضحة بحيث تظهر النافذة كاملة، ثم ارفع الصورة مباشرة من جهازك.</p>
            </div>
            
            <div className="step">
              <span className="step-num">02</span>
              <h3>حدّد ذوقك</h3>
              <p>اختر من 13 طرازاً حديثاً و6 ألوان وأقمشة متعددة — من المخمل الكلاسيكي والتول والكتان حتى رول سنسكرين.</p>
            </div>
            
            <div className="step">
              <span className="step-num">03</span>
              <h3>قارن النتيجة</h3>
              <p>يولّد النموذج الستارة مدموجة بإضاءة غرفتك الأصلية، وتقارنها مع الصورة الأولى بسحب مقبض واحد.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="section-title">مصمم لغرفتك أنت، لا لغرفة في كتالوج</h2>
          
          <div className="features">
            {/* Feature 1 */}
            <div className="feature-row">
              <div className="feature-media">
                <div className="feature-mat">
                  <img src="/assets/gallery-2-curtain.jpg" alt="ستارة مخملية كحلية مركبة على نافذة غرفة حقيقية" className="feature-img" />
                </div>
              </div>
              <div className="feature-body">
                <h3>غرفتك الحقيقية، وليس صورة نموذجية</h3>
                <p>
                  معظم متاجر الستائر تعرض القماش على غرف مثالية لا تشبه بيتك. هنا ترى الستارة على نافذتك أنت، بأثاثك وجدرانك وأرضيتك كما هي، دون أي تغيير في بقية الصورة.
                </p>
                <ul className="feature-list">
                  <li>النافذة تُكتشف تلقائياً من الصورة</li>
                  <li>الستارة تُفصّل على مقاس النافذة وإطارها</li>
                  <li>الأثاث والجدران تبقى كما هي تماماً</li>
                </ul>
              </div>
            </div>

            {/* Feature 2 (flipped) */}
            <div className="feature-row feature-row--flip">
              <div className="feature-media">
                <div className="feature-mat">
                  <img src="/assets/gallery-5-curtain.jpg" alt="ستارة حريرية تعكس إضاءة الغرفة الطبيعية" className="feature-img" />
                </div>
              </div>
              <div className="feature-body">
                <h3>إضاءة وظلال تُقنع العين</h3>
                <p>
                  لا يكتفي النموذج بلصق صورة قماش فوق النافذة؛ بل يحسب اتجاه الضوء في غرفتك ويرسم طيات القماش وظلاله بما يطابق الإضاءة الأصلية، فتبدو النتيجة كصورة فوتوغرافية التُقطت بعد التركيب.
                </p>
                <ul className="feature-list">
                  <li>طيات وانسدال طبيعي حسب نوع القماش</li>
                  <li>انعكاسات تتغير بين المخمل والتول والكتان</li>
                  <li>ظلال متسقة مع مصدر الضوء في الغرفة</li>
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="feature-row">
              <div className="feature-media">
                <div className="feature-mat">
                  <img src="/assets/gallery-3-curtain.jpg" alt="ستارة رومانية قطنية بطيات أفقية مرتبة" className="feature-img" />
                </div>
              </div>
              <div className="feature-body">
                <h3>بلا تحديد يدوي ولا فرشاة</h3>
                <p>
                  لا تحتاج لتظليل النافذة أو رسم قناع حولها. ارفع الصورة كما هي واضغط زراً واحداً — يتولى النظام تحديد النافذة وتركيب الستارة من البداية إلى النهاية.
                </p>
                <ul className="feature-list">
                  <li>رفع الصورة بالسحب والإفلات بسهولة</li>
                  <li>ضغط وتحسين تلقائي للصور الكبيرة</li>
                  <li>تحميل النتيجة بجودة عالية مجاناً</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Gallery Preview Section */}
      <section className="section section--tinted">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">تصاميم وُلّدت بنفس المحرك المتاح لك</h2>
          
          <div className="peek-grid">
            {/* Card 1 */}
            <article className="interactive-card">
              <div className="card-media-container">
                <BeforeAfterSlider
                  beforeImage="/assets/gallery-1-window.jpg"
                  afterImage="/assets/gallery-1-curtain.jpg"
                  beforeAlt="نافذة فارغة"
                  afterAlt="ستارة ويفي كتان بيضاء"
                  aspectRatio="1.25"
                />
              </div>
              <div className="card-content-info">
                <h3>ستارة ويفي كتان ناصعة البياض</h3>
                <div className="card-tags">
                  <span className="card-tag">مودرن</span>
                  <span className="card-tag">كتان</span>
                  <span className="card-tag">أبيض</span>
                </div>
                <Link href="/app?style=wave&fabric=linen&color=white" className="card-cta-link">
                  <span>جرب هذا الطراز</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5"></path>
                    <path d="m12 19-7-7 7-7"></path>
                  </svg>
                </Link>
              </div>
            </article>

            {/* Card 2 */}
            <article className="interactive-card">
              <div className="card-media-container">
                <BeforeAfterSlider
                  beforeImage="/assets/gallery-4-window.jpg"
                  afterImage="/assets/gallery-4-curtain.jpg"
                  beforeAlt="نافذة فارغة"
                  afterAlt="ستارة شيفون بيج"
                  aspectRatio="1.25"
                />
              </div>
              <div className="card-content-info">
                <h3>ستارة شيفون ناعمة لتصفية الضوء</h3>
                <div className="card-tags">
                  <span className="card-tag">بسيط</span>
                  <span className="card-tag">شيفون</span>
                  <span className="card-tag">بيج</span>
                </div>
                <Link href="/app?style=gathered&fabric=cotton&color=beige" className="card-cta-link">
                  <span>جرب هذا الطراز</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5"></path>
                    <path d="m12 19-7-7 7-7"></path>
                  </svg>
                </Link>
              </div>
            </article>

            {/* Card 3 */}
            <article className="interactive-card">
              <div className="card-media-container">
                <BeforeAfterSlider
                  beforeImage="/assets/gallery-6-window.jpg"
                  afterImage="/assets/gallery-6-curtain.jpg"
                  beforeAlt="نافذة فارغة"
                  afterAlt="ستارة دانتيل وردي مغبر"
                  aspectRatio="1.25"
                />
              </div>
              <div className="card-content-info">
                <h3>ستارة دانتيل بنقوش كلاسيكية ناعمة</h3>
                <div className="card-tags">
                  <span className="card-tag">مودرن</span>
                  <span className="card-tag">دانتيل</span>
                  <span className="card-tag">وردي مغبر</span>
                </div>
                <Link href="/app?style=classic_rod&fabric=lace&color=rose" className="card-cta-link">
                  <span>جرب هذا الطراز</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5"></path>
                    <path d="m12 19-7-7 7-7"></path>
                  </svg>
                </Link>
              </div>
            </article>
          </div>
          
          <Link href="/gallery" className="btn-link">
            <span>استعرض معرض الأعمال الكامل والأسعار 🛍️</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5"></path>
              <path d="m12 19-7-7 7-7"></path>
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer Call to Action (CTA) */}
      <section className="section" style={{ padding: '40px 0' }}>
        <div className="container">
          <div className="footer-cta">
            <div>
              <h2 className="footer-cta-title">جاهز لتجربة ستارتك الأولى؟</h2>
              <p className="footer-cta-desc">ارفع صورة غرفتك وشاهد النتيجة خلال ثوانٍ.</p>
            </div>
            <Link href="/app" className="btn btn-primary btn-large">
              ابدأ التصميم الآن
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
