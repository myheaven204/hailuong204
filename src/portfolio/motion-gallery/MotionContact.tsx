import { useEffect, useRef, useState } from 'react';
import { EMAIL } from '../content';
import Icon from '../Icon';
import { GALLERY_PATH } from './data';

export default function MotionContact() {
  const [copyState, setCopyState] = useState('Copy email');
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timeout.current), []);
  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopyState('Copied'); }
    catch { setCopyState('Use the email link'); }
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopyState('Copy email'), 2500);
  };
  return <footer id="contact" className="mg-contact mg-shell">
    <div className="mg-section-label"><span>06 / A new frame starts here</span><span>Ho Chi Minh City, Vietnam</span></div>
    <h2 className="mg-display mg-contact-title" data-mg-reveal>LET’S MAKE<br /><span className="mg-outline">IT BELIEVABLE.</span></h2>
    <div className="mg-contact-action"><p>Have a project in mind?<br />Let’s talk about the image you need.</p><a className="mg-contact-email" href={'mailto:' + EMAIL}>{EMAIL}<Icon name="arrow" /></a><button className="mg-copy-email" onClick={() => void copy()}><Icon name={copyState === 'Copied' ? 'check' : 'copy'} /><span aria-live="polite">{copyState}</span></button></div>
    <div className="mg-footer-bottom"><span>© {new Date().getFullYear()} Hai Luong</span><nav aria-label="Footer navigation"><a href={GALLERY_PATH + '#work'}>Work</a><a href={GALLERY_PATH + '#about'}>About</a><a href={GALLERY_PATH + '#archive'}>Project archive</a></nav><span>VFX / Compositing & motion design</span><a href="#top" aria-label="Back to top"><Icon name="arrow" /></a></div>
  </footer>;
}
