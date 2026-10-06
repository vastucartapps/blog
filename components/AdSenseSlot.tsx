"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AdSenseProps {
  slotId?: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
}

export default function AdSenseSlot({ 
  slotId, 
  adFormat = 'auto',
  className = "my-6 text-center overflow-hidden"
}: AdSenseProps) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.log('AdSense slot update caught safely:', err);
    }
  }, [pathname, slotId]);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-1411902986257886";
  const isRealSlot = slotId && !slotId.startsWith('1234567');

  return (
    <div className={className} style={{ display: 'block', minHeight: '90px' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        {...(isRealSlot ? { 'data-ad-slot': slotId } : {})}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
