document.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined") {
    lucide.createIcons({
      attrs: {
        "stroke-width": 1.5,
        fill: "none",
      },
    });
  }
  initMobileNav();
  initHeaderScroll();
  initScrollAnimations();
  initStaggerGroups();
  initGalleryFilter();
  initLightbox();
  initContactForm();
});

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const drawer = document.querySelector(".nav-drawer");
  if (!toggle || !drawer) return;

  const closeNav = () => {
    drawer.classList.remove("open");
    toggle.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("nav-open");
  };

  toggle.addEventListener("click", () => {
    const open = drawer.classList.toggle("open");
    toggle.classList.toggle("active", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("nav-open", open);
  });

  drawer.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });
  window.addEventListener("resize", () => { if (window.innerWidth > 768) closeNav(); });
}

function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
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
    { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
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
          child.style.setProperty("--stagger", `${index * 0.06}s`);
          child.classList.add("stagger-item", "visible");
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
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

      items.forEach((item) => {
        const categories = item.dataset.category.split(" ");
        const show = filter === "all" || categories.includes(filter);
        item.style.display = show ? "" : "none";
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
      if (lightboxCaption) lightboxCaption.textContent = trigger.dataset.caption || img.alt;
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  const close = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  };

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
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
      `Здравствуйте! Меня зовут ${name}.\nТелефон: ${phone}\nУслуга: ${service}\n\n${message}`
    );
    window.open(`https://t.me/sergio_fom_tattoos?text=${text}`, "_blank");
  });
}
