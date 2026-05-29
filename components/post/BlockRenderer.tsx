import type { ContentBlock, RelatedPostRef } from "@/lib/types";
import { getPostBySlug } from "@/lib/content";
import { resolveFeaturedImage } from "@/lib/post-images";
import {
  pillarStripLinks,
  crossCategoryBridgeCandidates,
} from "@/lib/internal-links";
import { autoLinkProseHtml } from "@/lib/auto-prose-linker";
import type { RelatedPostCard } from "./RelatedPosts";
import { NavStrip } from "./NavStrip";
import { ProseBlock } from "./ProseBlock";
import { TldrBlock } from "./TldrBlock";
import { GeoAnswer } from "./GeoAnswer";
import { ScannableProse } from "./ScannableProse";
import { PullQuote } from "./PullQuote";
import { StatStrip } from "./StatStrip";
import { InfoGrid } from "./InfoGrid";
import { EffectsGrid } from "./EffectsGrid";
import { KundaliVisual } from "./KundaliVisual";
import { DashaTable } from "./DashaTable";
import { GemstoneSection } from "./GemstoneSection";
import { RudrakshaSection } from "./RudrakshaSection";
import { YantraSection } from "./YantraSection";
import { StotraSection } from "./StotraSection";
import { FAQSection } from "./FAQSection";
import { AuthorCard } from "./AuthorCard";
import { InternalLinks } from "./InternalLinks";
import { RelatedPosts } from "./RelatedPosts";
import { CTABand } from "./CTABand";
import { CTAInline } from "./CTAInline";
import { Divider } from "@/components/ui/Divider";
// Per-category unique sections
import { TarotCardVisual } from "./TarotCardVisual";
import { SpreadPositions } from "./SpreadPositions";
import { NumerologyDisplay } from "./NumerologyDisplay";
import { CompatibilityGrid } from "./CompatibilityGrid";
import { VastuCompass } from "./VastuCompass";
import { MuhurtaTimeline } from "./MuhurtaTimeline";
import { PujaVidhi } from "./PujaVidhi";
import { SamagriList } from "./SamagriList";
import { WearingRitual } from "./WearingRitual";
import { ContraIndications } from "./ContraIndications";
import { ImageFigure } from "./ImageFigure";
import { AstroGlossary } from "./AstroGlossary";
import { Infographic } from "./Infographic";

interface Props {
  blocks: ContentBlock[];
  /** Category id used to apply theme colours to per-category components. */
  category?: string;
  /** Subcategory slug — required for the auto pillar-strip to resolve. */
  subcategory?: string;
  /** Post slug — used by image-figure blocks to resolve `public/posts/{slug}/{filename}` */
  slug?: string;
  /** Author slug — required for the auto pillar-strip to link the byline. */
  author_id?: string;
  /** Optional taxonomy keys used by cross-category bridges. */
  planet_id?: string;
  ruling_planet?: string;
  number?: number;
  lagna_id?: string;
}

