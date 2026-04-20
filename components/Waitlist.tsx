"use client";

import { Widget } from "@typeform/embed-react";

export function Waitlist() {
  return (
    <section id="waitlist" className="waitlist">
      <div className="waitlist-inner">
        <h2>
          Step into the <i>shadow.</i>
        </h2>
        <p>
          Private, post-quantum beta opens Q3 2026. Limited to the first 10,000
          wallets.
        </p>
        <div className="waitlist-embed">
          <Widget
            id="iKtR4eeX"
            style={{ width: "100%", height: "520px" }}
            opacity={0}
            hideHeaders
            hideFooter
          />
        </div>
        <div className="waitlist-meta">
          <span>No wallet required</span>
          <span>·</span>
          <span>Unsubscribe anytime</span>
        </div>
      </div>
    </section>
  );
}
