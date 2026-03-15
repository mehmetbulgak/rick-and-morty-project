import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { Container } from "@/shared/components/container/container";
import styles from "./site-header.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link className={styles.brand} href="/" aria-label="Go to homepage">
          <Image
            src={logo}
            alt="Rick and Morty icon"
            priority
            className={styles.logo}
          />
        </Link>
      </Container>
    </header>
  );
}
