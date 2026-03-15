import { cn } from "@/shared/lib/cn";
import styles from "./activity-spinner.module.css";

type ActivitySpinnerProps = {
  className?: string;
  size?: "sm" | "md";
};

export function ActivitySpinner({
  className,
  size = "md",
}: ActivitySpinnerProps) {
  return (
    <span
      className={cn(styles.spinner, styles[size], className)}
      aria-hidden="true"
    >
      <span className={styles.ring} />
      <span className={styles.ringSecondary} />
      <span className={styles.core} />
    </span>
  );
}
