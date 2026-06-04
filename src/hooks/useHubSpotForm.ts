import { useEffect, useRef, useState } from 'react';

const SCRIPT_ID = 'hs-embed-245452949';
const SCRIPT_SRC = 'https://js-na2.hsforms.net/forms/embed/245452949.js';

export function useHubSpotForm(open: boolean) {
  const [loaded, setLoaded] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement('script');
      s.id = SCRIPT_ID;
      s.src = SCRIPT_SRC;
      s.defer = true;
      document.head.appendChild(s);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const container = formRef.current;
    if (!container) return;

    setLoaded(false);

    const fallback = setTimeout(() => setLoaded(true), 7000);

    const handleIframe = (iframe: HTMLIFrameElement) => {
      observer.disconnect();
      clearTimeout(fallback);
      if (iframe.contentDocument?.readyState === 'complete') {
        setLoaded(true);
      } else {
        iframe.addEventListener('load', () => setLoaded(true), { once: true });
      }
    };

    const observer = new MutationObserver(() => {
      const iframe = container.querySelector('iframe');
      if (!iframe) return;
      handleIframe(iframe as HTMLIFrameElement);
    });

    observer.observe(container, { childList: true, subtree: true });

    const existing = container.querySelector('iframe');
    if (existing) handleIframe(existing as HTMLIFrameElement);

    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, [open]);

  return { loaded, formRef };
}
