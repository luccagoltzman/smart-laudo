import { Link, useLocation } from 'react-router-dom';
import styles from './Layout.module.scss';

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export function Layout({ children, title, showBack }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          {showBack && !isHome ? (
            <Link to="/" className={styles.back} aria-label="Voltar">
              ←
            </Link>
          ) : null}
          <h1 className={styles.logo}>
            <Link to="/">Smart Laudo</Link>
          </h1>
        </div>
        {title ? <p className={styles.pageTitle}>{title}</p> : null}
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
