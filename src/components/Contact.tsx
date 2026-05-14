import { useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mail, Linkedin, Instagram, Video, ArrowUpRight, Send, Check } from 'lucide-react';
import { easings } from '../hooks/useAnimationSystem';

const SOCIALS = [
  { name: 'LinkedIn', icon: <Linkedin size={16} />, url: 'https://linkedin.com', color: '#0A66C2' },
  { name: 'ArtStation', icon: <Video size={16} />, url: 'https://artstation.com', color: '#13AFF0' },
  { name: 'Instagram', icon: <Instagram size={16} />, url: 'https://instagram.com', color: '#E4405F' },
  { name: 'Vimeo', icon: <Video size={16} />, url: 'https://vimeo.com', color: '#1AB7EA' },
];

// Animated input field component
function AnimatedInput({ 
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  error,
  label,
  autoComplete,
  required,
}: {
  type?: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  label: string;
  autoComplete?: string;
  required?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating label */}
      <motion.label
        className="absolute left-4 pointer-events-none text-sm transition-all duration-200"
        animate={{
          top: isFocused || value ? '8px' : '50%',
          translateY: isFocused || value ? '0' : '-50%',
          scale: isFocused || value ? 0.75 : 1,
          color: error 
            ? 'rgba(239, 68, 68, 0.8)' 
            : isFocused 
              ? 'rgba(232, 164, 0, 0.8)' 
              : 'rgba(255, 255, 255, 0.4)',
        }}
        style={{ originX: 0, originY: 0 }}
        transition={{ duration: 0.2, ease: easings.easeOut }}
      >
        {label}
        {required && <span className="text-amber-400 ml-0.5">*</span>}
      </motion.label>

      <input
        ref={inputRef}
        type={type}
        name={name}
        placeholder={isFocused ? placeholder : ''}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full px-4 pt-6 pb-2 rounded-xl bg-white/[0.03] text-white focus:outline-none transition-colors"
        style={{ 
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: error 
            ? 'rgba(239, 68, 68, 0.5)' 
            : isFocused 
              ? 'rgba(232, 164, 0, 0.4)' 
              : 'rgba(255, 255, 255, 0.08)',
        }}
        aria-label={label}
        autoComplete={autoComplete}
        required={required}
      />

      {/* Focus indicator line */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 rounded-full"
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: isFocused ? '100%' : error ? '100%' : 0,
          opacity: isFocused || error ? 1 : 0,
          backgroundColor: error ? '#ef4444' : 'hsl(43 100% 46%)',
        }}
        transition={{ duration: 0.3 }}
        style={{ left: '0' }}
      />

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-400/80 text-xs mt-1 pl-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Animated textarea component
function AnimatedTextarea({
  name,
  placeholder,
  value,
  onChange,
  error,
  label,
  rows = 4,
  required,
}: {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  label: string;
  rows?: number;
  required?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Floating label */}
      <motion.label
        className="absolute left-4 pointer-events-none text-sm transition-all duration-200"
        animate={{
          top: isFocused || value ? '10px' : '16px',
          translateY: 0,
          scale: isFocused || value ? 0.75 : 1,
          color: error 
            ? 'rgba(239, 68, 68, 0.8)' 
            : isFocused 
              ? 'rgba(232, 164, 0, 0.8)' 
              : 'rgba(255, 255, 255, 0.4)',
        }}
        style={{ originX: 0, originY: 0 }}
        transition={{ duration: 0.2, ease: easings.easeOut }}
      >
        {label}
        {required && <span className="text-amber-400 ml-0.5">*</span>}
      </motion.label>

      <textarea
        ref={textareaRef}
        name={name}
        placeholder={isFocused ? placeholder : ''}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        rows={rows}
        className="w-full px-4 pt-8 pb-2 rounded-xl bg-white/[0.03] text-white focus:outline-none transition-colors resize-none"
        style={{ 
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: error 
            ? 'rgba(239, 68, 68, 0.5)' 
            : isFocused 
              ? 'rgba(232, 164, 0, 0.4)' 
              : 'rgba(255, 255, 255, 0.08)',
        }}
        aria-label={label}
        required={required}
        spellCheck={false}
      />

      {/* Focus indicator */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 rounded-full"
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: isFocused ? '100%' : error ? '100%' : 0,
          opacity: isFocused || error ? 1 : 0,
          backgroundColor: error ? '#ef4444' : 'hsl(43 100% 46%)',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-400/80 text-xs mt-1 pl-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

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
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: easings.backOut }}
      >
        <motion.div
          className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
          style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)' }}
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Check size={24} className="text-emerald-400" />
          </motion.div>
        </motion.div>
        <motion.h3 
          className="text-lg font-semibold text-white mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Message Sent
        </motion.h3>
        <motion.p 
          className="text-white/50 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Thanks for reaching out. I&apos;ll get back to you soon.
        </motion.p>
        <motion.button
          onClick={() => { setFormState('idle'); setFormData({ name: '', email: '', message: '' }); }}
          className="mt-5 text-sm text-amber-400/70 hover:text-amber-400 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send another message
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Name field */}
      <AnimatedInput
        type="text"
        name="name"
        label="Your name"
        placeholder="John Doe"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        autoComplete="name"
        required
      />

      {/* Email field */}
      <AnimatedInput
        type="email"
        name="email"
        label="Email address"
        placeholder="john@example.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        autoComplete="email"
        required
      />

      {/* Message field */}
      <AnimatedTextarea
        name="message"
        label="Your message"
        placeholder="Tell me about your project..."
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        error={errors.message}
        required
      />

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={formState === 'sending'}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-white transition-all disabled:opacity-60 relative overflow-hidden"
        style={{ 
          background: 'rgba(232,164,0,0.12)', 
          border: '1px solid rgba(232,164,0,0.25)' 
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        {/* Button shine effect */}
        <motion.div
          className="absolute inset-0"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          }}
        />
        
        <motion.span
          animate={formState === 'sending' ? { rotate: 360 } : { rotate: 0 }}
          transition={formState === 'sending' ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
        >
          <Send size={15} />
        </motion.span>
        <span className="relative">
          {formState === 'sending' ? 'Sending…' : 'Send Message'}
        </span>
      </motion.button>
    </motion.form>
  );
}

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <footer 
      id="contact" 
      className="pt-20 md:pt-28 pb-8 overflow-hidden relative" 
      aria-label="Contact section"
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(232,164,0,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Animated decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full pointer-events-none"
        animate={shouldReduceMotion ? {} : {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          background: 'radial-gradient(circle, rgba(232,164,0,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <motion.div
        className="absolute bottom-40 right-20 w-48 h-48 rounded-full pointer-events-none"
        animate={shouldReduceMotion ? {} : {
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        style={{
          background: 'radial-gradient(circle, rgba(232,164,0,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
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
          <motion.div 
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-10 h-px"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ background: 'linear-gradient(90deg, transparent, hsl(43 100% 46%))' }}
            />
            <motion.span 
              className="text-[10px] uppercase tracking-[0.35em] font-medium text-amber-400/70"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Get in Touch
            </motion.span>
            <motion.div
              className="w-10 h-px"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ background: 'linear-gradient(90deg, hsl(43 100% 46%), transparent)' }}
            />
          </motion.div>

          {/* Headline */}
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Let&apos;s Work Together
          </motion.h2>

          <motion.p
            className="max-w-md mx-auto mb-8 text-white/40 text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Have a project in mind? Looking for a VFX artist to bring your vision to life?
          </motion.p>

          {/* Primary CTA */}
          <motion.a
            href="mailto:hailuong.vfx@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-base rounded-full px-8 py-3.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5, ease: easings.backOut }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
              color: 'hsl(0 0% 5%)',
            }}
          >
            {/* Icon with hover animation */}
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: 0 }}
              whileHover={{ rotate: 0 }}
            >
              <Mail size={17} />
            </motion.span>
            <span className="font-semibold">hailuong.vfx@gmail.com</span>
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="opacity-70"
            >
              <ArrowUpRight size={15} />
            </motion.span>
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
          <motion.div
            className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {/* Social icons */}
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {SOCIALS.map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="p-2.5 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'rgba(12, 12, 15, 0.5)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <motion.span
                    className="text-white/30"
                    whileHover={{ color: social.color }}
                    transition={{ duration: 0.2 }}
                  >
                    {social.icon}
                  </motion.span>
                </motion.a>
              ))}
            </motion.div>

            {/* Copyright */}
            <motion.div 
              className="flex items-center gap-2 text-xs text-white/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <span>&copy; 2026 Hai Luong</span>
              <span className="text-white/10">·</span>
              <span>VFX Compositor</span>
            </motion.div>

            {/* Available status */}
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px]"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              style={{
                background: 'rgba(12, 12, 15, 0.5)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <motion.span 
                className="w-1.5 h-1.5 rounded-full bg-emerald-400" 
                animate={{ 
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    '0 0 6px rgba(52,211,153,0.4)',
                    '0 0 12px rgba(52,211,153,0.6)',
                    '0 0 6px rgba(52,211,153,0.4)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-white/30">Available for projects</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
