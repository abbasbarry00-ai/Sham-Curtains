import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: About */}
          <div className="footer-col">
            <h4>معرض ستائر شام</h4>
            <p style={{ color: 'var(--accents-5)', marginBottom: '16px' }}>
              نقدم لكم أرقى موديلات الستائر المكتبية والمنزلية وتفصيلها بأحدث التقنيات. صمم مساحتك الآن بالذكاء الاصطناعي وشاهد النتيجة فوراً قبل التنفيذ.
            </p>
          </div>

          {/* Column 2: Links */}
          <div className="footer-col">
            <h4>روابط سريعة</h4>
            <ul>
              <li><Link href="/">الرئيسية</Link></li>
              <li><Link href="/app">المصمم التفاعلي</Link></li>
              <li><Link href="/gallery">معرض أعمالنا</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="footer-col">
            <h4>تواصل معنا</h4>
            <ul style={{ gap: '6px' }}>
              <li style={{ fontSize: '13px' }}>📞 هاتف: 9647700000000+</li>
              <li style={{ fontSize: '13px' }}>📍 بغداد، شارع الربيعي، العراق</li>
              <li style={{ fontSize: '13px' }}>✉️ البريد: info@sham-curtains.com</li>
            </ul>
          </div>

          {/* Column 4: Hours */}
          <div className="footer-col">
            <h4>أوقات العمل</h4>
            <p style={{ fontSize: '13px', color: 'var(--accents-5)' }}>
              السبت - الخميس:<br />
              9:00 صباحاً - 9:30 مساءً<br />
              الجمعة: عطلة أسبوعية
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 معرض ستائر شام. جميع الحقوق محفوظة لـ MESO GROUP.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">إنستغرام</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">فيسبوك</a>
            <a href="https://wa.me/9647700000000" target="_blank" rel="noopener noreferrer">واتساب</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
