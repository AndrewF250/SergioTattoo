document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileNav();
  initHeaderScroll();
  initScrollAnimations();
  initStaggerGroups();
  initGalleryFilter();
  initLightbox();
  initContactForm();
  initParallax();
});

function initTheme() {
  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);

  document.querySelectorAll(".theme-switch").forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
      localStorage.setItem("theme", next);
    });
  });
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;

  document.querySelectorAll(".theme-switch").forEach((btn) => {
    const isDark = theme === "dark";
    btn.setAttribute("aria-checked", isDark ? "true" : "false");
    btn.classList.toggle("is-dark", isDark);

    const label = btn.querySelector(".theme-switch-text");
    if (label) {
      label.textContent = isDark ? "Тёмная" : "Светлая";
    }
  });
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  const header = document.querySelector(".site-header");

  if (!toggle || !navList) return;

  const closeNav = () => {
    navList.classList.remove("open");
    toggle.classList.remove("active");
    document.body.classList.remove("nav-open");
  };

  toggle.addEventListener("click", () => {
    const open = navList.classList.toggle("open");
    toggle.classList.toggle("active", open);
    document.body.classList.toggle("nav-open", open);
  });

  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeNav();
  });

  if (header) {
    document.addEventListener("click", (e) => {
      if (!navList.classList.contains("open")) return;
      if (header.contains(e.target)) return;
      closeNav();
    });
  }
}

function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initScrollAnimations() {
  const elements = document.querySelectorAll(".fade-in, .reveal");

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

function initStaggerGroups() {
  const groups = document.querySelectorAll("[data-stagger]");
  if (!groups.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        Array.from(entry.target.children).forEach((child, index) => {
          child.style.setProperty("--stagger", `${index * 0.08}s`);
          child.classList.add("stagger-item", "visible");
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  groups.forEach((group) => observer.observe(group));
}

function initGalleryFilter() {
  const tabs = document.querySelectorAll(".filter-tab");
  const items = document.querySelectorAll("[data-category]");

  if (!tabs.length || !items.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter;

      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      items.forEach((item, index) => {
        const categories = item.dataset.category.split(" ");
        const show = filter === "all" || categories.includes(filter);
        item.style.display = show ? "" : "none";
        if (show) {
          item.classList.remove("filter-in");
          requestAnimationFrame(() => {
            item.classList.add("filter-in");
            item.style.setProperty("--stagger", `${(index % 6) * 0.05}s`);
          });
        }
      });
    });
  });
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const img = trigger.querySelector("img");
      if (!img) return;

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = trigger.dataset.caption || img.alt;
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  const close = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  };

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value || "";
    const phone = form.querySelector('[name="phone"]')?.value || "";
    const service = form.querySelector('[name="service"]')?.value || "";
    const message = form.querySelector('[name="message"]')?.value || "";

    const text = encodeURIComponent(
      `Здравствуйте! Меня зовут ${name}.\n` +
        `Телефон: ${phone}\n` +
        `Услуга: ${service}\n\n` +
        `${message}`
    );

    window.open(`https://t.me/sergio_fom_tattoos?text=${text}`, "_blank");
  });
}

function initParallax() {
  const heroBg = document.querySelector(".hero-bg img");
  if (!heroBg || window.matchMedia("(max-width: 768px)").matches) return;

  window.addEventListener(
    "scroll",
    () => {
      const offset = window.scrollY * 0.18;
      heroBg.style.transform = `scale(1.08) translateY(${offset}px)`;
    },
    { passive: true }
  );
}
