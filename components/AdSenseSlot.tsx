"use client";

import { useEffect } from 'react';

interface AdSenseProps {
  slotId: string;
}

export default function AdSenseSlot({ slotId }: AdSenseProps) {
  useEffect(() => {
    try {
      // Safely push to the AdSense queue
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense display error:', err);
    }
  }, []);

  return (
    <div style={{ display: 'block', textAlign: 'center', margin: '20px 0', overflow: 'hidden' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1411902986257886"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}