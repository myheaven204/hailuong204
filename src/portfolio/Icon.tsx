import type { SVGProps } from 'react';

type IconName = 'arrow' | 'down' | 'play' | 'close' | 'plus' | 'menu' | 'copy' | 'check' | 'search' | 'left' | 'right';
const paths: Record<Exclude<IconName, 'play'>, string> = {
  arrow: 'M5 19 19 5M5 5h14v14', down: 'M12 4v16m-7-7 7 7 7-7', close: 'm6 6 12 12M6 18 18 6',
  plus: 'M12 5v14M5 12h14', menu: 'M4 8h16M4 16h16', copy: 'M9 9h11v11H9zM15 9V4H4v11h5',
  check: 'm5 12 4 4L19 6', search: 'm16 16 5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  left: 'm15 5-7 7 7 7', right: 'm9 5 7 7-7 7',
};
export default function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {name === 'play' ? <path d="m9 5 11 7-11 7Z" fill="currentColor" stroke="none" /> : <path d={paths[name]} />}
  </svg>;
}
