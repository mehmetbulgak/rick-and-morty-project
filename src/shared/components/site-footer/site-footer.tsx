import { Container } from "@/shared/components/container/container";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <a
          href="https://www.vanoraventures.com"
          title="Vanora Ventures"
          className={styles.link}
        >
          Vanora Ventures
        </a>
      </Container>
    </footer>
  );
}
