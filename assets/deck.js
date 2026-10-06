// Swipeable slide viewer. Markup:
//   <div class="deck" data-label="..."><div class="deck-track"><figure class="deck-slide"><img ...></figure>...</div></div>
// Add or remove <figure> elements to change the slides. Controls are added here.
document.querySelectorAll(".deck").forEach(function (deck) {
  var track = deck.querySelector(".deck-track");
  var slides = track.querySelectorAll(".deck-slide");
  var count = slides.length;
  var label = deck.dataset.label || "Slides";
  track.tabIndex = 0;
  track.setAttribute("role", "region");
  track.setAttribute("aria-roledescription", "carousel");
  track.setAttribute("aria-label", label + ". Use arrow keys or swipe to move between slides.");
  slides.forEach(function (s, i) { s.setAttribute("aria-label", "Slide " + (i + 1) + " of " + count); });

  var bar = document.createElement("div"); bar.className = "deck-bar";
  var dots = document.createElement("div"); dots.className = "deck-dots";
  for (var i = 0; i < count; i++) {
    var d = document.createElement("button");
    d.type = "button"; d.setAttribute("aria-label", "Go to slide " + (i + 1));
    d.dataset.i = i; dots.appendChild(d);
  }
  var btns = document.createElement("div"); btns.className = "deck-buttons";
  var prev = document.createElement("button"); prev.type = "button"; prev.setAttribute("aria-label", "Previous slide"); prev.textContent = "‹";
  var next = document.createElement("button"); next.type = "button"; next.setAttribute("aria-label", "Next slide"); next.textContent = "›";
  btns.append(prev, next); bar.append(dots, btns); deck.appendChild(bar);

  var idx = 0;
  function step() { return slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0); }
  function go(i) { i = Math.max(0, Math.min(count - 1, i)); track.scrollTo({ left: i * step() }); }
  function update() {
    idx = Math.round(track.scrollLeft / step());
    dots.querySelectorAll("button").forEach(function (b, i) { b.classList.toggle("on", i === idx); });
    prev.disabled = idx === 0; next.disabled = idx === count - 1;
  }
  prev.addEventListener("click", function () { go(idx - 1); });
  next.addEventListener("click", function () { go(idx + 1); });
  dots.addEventListener("click", function (e) { if (e.target.dataset.i) go(+e.target.dataset.i); });
  track.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); go(idx + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(idx - 1); }
  });
  var ticking = false;
  track.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(function () { update(); ticking = false; }); ticking = true; }
  });
  window.addEventListener("resize", update);
  update();
});

// Highlight the nav item for the project in view
(function () {
  var links = document.querySelectorAll(".nav a");
  var map = {};
  links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        links.forEach(function (a) { a.classList.remove("on"); a.removeAttribute("aria-current"); });
        var a = map[en.target.id];
        if (a) {
          a.classList.add("on"); a.setAttribute("aria-current", "true");
          // On phones the links are a horizontal row: keep the active one visible
          var nav = a.parentElement;
          if (nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: "smooth" });
        }
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll(".seg").forEach(function (s) { io.observe(s); });
})();
