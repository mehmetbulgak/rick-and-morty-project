import Link from "next/link";
import type { Character } from "@/features/characters/types/character";
import { CharacterArtwork } from "@/shared/components/character-artwork/character-artwork";
import styles from "./character-card.module.css";

type CharacterCardProps = {
  character: Character;
};

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link
      href={`/characters/${character.id}`}
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
    >
      <CharacterArtwork
        name={character.name}
        imageSrc={character.imageSrc}
        accent={character.accent}
      />
      <div className={styles.content}>
        <h2 className={styles.title}>{character.name}</h2>
        <p className={styles.subtitle}>{character.species}</p>
      </div>
    </Link>
  );
}
