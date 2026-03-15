import type { Character } from "@/features/characters/types/character";
import { CharacterCard } from "@/features/characters/components/character-card/character-card";
import { ActivitySpinner } from "@/shared/components/activity-spinner/activity-spinner";
import styles from "./character-grid.module.css";

type CharacterCardGridProps = {
  characters: Character[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  errorMessage?: string | null;
};

export function CharacterCardGrid({
  characters,
  isLoading = false,
  isRefreshing = false,
  errorMessage = null,
}: CharacterCardGridProps) {
  if (isLoading && characters.length === 0) {
    return (
      <section className={styles.section} aria-label="Loading characters">
        <div className={styles.grid}>
          {Array.from({ length: 8 }, (_, index) => (
            <article key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonMedia} />
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonSubtitle} />
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (isRefreshing) {
    return (
      <section
        className={styles.refreshState}
        aria-label="Updating characters"
        aria-busy="true"
      >
        <div className={styles.statusBanner} role="status" aria-live="polite">
          <ActivitySpinner />
          <span>Searching characters...</span>
        </div>
      </section>
    );
  }

  if (errorMessage && characters.length === 0) {
    return (
      <section className={styles.emptyState}>
        <h2 className={styles.emptyTitle}>Unable to load characters</h2>
        <p className={styles.emptyDescription}>{errorMessage}</p>
      </section>
    );
  }

  if (characters.length === 0) {
    return (
      <section className={styles.emptyState}>
        <h2 className={styles.emptyTitle}>No characters found</h2>
        <p className={styles.emptyDescription}>
          Try a different name or adjust the filters.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-label="Character list">
      {errorMessage ? (
        <div className={styles.errorBanner} role="alert">
          {errorMessage}
        </div>
      ) : null}
      <div className={styles.gridFrame}>
        <div className={styles.grid}>
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      </div>
    </section>
  );
}
