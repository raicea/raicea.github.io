/**
 * Central site config — the one file that should need edits when wiring up real
 * infrastructure later (CDN download URL, license/checkout backend, etc.) instead of
 * touching markup across every page.
 */
const SITE = {
  brand: "PCSoftware",

  product: {
    name: "PcCleaner",
    version: "1.1.1",
    releaseDate: "2026-07-19",
    // Swap for the real hosted installer URL (e.g. a GitHub Release asset or CDN link).
    downloadUrl: "https://github.com/raicea/PcCleaner/releases/latest/download/PcCleaner-Setup.exe",
    releaseNotesUrl: "downloads.html#release-notes",
    sizeMb: 145,
    requirements: {
      os: "Windows 10 64-bit (2004+) or Windows 11",
      cpu: "1 GHz dual-core or faster",
      ram: "4 GB minimum, 8 GB recommended",
      disk: "300 MB free space",
      other: "Administrator rights (required for hardware monitoring and system tweaks)"
    }
  },

  // Every "Buy Pro" button on the site reads from here, so switching providers/links is a
  // one-file change. Right now there's only one real Stripe product — a lifetime purchase —
  // so all three URLs point at the same Payment Link; the monthly/yearly toggle on pricing.html
  // is display-only until separate subscription Prices exist in Stripe.
  checkout: {
    provider: "stripe",
    currency: "EUR",
    currencySymbol: "€",
    priceMonthly: 2.99,
    priceYearly: 2.39, // ~20% off monthly, matches the "Save 20%" badge on pricing.html
    proMonthlyUrl: "https://buy.stripe.com/test_3cI7sN9924kbcQ44k9enS00",
    proYearlyUrl: "https://buy.stripe.com/test_3cI7sN9924kbcQ44k9enS00",
    proLifetimeUrl: "https://buy.stripe.com/test_3cI7sN9924kbcQ44k9enS00"
  },

  contact: {
    supportEmail: "support.raicea@gmail.com",
    // GitHub Issues cannot be used here: creating an issue always requires a signed-in GitHub
    // account, even on a fully public repo, so a "no account needed" bug-report/feature-request
    // button can never point at /issues/new. Plain mailto: works for every visitor, no account
    // of any kind required. (The public issue *list*, i.e. no "/new", is fine without login —
    // just not issue *creation*.)
    bugReportUrl: "mailto:support.raicea@gmail.com?subject=" + encodeURIComponent("Bug report — PcCleaner"),
    featureRequestUrl: "mailto:support.raicea@gmail.com?subject=" + encodeURIComponent("Feature request — PcCleaner"),
    githubUrl: "https://github.com/raicea/PcCleaner",
    // No Discord server exists yet — placeholder until one is created.
    discordUrl: "#"
  }
};
