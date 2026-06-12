import Link from 'next/link';

interface HeaderProps {
  activePage: 'home' | 'app' | 'gallery';
}

export default function Header({ activePage }: HeaderProps) {
  return (
    <header className="header">
      <div className="container header-container">
        <Link href="/" className="logo">
          <span>معرض ستائر شام</span>
        </Link>
        <nav className="nav">
          <Link href="/" className={`nav-link ${activePage === 'home' ? 'active' : ''}`}>
            الرئيسية
          </Link>
          <Link href="/app" className={`nav-link ${activePage === 'app' ? 'active' : ''}`}>
            المصمم التفاعلي
          </Link>
          <Link href="/gallery" className={`nav-link ${activePage === 'gallery' ? 'active' : ''}`}>
            معرض أعمالنا
          </Link>
        </nav>
        <div className="header-cta">
          <Link href="/app" className="btn btn-primary">
            ابدأ التصميم
          </Link>
        </div>
      </div>
    </header>
  );
}
