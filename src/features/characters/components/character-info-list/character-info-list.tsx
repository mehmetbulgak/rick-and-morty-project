import { ArrowRightIcon } from "@/shared/icons";
import styles from "./character-info-list.module.css";

export type CharacterInfoItem = {
  label: string;
  value: string;
  withArrow?: boolean;
};

type CharacterInfoListProps = {
  items: CharacterInfoItem[];
};

export function CharacterInfoList({ items }: CharacterInfoListProps) {
  return (
    <dl className={styles.list}>
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <div>
            <dt className={styles.label}>{item.label}</dt>
            <dd className={styles.value}>{item.value}</dd>
          </div>
          {item.withArrow ? (
            <span className={styles.icon}>
              <ArrowRightIcon />
            </span>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
