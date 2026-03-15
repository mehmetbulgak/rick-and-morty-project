import styles from "./page.module.css";
import { CharacterDirectory } from "@/features/characters/components/character-directory/character-directory";
import { CharacterHero } from "@/features/characters/components/character-hero/character-hero";
import { getCharacterFilters } from "@/features/characters/lib/characters";
import type { CharacterListSearchParams } from "@/features/characters/types/character";
import { Container } from "@/shared/components/container/container";

type HomePageProps = {
  searchParams?: CharacterListSearchParams;
};

export default function Home({ searchParams }: HomePageProps) {
  const filters = getCharacterFilters(searchParams);

  return (
    <main className={styles.page}>
      <Container className={styles.content}>
        <CharacterHero />
        <CharacterDirectory filters={filters} />
      </Container>
    </main>
  );
}
