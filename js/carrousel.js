document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('track');
  if (!track) return; 

  const slides = Array.from(track.children);
  if (slides.length <= 1) return;

  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');

  let index = 1;
  const slideWidth = 100; 
  let isMoving = false; 

  // Clonagem (Mantida do seu código)
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.prepend(lastClone);
  track.style.transform = `translateX(-${index * slideWidth}%)`;

  function updateSlide() {
    isMoving = true;
    track.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
    track.style.transform = `translateX(-${index * slideWidth}%)`;
  }

  // --- NOVA FUNÇÃO: AUTO PLAY ---
  let autoPlayInterval = setInterval(moveNext, 8000);

  function moveNext() {
    if (isMoving) return;
    index++;
    updateSlide();
  }

  function resetInterval() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(moveNext, 8000);
  }

  // Pausar ao passar o mouse (opcional, mas recomendado)
  track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  track.addEventListener('mouseleave', () => resetInterval());
  // ------------------------------

  track.addEventListener('transitionend', () => {
    isMoving = false; 
    if (index >= slides.length + 1) {
      track.style.transition = 'none';
      index = 1;
      track.style.transform = `translateX(-${index * slideWidth}%)`;
    }
    if (index <= 0) {
      track.style.transition = 'none';
      index = slides.length;
      track.style.transform = `translateX(-${index * slideWidth}%)`;
    }
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      moveNext();
      resetInterval(); // Reinicia o contador ao clicar manualmente
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (isMoving) return;
      index--;
      updateSlide();
      resetInterval();
    });
  }
});