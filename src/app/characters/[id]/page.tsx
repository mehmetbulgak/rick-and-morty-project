import { CharacterProfile } from "@/features/characters/components/character-profile/character-profile";
import { Container } from "@/shared/components/container/container";
import styles from "./page.module.css";

type CharacterDetailPageProps = {
  params: {
    id: string;
  };
};

export default function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  const characterId = Number(params.id);

  return (
    <main className={styles.page}>
      <Container className={styles.content}>
        <CharacterProfile id={characterId} />
      </Container>
    </main>
  );
}
