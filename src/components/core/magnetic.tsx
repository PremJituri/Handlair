import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, type SpringOptions } from "framer-motion";

type MagneticProps = {
  children: ReactNode;
  /** How far the element travels toward the pointer, as a fraction of the distance. */
  intensity?: number;
  rotation?: boolean;
  /** "global" reacts within `range` of the element, "parent" reacts inside the parent element. */
  actionArea?: "parent" | "global";
  range?: number;
  springOptions?: SpringOptions;
  className?: string;
};

const defaultSpring: SpringOptions = { stiffness: 150, damping: 15, mass: 0.1 };
const labelSpring: SpringOptions = { bounce: 0.1 };

function isWithin(clientX: number, clientY: number, rect: DOMRect) {
  return (
    clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
  );
}

export function Magnetic({
  children,
  intensity = 0.15,
  rotation = false,
  actionArea = "parent",
  range = 100,
  springOptions = defaultSpring,
  className = "inline-block",
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, springOptions);
  const ySpring = useSpring(y, springOptions);
  const rotate = useTransform(xSpring, [-100, 100], [-5, 5]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const reset = () => {
      x.set(0);
      y.set(0);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = node.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const active =
        actionArea === "global"
          ? Math.hypot(dx, dy) <= range
          : isWithin(
              event.clientX,
              event.clientY,
              node.parentElement?.getBoundingClientRect() ?? rect,
            );
      if (active) {
        x.set(dx * intensity);
        y.set(dy * intensity);
      } else {
        reset();
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", reset);
    document.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", reset);
      document.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [intensity, actionArea, range, x, y]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: xSpring, y: ySpring, rotate: rotation ? rotate : 0, willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}

/** Inner drift layer for a button's own label, so the text lags slightly behind the button. */
export function MagneticLabel({
  children,
  className = "inline-flex items-center gap-2",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Magnetic
      intensity={0.1}
      springOptions={labelSpring}
      actionArea="global"
      range={200}
      className={className}
    >
      {children}
    </Magnetic>
  );
}