export function BlockRenderer({
  blocks,
  category,
  subcategory,
  slug,
  author_id,
  planet_id,
  ruling_planet,
  number,
  lagna_id,
}: Props) {
  // Resolve the auto-injected nav-strip data once. The strip is
  // emitted server-side immediately before the related-posts block
  // (or, if none, at the end of the article) so every post — every
  // category, every terminal — receives the same enterprise outbound
  // link set without the JSON having to declare it.
  const pillars =
    category && subcategory && author_id
      ? pillarStripLinks({ category, subcategory, author_id })
      : [];
  const bridgeCandidates =
    category && subcategory
      ? crossCategoryBridgeCandidates({
          category,
          subcategory,
          planet_id,
          ruling_planet,
          number,
          lagna_id,
        })
      : [];
  const verifiedBridges = bridgeCandidates
    .filter((b) => {
      // Only keep bridges whose target post (or subcategory landing
      // for /gemstones/by-planet/...) actually exists. We probe via
      // getPostBySlug on the last path segment.
      const last = b.href.split("/").filter(Boolean).pop();
      if (!last) return false;
      // The /gemstones/by-planet/* listings are subcategory-style;
      // accept them unconditionally — the listing route resolves
      // to a real page even if no individual gemstone post exists yet.
      if (b.href.startsWith("/gemstones/by-planet/")) return true;
      return getPostBySlug(last) !== null;
    })
    .slice(0, 3);
  let navStripInjected = false;

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "prose":
            return (
              <ProseBlock
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                html={autoLinkProseHtml(block.html)}
              />
            );
          case "tldr":
            return (
              <TldrBlock
                key={i}
                label={block.label}
                html={autoLinkProseHtml(block.html)}
              />
            );
          case "geo-answer":
            return (
              <GeoAnswer
                key={i}
                question={block.question}
                answer_html={autoLinkProseHtml(block.answer_html)}
                elaboration_html={
                  block.elaboration_html
                    ? autoLinkProseHtml(block.elaboration_html)
                    : undefined
                }
              />
            );
          case "scannable-prose":
            return (
              <ScannableProse
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                lead_html={autoLinkProseHtml(block.lead_html)}
                subsections={block.subsections.map((s) => ({
                  ...s,
                  html: autoLinkProseHtml(s.html),
                }))}
              />
            );
          case "image-figure":
            return slug ? (
              <ImageFigure
                key={i}
                slug={slug}
                filename={block.filename}
                alt={block.alt}
                caption={block.caption}
                width={block.width}
                height={block.height}
                priority={block.priority}
                credit={block.credit}
              />
            ) : null;
          case "astro-glossary":
            return (
              <AstroGlossary
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                intro_html={block.intro_html}
                terms={block.terms}
              />
            );
          case "infographic":
            return (
              <Infographic
                key={i}
                illustration={block.illustration}
                alt={block.alt}
                caption={block.caption}
                eyebrow={block.eyebrow}
                heading={block.heading}
              />
            );
          case "pull-quote":
            return <PullQuote key={i} text={block.text} variant={block.variant} />;
          case "stat-strip":
            return <StatStrip key={i} cells={block.cells} category={category} />;
          case "info-grid":
            return (
              <InfoGrid
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                cards={block.cards}
              />
            );
          case "effects-grid":
            return (
              <EffectsGrid
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                positive={block.positive}
                negative={block.negative}
                career={block.career}
                positive_label={block.positive_label}
                negative_label={block.negative_label}
                career_label={block.career_label}
              />
            );
          case "kundali-visual":
            return (
              <KundaliVisual
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                planet={block.planet}
                house={block.house}
                lagna={block.lagna}
                legend={block.legend}
                ctaLabel={block.cta_label}
                ctaUrl={block.cta_url}
              />
            );
          case "dasha-table":
            return (
              <DashaTable
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                introHtml={block.intro_html}
                rows={block.rows}
              />
            );
          case "gemstone":
            return (
              <GemstoneSection
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                introHtml={block.intro_html}
                cards={block.cards}
                disclaimer={block.disclaimer}
              />
            );
          case "rudraksha":
            return (
              <RudrakshaSection
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                introHtml={block.intro_html}
                beads={block.beads}
              />
            );
          case "yantra":
            return (
              <YantraSection
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                yantra={block.yantra}
              />
            );
          case "stotra":
            return (
              <StotraSection
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                stotra={block.stotra}
              />
            );
          case "faq":
            return (
              <FAQSection
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                items={block.items}
              />
            );
          case "author":
            return <AuthorCard key={i} author={block.author} />;
          case "internal-links":
            return (
              <InternalLinks
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                data={block.data}
              />
            );
          case "related-posts": {
            // Resolve each related post's featured image server-side
            // so the cards render the actual hero, not a placeholder
            // medallion. Falls back to icon-medallion when the linked
            // post or its image cannot be located on disk.
            const enrichedPosts: RelatedPostCard[] = block.posts.map(
              (p: RelatedPostRef) => {
                const slug = p.href.split("/").filter(Boolean).pop() ?? "";
                const linkedPost = getPostBySlug(slug);
                const image = linkedPost
                  ? resolveFeaturedImage(linkedPost)
                  : null;
                return { ...p, image };
              },
            );
            navStripInjected = true;
            return (
              <div key={i}>
                <NavStrip pillars={pillars} bridges={verifiedBridges} />
                <RelatedPosts
                  eyebrow={block.eyebrow}
                  heading={block.heading}
                  posts={enrichedPosts}
                />
              </div>
            );
          }
          case "cta-band":
            return <CTABand key={i} data={block.data} />;
          case "cta-inline":
            return <CTAInline key={i} data={block.data} />;
          case "divider":
            return <Divider key={i} gem={block.gem} category={category} />;
          // ── Per-category unique sections
          case "tarot-card-visual":
            return (
              <TarotCardVisual
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                data={block.data}
                category={category}
              />
            );
          case "spread-positions":
            return (
              <SpreadPositions
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                positions={block.positions}
                category={category}
              />
            );
          case "numerology-display":
            return (
              <NumerologyDisplay
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                data={block.data}
                category={category}
              />
            );
          case "compatibility-grid":
            return (
              <CompatibilityGrid
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                number={block.number}
                compatibilities={block.compatibilities}
                category={category}
              />
            );
          case "vastu-compass":
            return (
              <VastuCompass
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                highlight_direction={block.highlight_direction}
                zones={block.zones}
                category={category}
              />
            );
          case "muhurta-timeline":
            return (
              <MuhurtaTimeline
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                festival_key={block.festival_key}
                category={category}
              />
            );
          case "puja-vidhi":
            return (
              <PujaVidhi
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                steps={block.steps}
                category={category}
              />
            );
          case "samagri-list":
            return (
              <SamagriList
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                items={block.items}
                shop_label={block.shop_label}
                shop_url={block.shop_url}
                category={category}
              />
            );
          case "wearing-ritual":
            return (
              <WearingRitual
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                steps={block.steps}
                category={category}
              />
            );
          case "contra-indications":
            return (
              <ContraIndications
                key={i}
                eyebrow={block.eyebrow}
                heading={block.heading}
                do_not_wear={block.do_not_wear}
              />
            );
          default:
            return null;
        }
      })}
      {/* Fallback enterprise nav-strip — guaranteed even on posts
          that don't ship a related-posts block. */}
      {!navStripInjected && (pillars.length > 0 || verifiedBridges.length > 0) ? (
        <NavStrip pillars={pillars} bridges={verifiedBridges} />
      ) : null}
    </>
  );
}
