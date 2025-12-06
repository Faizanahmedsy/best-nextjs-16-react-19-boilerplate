import * as React from "react";

import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * If true, the component will be rendered as a `Slot`, which merges its props
   * onto its immediate child. This is useful for applying the visually hidden
   * styles to an existing element (e.g., `<h1>`) without adding an extra DOM node.
   * @default false
   */
  asChild?: boolean;
}

/**
 * ♿ **Visually Hidden Component**
 *
 * A React component to visually hide content while keeping it accessible to screen readers.
 * It's a foundational utility for building inclusive UIs.
 *
 * @architecture
 * **Why use a component instead of Tailwind's `sr-only` class?**
 *
 * While Tailwind's `sr-only` class is functionally identical, using a dedicated
 * `<VisuallyHidden>` component offers several architectural advantages:
 *
 * 1.  **Semantic Intent:** It signals that hiding content is an intentional accessibility
 *     feature, not just a style. It's self-documenting.
 * 2.  **Maintainability:** The specific CSS implementation is abstracted away. If accessibility
 *     best practices evolve, we only need to update this single component.
 * 3.  **Flexibility:** The `asChild` prop allows us to apply these styles to complex
 *     child elements without adding extra wrapper `<span>` nodes, keeping the DOM clean.
 *
 * @example
 * // Hiding a simple text
 * <VisuallyHidden>This text is only for screen readers.</VisuallyHidden>
 *
 * @example
 * // Hiding a heading without adding a span
 * <VisuallyHidden asChild>
 *   <h1>Main Page Title</h1>
 * </VisuallyHidden>
 */
const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref}
        className={cn(
          "absolute -m-px h-px w-px overflow-hidden border-0 p-0 whitespace-nowrap [clip:rect(0,0,0,0)]",
          className
        )}
        {...props}
      />
    );
  }
);

VisuallyHidden.displayName = "VisuallyHidden";

export { VisuallyHidden };
