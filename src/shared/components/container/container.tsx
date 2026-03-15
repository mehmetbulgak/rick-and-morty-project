import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import styles from "./container.module.css";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return <div className={cn(styles.container, className)}>{children}</div>;
}
