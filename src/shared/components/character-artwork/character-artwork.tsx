import type { CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/cn";
import styles from "./character-artwork.module.css";

type CharacterArtworkProps = {
  name: string;
  imageSrc?: string;
  className?: string;
  shape?: "card" | "circle";
  accent?: string;
  priority?: boolean;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((value) => value.charAt(0).toUpperCase())
    .join("");
}

export function CharacterArtwork({
  name,
  imageSrc,
  className,
  shape = "card",
  accent = "#18bddf",
  priority = false,
}: CharacterArtworkProps) {
  const accentStyles = {
    "--character-accent": accent,
  } as CSSProperties;

  return (
    <div
      className={cn(styles.frame, styles[shape], className)}
      style={accentStyles}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={name}
          fill
          priority={priority}
          className={styles.image}
          sizes={
            shape === "circle"
              ? "(max-width: 767px) 280px, 340px"
              : "(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw"
          }
        />
      ) : (
        <div className={styles.placeholder}>
          <span className="sr-only">{name} artwork placeholder</span>
          <div className={styles.noise} />
          <div className={styles.glow} />
          <span className={styles.initials}>{getInitials(name)}</span>
          <span className={styles.caption}>Artwork coming soon</span>
        </div>
      )}
    </div>
  );
}
