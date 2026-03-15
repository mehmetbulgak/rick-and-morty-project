import Image from "next/image";
import logo from "@/assets/rm.png";
import styles from "./character-hero.module.css";

export function CharacterHero() {
  return (
    <section className={styles.hero} aria-labelledby="characters-hero-title">
      <Image
        id="characters-hero-title"
        src={logo}
        alt="Rick and Morty"
        priority
        className={styles.logo}
      />
    </section>
  );
}
