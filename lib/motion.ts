import type { Variants } from "framer-motion";

// IMPORTANT: The `hidden` variant matches the `visible` variant so SSR,
// headless screenshots, and no-JS browsers always render content.
// We keep the names so components compile; on-scroll animations become no-ops
// rather than hiding content. Re-enable non-zero hidden states only on
// interactive components (e.g. FAQ accordion) that do not block first paint.

export const fadeInUp: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 1, scale: 1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export const inViewConfig = { once: true, margin: "-80px" } as const;
