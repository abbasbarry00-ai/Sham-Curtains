import Link from 'next/link';

interface HeaderProps {
  activePage: 'home' | 'app' | 'gallery';
}

export default function Header({ activePage }: HeaderProps) {
  return (
    <header className="header">
      <div className="container header-container">
        <Link href="/" className="logo">
          <span className="logo-icon"></span>
          <span>ستارة AI</span>
        </Link>
        <nav className="nav">
          <Link href="/" className={`nav-link ${activePage === 'home' ? 'active' : ''}`}>
            الرئيسية
          </Link>
          <Link href="/app" className={`nav-link ${activePage === 'app' ? 'active' : ''}`}>
            المصمم التفاعلي
          </Link>
          <Link href="/gallery" className={`nav-link ${activePage === 'gallery' ? 'active' : ''}`}>
            معرض الإلهام
          </Link>
        </nav>
        <div>
          <Link href="/app" className="btn btn-primary">
            ابدأ التصميم
          </Link>
        </div>
      </div>
    </header>
  );
}
