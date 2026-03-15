"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ActivitySpinner } from "@/shared/components/activity-spinner/activity-spinner";
import styles from "./load-more-button.module.css";

type LoadMoreButtonProps = {
  href?: string;
  isLoading?: boolean;
  errorMessage?: string | null;
};

export function LoadMoreButton({
  href,
  isLoading = false,
  errorMessage = null,
}: LoadMoreButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!href) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        disabled={isPending || isLoading}
        onClick={() => {
          startTransition(() => {
            router.replace(href, { scroll: false });
          });
        }}
      >
        <span className={styles.content}>
          {isPending || isLoading ? <ActivitySpinner size="sm" /> : null}
          <span>{isPending || isLoading ? "Loading..." : "Load More"}</span>
        </span>
      </button>
      {errorMessage ? (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
