/**
 * Shared site behavior: nav (mobile toggle + scroll shrink), scroll-reveal animations,
 * FAQ accordions, animated stat counters, and wiring buttons to SITE config.
 * No dependencies — vanilla JS only.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initYear();
    initNav();
    initReveal();
    initFaq();
    initCounters();
    wireConfigLinks();
  });

  function initYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  function initNav() {
    const navbar = document.querySelector(".navbar");
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");

    if (navbar) {
      const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      links.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => links.classList.remove("open"))
      );
    }

    // Mark the current page's nav link active.
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a[href]").forEach((a) => {
      const href = a.getAttribute("href").split("#")[0];
      if (href === path) a.classList.add("active");
    });
  }

  function initReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach((t) => t.classList.add("in-view"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((t) => io.observe(t));
  }

  function initFaq() {
    document.querySelectorAll(".faq-item").forEach((item) => {
      const q = item.querySelector(".faq-q");
      const a = item.querySelector(".faq-a");
      if (!q || !a) return;
      q.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        item.parentElement.querySelectorAll(".faq-item.open").forEach((other) => {
          if (other !== item) {
            other.classList.remove("open");
            other.querySelector(".faq-a").style.maxHeight = null;
          }
        });
        item.classList.toggle("open", !isOpen);
        a.style.maxHeight = !isOpen ? a.scrollHeight + "px" : null;
      });
    });
  }

  function initCounters() {
    const els = document.querySelectorAll("[data-count]");
    if (els.length === 0) return;
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = target * eased;
        el.textContent = (target % 1 === 0 ? Math.round(value) : value.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) {
      els.forEach(animate);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    els.forEach((el) => io.observe(el));
  }

  // Populate any [data-download], [data-buy-*], [data-support-*] elements from SITE config
  // so the real download URL / checkout links only ever need to change in one place.
  function wireConfigLinks() {
    if (typeof SITE === "undefined") return;

    document.querySelectorAll("[data-download]").forEach((el) => {
      el.setAttribute("href", SITE.product.downloadUrl);
    });
    document.querySelectorAll("[data-buy='yearly']").forEach((el) => el.setAttribute("href", SITE.checkout.proYearlyUrl));
    document.querySelectorAll("[data-bug-report]").forEach((el) => el.setAttribute("href", SITE.contact.bugReportUrl));
    document.querySelectorAll("[data-feature-request]").forEach((el) => el.setAttribute("href", SITE.contact.featureRequestUrl));
    document.querySelectorAll("[data-github]").forEach((el) => el.setAttribute("href", SITE.contact.githubUrl));
    document.querySelectorAll("[data-discord]").forEach((el) => el.setAttribute("href", SITE.contact.discordUrl));
    document.querySelectorAll("[data-support-email]").forEach((el) => {
      el.setAttribute("href", "mailto:" + SITE.contact.supportEmail);
      if (el.dataset.supportEmail === "text") el.textContent = SITE.contact.supportEmail;
    });
    document.querySelectorAll("[data-version]").forEach((el) => (el.textContent = SITE.product.version));
    document.querySelectorAll("[data-size]").forEach((el) => (el.textContent = SITE.product.sizeMb + " MB"));
    document.querySelectorAll("[data-price-yearly]").forEach((el) => {
      el.textContent = SITE.checkout.currencySymbol + SITE.checkout.priceYearly;
    });
  }
})();
