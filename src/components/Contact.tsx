import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Linkedin, Instagram, Video, ArrowUpRight, Send, Check } from 'lucide-react';

const SOCIALS = [
  { name: 'LinkedIn', icon: <Linkedin size={16} />, url: 'https://linkedin.com', color: '#0A66C2' },
  { name: 'ArtStation', icon: <Video size={16} />, url: 'https://artstation.com', color: '#13AFF0' },
  { name: 'Instagram', icon: <Instagram size={16} />, url: 'https://instagram.com', color: '#E4405F' },
  { name: 'Vimeo', icon: <Video size={16} />, url: 'https://vimeo.com', color: '#1AB7EA' },
];

// ─── CONTACT FORM ───────────────────────────────────────────────────────────
function ContactForm() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setFormState('sending');
    // Open mailto as fallback
    setTimeout(() => {
      const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
      window.open(`mailto:hailuong.vfx@gmail.com?subject=${subject}&body=${body}`, '_blank');
      setFormState('success');
    }, 600);
  };

  if (formState === 'success') {
    return (
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)' }}>
          <Check size={24} className="text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Message Sent</h3>
        <p className="text-white/50 text-sm">Thanks for reaching out. I'll get back to you soon.</p>
        <button
          onClick={() => { setFormState('idle'); setFormData({ name: '', email: '', message: '' }); }}
          className="mt-5 text-sm text-amber-400/70 hover:text-amber-400 transition-colors"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 sm:py-4 rounded-xl bg-white/[0.03] border text-white placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors"
          style={{ borderColor: errors.name ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)' }}
          aria-label="Your name"
          autoComplete="name"
        />
        {errors.name && <p className="text-red-400/80 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <input
          type="email"
          name="email"
          placeholder="your@email.com…"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 sm:py-4 rounded-xl bg-white/[0.03] border text-white placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors"
          style={{ borderColor: errors.email ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)' }}
          aria-label="Your email"
          autoComplete="email"
          spellCheck={false}
        />
        {errors.email && <p className="text-red-400/80 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <textarea
          name="message"
          placeholder="Tell me about your project…"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 sm:py-4 rounded-xl bg-white/[0.03] border text-white placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors resize-none"
          style={{ borderColor: errors.message ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)' }}
          aria-label="Your message"
          spellCheck={false}
        />
        {errors.message && <p className="text-red-400/80 text-xs mt-1">{errors.message}</p>}
      </div>
      <button
        type="submit"
        disabled={formState === 'sending'}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-60"
        style={{ background: 'rgba(232,164,0,0.12)', border: '1px solid rgba(232,164,0,0.25)' }}
      >
        <Send size={15} />
        <span>{formState === 'sending' ? 'Sending...' : 'Send Message'}</span>
      </button>
    </motion.form>
  );
}

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <footer id="contact" className="pt-20 md:pt-28 pb-8 overflow-hidden relative" aria-label="Contact section">
      <h2 id="contact-heading" className="sr-only">Get in Touch</h2>

      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(232,164,0,0.15) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10">
        {/* CTA Section */}
        <motion.div
          className="text-center px-6 mb-16 md:mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Label */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className="w-10 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, hsl(43 100% 46%))' }}
            />
            <span className="text-[10px] uppercase tracking-[0.35em] font-medium text-amber-400/70">
              Get in Touch
            </span>
            <div
              className="w-10 h-px"
              style={{ background: 'linear-gradient(90deg, hsl(43 100% 46%), transparent)' }}
            />
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            Let's Work Together
          </h2>

          <p className="max-w-md mx-auto mb-8 text-white/40 text-sm">
            Have a project in mind? Looking for a VFX artist to bring your vision to life?
          </p>

          {/* Primary CTA */}
          <motion.a
            href="mailto:hailuong.vfx@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-base rounded-full px-8 py-3.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            style={{
              background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
              color: 'hsl(0 0% 5%)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Mail size={17} />
            <span className="font-semibold">hailuong.vfx@gmail.com</span>
            <ArrowUpRight size={15} className="opacity-70" />
          </motion.a>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="px-6 mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ContactForm />
        </motion.div>

        {/* Footer */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div
            className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="p-2.5 rounded-lg transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  style={{
                    background: 'rgba(12, 12, 15, 0.5)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <span className="text-white/30 hover:text-white/60 transition-colors">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="flex items-center gap-2 text-xs text-white/20">
              <span>&copy; 2026 Hai Luong</span>
              <span className="text-white/10">·</span>
              <span>VFX Compositor</span>
            </div>

            {/* Available status */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px]"
              style={{
                background: 'rgba(12, 12, 15, 0.5)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.4)' }} />
              <span className="text-white/30">Available for projects</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
