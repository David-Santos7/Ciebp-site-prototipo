document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('track');
  
  // 1. Validação de Segurança (Evita que o JS quebre se a seção não existir)
  if (!track) return; 

  const slides = Array.from(track.children);
  
  // Se não houver slides ou houver apenas 1, não há necessidade de carrossel
  if (slides.length <= 1) return;

  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');

  let index = 1;
  const slideWidth = 100; // Porcentagem do movimento
  
  // 2. Trava de Segurança (Resolve o bug do clique rápido)
  let isMoving = false; 

  // Clonagem para Loop Infinito
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  // Adiciona classes para facilitar debug no DevTools
  firstClone.classList.add('clone');
  lastClone.classList.add('clone');

  track.appendChild(firstClone);
  track.prepend(lastClone);

  // Ajuste inicial (ignora o clone prepended)
  track.style.transform = `translateX(-${index * slideWidth}%)`;

  function updateSlide() {
    track.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
    track.style.transform = `translateX(-${index * slideWidth}%)`;
  }

  // 3. O 'transitionend' agora destrava o carrossel e faz o reset
  track.addEventListener('transitionend', () => {
    isMoving = false; // Libera para o próximo clique

    if (index >= slides.length + 1) {
      track.style.transition = 'none'; // Tira a animação para pular instantaneamente
      index = 1;
      track.style.transform = `translateX(-${index * slideWidth}%)`;
    }
    
    if (index <= 0) {
      track.style.transition = 'none';
      index = slides.length;
      track.style.transform = `translateX(-${index * slideWidth}%)`;
    }
  });

  // Eventos de Clique (Protegidos pela variável isMoving)
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (isMoving) return; // Se estiver animando, ignora o clique
      isMoving = true;      // Trava o carrossel
      index++;
      updateSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (isMoving) return; // Se estiver animando, ignora o clique
      isMoving = true;      // Trava o carrossel
      index--;
      updateSlide();
    });
  }
});