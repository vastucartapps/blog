"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AdSenseProps {
  slotId: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
}

export default function AdSenseSlot({ 
  slotId, 
  adFormat = 'auto' 
}: AdSenseProps) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.log('AdSense slot update caught safely:', err);
    }
  }, [pathname, slotId]);

  // Don't render if slot ID is placeholder
  if (slotId.startsWith('1234567')) {
    return (
      <div style={{ 
        display: 'block', 
        margin: '20px auto', 
        textAlign: 'center', 
        overflow: 'hidden',
        background: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <p style={{ color: '#666', fontSize: '12px' }}>
          Advertisement space (slot ID not configured)
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'block', margin: '20px auto', textAlign: 'center', overflow: 'hidden' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
