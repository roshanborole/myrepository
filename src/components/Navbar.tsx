import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link href="/">
            <span className={styles.logo}>ROSHSPARK</span>
            <span className={styles.stadium}>STADIUM</span>
          </Link>
        </div>
        
        <div className={styles.navLinks}>
          <Link href="/" className={styles.link}>Home</Link>
          <Link href="/matches" className={styles.link}>Matches</Link>
          <Link href="/series" className={styles.link}>Series</Link>
          <Link href="/tickets" className={styles.link}>Tickets</Link>
          <Link href="/news" className={styles.link}>News</Link>
          <Link href="/videos" className={styles.link}>Videos</Link>
          <Link href="/stadium" className={styles.link}>Stadium</Link>
        </div>
        
        <div className={styles.actions}>
          <Link href="/tickets" className="btn-primary">Book Tickets</Link>
        </div>
      </div>
    </nav>
  );
}
