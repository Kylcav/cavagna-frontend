import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import Script from "next/script"
import { Suspense } from "react"
import MetaPageView from "@modules/common/components/meta-page-view"
import "../styles/globals.css"

const META_PIXEL_ID = "27024824927171752"
const TIKTOK_PIXEL_ID = "D8PFD5RC77U1TIMDIU10"
const CONTENTSQUARE_TAG_URL = "https://t.contentsquare.net/uxa/0b8c7765f297d.js"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-mode="light">
      <head>
        <Script
          id="contentsquare-tag"
          src={CONTENTSQUARE_TAG_URL}
          strategy="beforeInteractive"
        />

        <Script id="matomo-config" strategy="beforeInteractive">
          {`
            window._paq = window._paq || [];
            window._paq.push(['setTrackerUrl', 'https://mizucat.matomo.cloud/matomo.php']);
            window._paq.push(['setSiteId', '1']);
            window._paq.push(['enableLinkTracking']);
            window._paq.push(['trackPageView']);
          `}
        </Script>

        <Script
          id="matomo-script"
          src="https://cdn.matomo.cloud/mizucat.matomo.cloud/matomo.js"
          strategy="beforeInteractive"
        />

        <Script id="meta-pixel" strategy="beforeInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '${META_PIXEL_ID}');
          `}
        </Script>

        <Script id="tiktok-pixel" strategy="beforeInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;
              var ttq=w[t]=w[t]||[];
              ttq.methods=[
                "page","track","identify","instances","debug","on","off",
                "once","ready","alias","group","enableCookie","disableCookie",
                "holdConsent","revokeConsent","grantConsent"
              ];
              ttq.setAndDefer=function(t,e){
                t[e]=function(){
                  t.push([e].concat(Array.prototype.slice.call(arguments,0)))
                }
              };
              for(var i=0;i<ttq.methods.length;i++){
                ttq.setAndDefer(ttq,ttq.methods[i])
              }
              ttq.instance=function(t){
                for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++){
                  ttq.setAndDefer(e,ttq.methods[n])
                }
                return e
              };
              ttq.load=function(e,n){
                var r="https://analytics.tiktok.com/i18n/pixel/events.js";
                ttq._i=ttq._i||{};
                ttq._i[e]=[];
                ttq._i[e]._u=r;
                ttq._t=ttq._t||{};
                ttq._t[e]=+new Date;
                ttq._o=ttq._o||{};
                ttq._o[e]=n||{};
                n=document.createElement("script");
                n.type="text/javascript";
                n.async=!0;
                n.src=r+"?sdkid="+e+"&lib="+t;
                e=document.getElementsByTagName("script")[0];
                e.parentNode.insertBefore(n,e)
              };

              ttq.load('${TIKTOK_PIXEL_ID}');
            }(window, document, 'ttq');
          `}
        </Script>
      </head>

      <body>
        <Suspense fallback={null}>
          <MetaPageView />
        </Suspense>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}