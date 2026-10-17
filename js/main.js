/* Nora Beauty Lounge: shared behaviors (no dependencies) */
(function () {
  "use strict";

  /* Mobile nav toggle */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.getElementById("nav-drawer");
  function setHeaderHeight() {
    if (header) document.documentElement.style.setProperty("--header-h", header.clientHeight + "px");
  }
  function setMenu(open) {
    drawer.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
    if (open) setHeaderHeight();
  }
  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      setMenu(!drawer.classList.contains("open"));
    });
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024 && drawer.classList.contains("open")) setMenu(false);
    });
  }

  /* Sliding pill indicator for desktop links */
  var navList = document.querySelector(".nav-list");
  if (navList) {
    var pill = document.createElement("span");
    pill.className = "nav-pill";
    pill.setAttribute("aria-hidden", "true");
    navList.insertBefore(pill, navList.firstChild);
    var links = navList.querySelectorAll("a:not(.btn)");
    var moveTo = function (a) {
      if (!a) { pill.classList.remove("is-on"); return; }
      pill.style.left = a.offsetLeft + a.parentElement.offsetLeft + "px";
      pill.style.width = a.offsetWidth + "px";
      pill.classList.add("is-on");
    };
    var current = function () { return navList.querySelector('a[aria-current="page"]:not(.btn)'); };
    links.forEach(function (a) {
      a.addEventListener("mouseenter", function () { moveTo(a); });
      a.addEventListener("focus", function () { moveTo(a); });
    });
    navList.addEventListener("mouseleave", function () { moveTo(current()); });
    window.addEventListener("load", function () { moveTo(current()); });
    window.addEventListener("resize", function () { moveTo(current()); });
  }

  /* Header shadow on scroll */
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Scroll reveal (respects prefers-reduced-motion via CSS) */
  var revealed = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealed.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealed.forEach(function (el) { io.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* Mark current nav item */
  var here = location.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  document.querySelectorAll(".nav-list a, .nav-drawer a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (!href) return;
    var clean = href.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    if (clean !== "" && here.endsWith(clean)) a.setAttribute("aria-current", "page");
  });

  /* Demo form handler — replace action with real endpoint in production */
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".form-note");
      if (!note) {
        note = document.createElement("p");
        note.className = "form-note";
        note.setAttribute("role", "status");
        form.appendChild(note);
      }
      note.textContent = "Thank you — we received your request and will confirm by text or email within one business hour.";
      form.reset();
    });
  });
})();
