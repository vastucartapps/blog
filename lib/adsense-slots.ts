/**
 * Google AdSense Slot Configuration
 * 
 * HOW TO GET YOUR SLOT IDS:
 * 1. Go to https://adsense.google.com
 * 2. Click "Ads" → "By placement" in the left menu
 * 3. Look for your ad units (you can create new ones if needed)
 * 4. Copy the number after "pub-" for each ad unit
 * 
 * EXAMPLE:
 * If your ad unit shows: ca-pub-1411902986257886/1234567890
 * Then your slot ID is: 1234567890
 * 
 * Replace the placeholder values below with your actual slot IDs
 */

export const AD_SLOTS = {
  // Blog article pages
  article_top: '1234567890',      // Top of article (728x90 leaderboard)
  article_middle: '1234567891',   // Middle of article (300x250 rectangle)
  article_bottom: '1234567892',   // Bottom of article (728x90 leaderboard)

  // Blog homepage
  homepage_top: '1234567893',      // Top of homepage (728x90)
  homepage_middle: '1234567894',   // Middle of homepage (300x250)

  // Blog category pages
  category_middle: '1234567895',   // Middle of category page (728x90)

  // Author pages
  author_middle: '1234567896',     // Middle of author page (300x250)
};

/**
 * Helper function to get the correct slot ID for a page
 * @param pageType - The type of page
 * @param position - Position on the page (top, middle, bottom)
 * @returns The slot ID for that page/position
 * 
 * USAGE EXAMPLE:
 * const slotId = getAdSlotId('article', 'middle');
 * <AdSenseSlot slotId={slotId} />
 */
export function getAdSlotId(
  pageType: 'article' | 'homepage' | 'category' | 'author',
  position: 'top' | 'middle' | 'bottom' = 'middle'
): string {
  const key = `${pageType}_${position}` as keyof typeof AD_SLOTS;
  return AD_SLOTS[key] || AD_SLOTS.article_middle;
}
