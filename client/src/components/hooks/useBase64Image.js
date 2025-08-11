import { useEffect, useState } from 'react';
export default function useBase64Image(src) {
  const [dataUrl, setDataUrl] = useState(null);
  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    fetch(src).then(r => r.blob()).then(b => {
      if (cancelled) return;
      const fr = new FileReader();
      fr.onloadend = () => !cancelled && setDataUrl(fr.result);
      fr.readAsDataURL(b);
    });
    return () => { cancelled = true; };
  }, [src]);
  return dataUrl;
}