document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileNav();
  initScrollAnimations();
  initGalleryFilter();
  initLightbox();
  initContactForm();
});

function initTheme() {
  const toggle = document.querySelector(".theme-toggle");
  const saved = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);

  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");

  if (!toggle || !navList) return;

  toggle.addEventListener("click", () => {
    navList.classList.toggle("open");
    toggle.classList.toggle("active");
  });

  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("open");
      toggle.classList.remove("active");
    });
  });
}

function initScrollAnimations() {
  const elements = document.querySelectorAll(".fade-in");

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
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
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
