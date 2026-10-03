import { useId } from 'react';

export default function ScrollSeal() {
  const pathId = 'mg-scroll-seal-' + useId().replace(/:/g, '');
  return <a className="mg-scroll-seal" href="#breakdowns" aria-label="Scroll to compositing breakdowns" data-mg-cursor="KEEP SCROLLING ↘">
    <span data-mg-scroll-seal>
      <svg viewBox="0 0 160 160" aria-hidden="true">
        <circle cx="80" cy="80" r="79" fill="#91a5f4" />
        <defs><path id={pathId} d="M 80 21 a 59 59 0 1 1 0 118 a 59 59 0 1 1 0 -118" /></defs>
        <text fill="#080a0d" fontSize="21.5" fontWeight="900" textLength="365" lengthAdjust="spacing"><textPath href={'#' + pathId}>THIS IS HOW WE SCROLL • </textPath></text>
        <g transform="rotate(-28 80 80)" stroke="#080a0d" strokeWidth="2.8" fill="none">
          <circle cx="80" cy="80" r="24" /><ellipse cx="80" cy="80" rx="10" ry="24" /><ellipse cx="80" cy="80" rx="24" ry="10" />
        </g>
      </svg>
    </span>
  </a>;
}
