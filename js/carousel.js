function initCarousel(id) {
  const carousel = document.getElementById(id);
  if (!carousel || !carousel.firstElementChild) return;

  let scrollAmount = 0;
  const cardWidth = carousel.firstElementChild.offsetWidth;

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      scrollAmount += cardWidth;
      carousel.scrollTo({ left: scrollAmount, behavior: "smooth" });
    } else if (e.key === "ArrowLeft") {
      scrollAmount -= cardWidth;
      if (scrollAmount < 0) scrollAmount = 0;
      carousel.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  });
}