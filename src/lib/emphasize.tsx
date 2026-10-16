import { Fragment, type ReactNode } from "react";

// Bolds brand name, capacities/figures and key engineering terms inside plain copy.
const pattern = /(HANDLAIR|[\d,.]+\s*(?:to\s*[\d,.]+\s*)?(?:cu\. mtr\/hr|mm\.wg|mm|micron|%)|dynamically balanced|vibration-free|pulse|Venturi scrubbers|spray scrubbers|oil-bath filters|cellulose fill media|needle-felt|two-stage fans)/gi;

export function emphasize(text: string): ReactNode {
  return text.split(pattern).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>,
  );
}
