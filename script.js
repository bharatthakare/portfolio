// Small interactions for Bharat Thakare's portfolio
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const year = document.getElementById("year");
const contactForm = document.getElementById("contactForm");

function setTheme(theme) {
  const isLight = theme === "light";
  body.classList.toggle("light-mode", isLight);
  themeToggle.textContent = isLight ? "☾" : "☼";
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", isLight ? "#f5f2ee" : "#151312");
  try { localStorage.setItem("bharat-portfolio-theme", theme); } catch (_) {}
}
let savedTheme = "dark";
try { savedTheme = localStorage.getItem("bharat-portfolio-theme") || "dark"; } catch (_) {}
setTheme(savedTheme);
themeToggle.addEventListener("click", () => setTheme(body.classList.contains("light-mode") ? "dark" : "light"));

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
document.addEventListener("click", event => {
  if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

const sections = document.querySelectorAll("main section[id]");
const navItems = navLinks.querySelectorAll("a");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navItems.forEach(link => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-25% 0px -60% 0px" });
  sections.forEach(section => observer.observe(section));
}

if (year) year.textContent = new Date().getFullYear();

// This form opens an email draft; it does not send messages automatically.
contactForm.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const topic = String(data.get("topic") || "").trim();
  const message = String(data.get("message") || "").trim();
  const subject = encodeURIComponent(`${topic} — message from ${name}`);
  const bodyText = encodeURIComponent(`Hi Bharat,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`);
  window.location.href = `mailto:bharatthakare@zohomail.in?subject=${subject}&body=${bodyText}`;
});
