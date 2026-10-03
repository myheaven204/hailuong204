import { useState, type FormEvent } from 'react';
import Icon from './Icon';
import { EMAIL } from './content';

export default function Contact() {
  const [copyStatus, setCopyStatus] = useState('');
  const [draftStatus, setDraftStatus] = useState('');
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopyStatus('Email address copied.'); }
    catch { setCopyStatus('Copy is unavailable. You can select the email address or use the email link.'); }
  };
  const draftEnquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const brief = String(data.get('brief') ?? '').trim();
    if (!name || !email || !brief) { setDraftStatus('Please complete your name, email and project brief.'); return; }
    const body = 'Hi Hai,\n\n' + brief + '\n\n' + name + '\n' + email;
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Project enquiry — ' + name) + '&body=' + encodeURIComponent(body);
    setDraftStatus('Your email app has been requested. The message is not sent automatically. If no app opens, email me directly.');
  };
  return <>
    <section id="contact" className="contact-section section-shell" aria-labelledby="contact-title">
      <div className="contact-top"><span className="eyebrow"><span className="status-dot" /> Open to project enquiries</span><span className="eyebrow">Commercial / Music video / Film</span></div>
      <div className="contact-heading" data-reveal><h2 id="contact-title">The next<br />frame is yours.</h2><a href={'mailto:' + EMAIL} className="contact-orbit" aria-label="Email Hai Luong"><Icon name="arrow" width="45" height="45" /></a></div>
      <div className="contact-bottom"><div><a className="email-link" href={'mailto:' + EMAIL}>{EMAIL}</a><button className="copy-email" onClick={copyEmail} aria-label="Copy email address"><Icon name={copyStatus === 'Email address copied.' ? 'check' : 'copy'} /></button><p className="contact-note">Send a brief, a reference, or a shot you want to bring to life.</p><p className="form-status" role="status">{copyStatus}</p></div><div className="contact-location"><span className="eyebrow">Based in</span><p>Ho Chi Minh City, Vietnam</p></div></div>
      <details className="enquiry-details"><summary>Prefer to start with a brief? <Icon name="plus" /></summary><form className="enquiry-form" onSubmit={draftEnquiry}><div className="form-row"><label>Your name<input name="name" autoComplete="name" required maxLength={100} placeholder="Name / studio" /></label><label>Email address<input type="email" name="email" autoComplete="email" required maxLength={200} placeholder="you@studio.com" /></label></div><label>Project brief<textarea name="brief" required maxLength={2000} rows={4} placeholder="Tell me about the project, scope and timing…" /></label><div className="form-bottom"><p>Opens a draft in your email app. Nothing is sent through this website.</p><button className="button button-light" type="submit">Create email draft <Icon name="arrow" /></button></div><p role="status" className="form-status">{draftStatus}</p></form></details>
    </section>
    <footer className="site-footer section-shell"><a href="/" className="footer-brand">HAI LUONG<span>VFX / COMPOSITING</span></a><p>© {new Date().getFullYear()} Hai Luong. Project rights belong to their respective owners.</p><a className="text-link" href="#top">Back to top <Icon name="arrow" /></a></footer>
  </>;
}
