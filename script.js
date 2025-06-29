document.addEventListener("DOMContentLoaded", () => {


  const logo = document.querySelector(".logo");
  if (logo && !logo.closest("a")) {
    const link = document.createElement("a");
    link.href = "/";
    link.appendChild(logo.cloneNode(true));
    logo.replaceWith(link);
  }

  // --- Анимация секций при прокрутке ---
  const sections = document.querySelectorAll(".section");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, {
    threshold: 0.1
  });

  sections.forEach(section => {
    observer.observe(section);
  });

  // --- Карусель с автопрокруткой ---
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let index = 0;
  let interval;

  function showSlide(n) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      dots[i].classList.remove("active");
    });
    slides[n].classList.add("active");
    dots[n].classList.add("active");
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  function startAutoSlide() {
    interval = setInterval(nextSlide, 7700);
  }

  function resetAutoSlide() {
    clearInterval(interval);
    startAutoSlide();
  }

  showSlide(index);
  startAutoSlide();

  document.querySelector(".next").addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });

  document.querySelector(".prev").addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
    resetAutoSlide();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      index = i;
      showSlide(index);
      resetAutoSlide();
    });
  });

  // --- Плавная прокрутка без # в адресе ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href').substring(1);
      const section = document.getElementById(targetId);

      if (section) {
        const targetOffset = section.offsetTop;
        const scrollSpeed = 700; // 💡 Настрой скорость здесь (в мс)

        const start = window.scrollY;
        const startTime = performance.now();

        function animateScroll(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / scrollSpeed, 1);
          const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

          window.scrollTo(0, start + (targetOffset - start - 20) * ease);

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        }

        requestAnimationFrame(animateScroll);
      }
    });
  });
});



// --- Мобильная оптимизация ---
function isMobile() {
  return window.innerWidth <= 768;
}

// Убираем стрелки на мобильных (если они не скрыты в CSS)
if (isMobile()) {
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  if (prevBtn) prevBtn.style.display = "none";
  if (nextBtn) nextBtn.style.display = "none";
}

// Добавляем свайп-контроль на мобильных
let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
  if (touchEndX < touchStartX - 50) {
    nextSlide();
    resetAutoSlide();
  }
  if (touchEndX > touchStartX + 50) {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
    resetAutoSlide();
  }
}

document.querySelector(".slides").addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.querySelector(".slides").addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleGesture();
});


/* === Свайпы для мобильных/тач-устройств === */
(() => {
  const wrapper = document.querySelector(".slides");
  if (!wrapper) return;            // защита, если элемент не найден

  let startX = 0;                  // точка начала касания
  let diffX  = 0;                  // смещение пальца

  // 1. Запоминаем, где пользователь коснулся экрана
  wrapper.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  // 2. Считаем смещение (нужно, чтобы игнорировать короткие «тычки»)
  wrapper.addEventListener("touchmove", (e) => {
    diffX = e.touches[0].clientX - startX;
  }, { passive: true });

  // 3. По окончании касания определяем жест
  wrapper.addEventListener("touchend", () => {
    const SWIPE_THRESHOLD = 50;    // минимальная длина свайпа (px)

    if (Math.abs(diffX) > SWIPE_THRESHOLD) {
      if (diffX < 0) {             // свайп влево  → следующий слайд
        nextSlide();
      } else {                     // свайп вправо → предыдущий слайд
        index = (index - 1 + slides.length) % slides.length;
        showSlide(index);
      }
      resetAutoSlide();            // перезапуск авто-прокрутки
    }

    // сбрасываем значения
    startX = diffX = 0;
  });
})();
