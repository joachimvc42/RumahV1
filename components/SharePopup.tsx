'use client';

import { useEffect, useState } from 'react';
import { getDict, type Locale } from '../lib/i18n';

type Props = {
  url: string;
  title: string;
  open: boolean;
  onClose: () => void;
  locale?: Locale;
};

export default function SharePopup({ url, title, open, onClose, locale = 'en' }: Props) {
  const [copied, setCopied] = useState(false);
  const t = getDict(locale).share;

  // Reset copied state on close
  useEffect(() => { if (!open) setCopied(false); }, [open]);

  // Lock body scroll while open + ESC to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);
  const encText = encodeURIComponent(`${title} — ${url}`);

  const channels: { key: string; label: string; icon: string; href: string; color: string }[] = [
    { key: 'whatsapp',  label: 'WhatsApp',  icon: '💬', color: '#25D366',
      href: `https://wa.me/?text=${encText}` },
    { key: 'telegram',  label: 'Telegram',  icon: '✈️', color: '#229ED9',
      href: `https://t.me/share/url?url=${encUrl}&text=${encTitle}` },
    { key: 'messenger', label: 'Messenger', icon: '💭', color: '#0084FF',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}` },
    { key: 'twitter',   label: 'X / Twitter', icon: '𝕏', color: '#000000',
      href: `https://twitter.com/intent/tweet?url=${encUrl}&text=${encTitle}` },
    { key: 'linkedin',  label: 'LinkedIn',  icon: '💼', color: '#0A66C2',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}` },
    { key: 'email',     label: 'Email',     icon: '✉️', color: '#6B7280',
      href: `mailto:?subject=${encTitle}&body=${encText}` },
    { key: 'sms',       label: 'SMS',       icon: '📱', color: '#10B981',
      href: `sms:?&body=${encText}` },
  ];

  const onCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t.copyPrompt, url);
    }
  };

  return (
    <div
      className="share-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
    >
      <div className="share-panel" onClick={e => e.stopPropagation()}>
        <button className="share-close" onClick={onClose} aria-label={t.close}>×</button>
        <h3 className="share-title">{t.title}</h3>
        <p className="share-subtitle">{title}</p>

        <div className="share-channels">
          {channels.map(c => (
            <a
              key={c.key}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="share-channel"
              onClick={onClose}
            >
              <span className="share-channel-icon" style={{ background: c.color }}>{c.icon}</span>
              <span className="share-channel-label">{c.label}</span>
            </a>
          ))}
        </div>

        <div className="share-copy-row">
          <input className="share-url" value={url} readOnly onClick={e => (e.target as HTMLInputElement).select()} />
          <button className="share-copy-btn" onClick={onCopy} type="button">
            {copied ? t.copied : t.copy}
          </button>
        </div>
      </div>
    </div>
  );
}
