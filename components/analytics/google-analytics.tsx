import {
  GA_COOKIE_DOMAIN,
  GA_DEBUG,
  GA_DEFAULT_CONSENT_REGIONS,
  GA_MEASUREMENT_ID,
} from "@/lib/analytics/config";

function buildInitScript(): string {
  const regions = JSON.stringify(GA_DEFAULT_CONSENT_REGIONS);
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','analytics_storage':'denied','functionality_storage':'granted','personalization_storage':'denied','security_storage':'granted','wait_for_update':500,'region':${regions}});
gtag('consent','default',{'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','analytics_storage':'granted','functionality_storage':'granted','personalization_storage':'denied','security_storage':'granted'});
gtag('set','developer_id.dMDU2Yj',true);
gtag('js',new Date());
gtag('config','${GA_MEASUREMENT_ID}',{'anonymize_ip':true,'send_page_view':true,'transport_type':'beacon','cookie_flags':'SameSite=None;Secure','cookie_domain':'${GA_COOKIE_DOMAIN}'${GA_DEBUG ? ",'debug_mode':true" : ""}});`;
}

export function GoogleAnalytics() {
  return (
    <>
      <link
        rel="preconnect"
        href="https://www.googletagmanager.com"
        crossOrigin=""
      />
      <link
        rel="preconnect"
        href="https://www.google-analytics.com"
        crossOrigin=""
      />
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        id="ga-init"
        dangerouslySetInnerHTML={{ __html: buildInitScript() }}
      />
    </>
  );
}
