"use client";

import Link from "next/link";
import { CharacterEpisodeList } from "@/features/characters/components/character-episode-list/character-episode-list";
import { CharacterInfoList } from "@/features/characters/components/character-info-list/character-info-list";
import { useCharacterProfile } from "@/features/characters/hooks/use-character-profile";
import { CharacterArtwork } from "@/shared/components/character-artwork/character-artwork";
import { ActivitySpinner } from "@/shared/components/activity-spinner/activity-spinner";
import { ArrowLeftIcon } from "@/shared/icons";
import styles from "./character-profile.module.css";

type CharacterProfileProps = {
  id: number;
};

export function CharacterProfile({ id }: CharacterProfileProps) {
  const { profile, isLoading, errorMessage, isNotFound } = useCharacterProfile(id);

  if (isLoading) {
    return (
      <section
        className={styles.stateCard}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className={styles.stateContent}>
          <ActivitySpinner />
          <p className={styles.stateTitle}>Loading character...</p>
          <p className={styles.stateDescription}>
            Character and episode requests are being fetched in the browser.
          </p>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className={styles.stateCard}>
        <p className={styles.stateTitle}>Unable to load character</p>
        <p className={styles.stateDescription}>{errorMessage}</p>
      </section>
    );
  }

  if (isNotFound || !profile) {
    return (
      <section className={styles.stateCard}>
        <p className={styles.stateTitle}>Character not found</p>
        <p className={styles.stateDescription}>
          The requested character does not exist in the API.
        </p>
      </section>
    );
  }

  return (
    <>
      <Link href="/" className={styles.backLink}>
        <ArrowLeftIcon className={styles.backIcon} />
        <span>Go Back</span>
      </Link>

      <section className={styles.hero}>
        <CharacterArtwork
          name={profile.name}
          imageSrc={profile.imageSrc}
          shape="circle"
          accent={profile.accent}
          priority
          className={styles.avatar}
        />
        <h1 className={styles.title}>{profile.name}</h1>
      </section>

      <section className={styles.grid}>
        <div className={styles.column}>
          <h2 className={styles.sectionTitle}>Informations</h2>
          <CharacterInfoList
            items={[
              { label: "Gender", value: profile.gender },
              { label: "Status", value: profile.status },
              { label: "Specie", value: profile.species },
              { label: "Origin", value: profile.origin },
              { label: "Type", value: profile.type || "Unknown" },
              {
                label: "Location",
                value: profile.location,
                withArrow: true,
              },
            ]}
          />
        </div>

        <div className={styles.column}>
          <h2 className={styles.sectionTitle}>Episodes</h2>
          <CharacterEpisodeList episodes={profile.episodes} />
        </div>
      </section>
    </>
  );
}
