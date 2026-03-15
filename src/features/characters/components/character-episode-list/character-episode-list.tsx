import type { EpisodeSummary } from "@/features/characters/types/character";
import { ArrowRightIcon } from "@/shared/icons";
import styles from "./character-episode-list.module.css";

type CharacterEpisodeListProps = {
  episodes: EpisodeSummary[];
};

export function CharacterEpisodeList({
  episodes,
}: CharacterEpisodeListProps) {
  return (
    <ul className={styles.list}>
      {episodes.map((episode) => (
        <li key={episode.id} className={styles.item}>
          <div>
            <p className={styles.code}>{episode.code}</p>
            <h3 className={styles.name}>{episode.name}</h3>
            <p className={styles.airDate}>{episode.airDate}</p>
          </div>
          <span className={styles.icon}>
            <ArrowRightIcon />
          </span>
        </li>
      ))}
    </ul>
  );
}
