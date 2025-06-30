document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------
     0. Логотип → ссылка на главную
  ------------------------------------------------------------------ */
  const logo = document.querySelector('.logo');
  if (logo && !logo.closest('a')) {
    const a = document.createElement('a');
    a.href = '/';
    a.appendChild(logo.cloneNode(true));
    logo.replaceWith(a);
  }

  /* ------------------------------------------------------------------
     1. Анимация появления секций при прокрутке
  ------------------------------------------------------------------ */
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.1 }
  );
  sections.forEach((sec) => observer.observe(sec));

  /* ------------------------------------------------------------------
     2. Карусель
  ------------------------------------------------------------------ */
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  let index    = 0;
  let timer;

  const showSlide = (n) => {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === n);
      dots[i].classList.toggle('active', i === n);
    });
  };

  const nextSlide = () => {
    index = (index + 1) % slides.length;
    showSlide(index);
  };

  const startAuto = () => (timer = setInterval(nextSlide, 7700));
  const resetAuto = () => {
    clearInterval(timer);
    startAuto();
  };

  /* → запускаем карусель */
  showSlide(index);
  startAuto();

  /* стрелки */
  document.querySelector('.next').addEventListener('click', () => {
    nextSlide();
    resetAuto();
  });
  document.querySelector('.prev').addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
    resetAuto();
  });

  /* точки */
  dots.forEach((d, i) =>
    d.addEventListener('click', () => {
      index = i;
      showSlide(index);
      resetAuto();
    })
  );

  /* ------------------------------------------------------------------
     3. Плавная прокрутка без «#» в адресной строке
  ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((link) =>
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      const startY = window.scrollY;
      const endY   = target.offsetTop - 20;
      const dur    = 700;
      const t0     = performance.now();

      const animate = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3); // easeOutCubic
        window.scrollTo(0, startY + (endY - startY) * ease);
        if (p < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    })
  );

  /* ------------------------------------------------------------------
     4. Свайпы для мобильных / тач-экранов
  ------------------------------------------------------------------ */
  const swipeZone = document.querySelector('.slides');   // используем всю область слайдов
  if (swipeZone) {
    let startX = 0;
    let deltaX = 0;
    const TH = 50;                                      // длина жеста, px

    swipeZone.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    swipeZone.addEventListener('touchmove', (e) => {
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });

    swipeZone.addEventListener('touchend', () => {
      if (Math.abs(deltaX) > TH) {
        deltaX < 0 ? nextSlide() : (() => {               // влево / вправо
          index = (index - 1 + slides.length) % slides.length;
          showSlide(index);
        })();
        resetAuto();
      }
      startX = deltaX = 0;
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     5. Прячем стрелки на мобильных (можно заменить CSS-медиа-правилом)
  ------------------------------------------------------------------ */
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.prev, .next').forEach(el => el.style.display = 'none');
  }


  

  /* ------------------------------------------------------------------
     6. Лого-прилипалка
  ------------------------------------------------------------------ */

  (function () {
  const MOBILE_MAX = 768;
  if (window.innerWidth > MOBILE_MAX) return;      // только мобильные

  /* ── создаём панель с логотипом + бургер ──────────*/
  const logo = document.querySelector('.logo');
  if (!logo) return;

  const bar = document.createElement('div');
  bar.className = 'sticky-bar';
  bar.innerHTML = `
      <img src="${logo.getAttribute('src')}" alt="Логотип" />
      <div class="burger"><span></span><span></span><span></span></div>
  `;
  document.body.appendChild(bar);

  const burger = bar.querySelector('.burger');
  const nav    = document.querySelector('.navigation');
  const serviceTop = document.getElementById('service').offsetTop;

  /* 1. Показываем / скрываем панель при скролле */
  window.addEventListener('scroll', () => {
    bar.classList.toggle('sticky-bar--visible',
                         window.scrollY >= serviceTop);
  }, { passive:true });

  /* 2. Клик по панели → вверх страницы */
  bar.querySelector('img').addEventListener('click', () => {
    window.scrollTo({ top:0, behavior:'smooth' });
  });

  /* 3. Клик по бургеру открывает / закрывает меню  */
  burger.addEventListener('click', () => {
    burger.classList.toggle('burger--active');
    nav.classList.toggle('navigation--open');
  });

  /* 4. Закрываем меню после выбора ссылки */
  nav.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click',()=>{
      burger.classList.remove('burger--active');
      nav.classList.remove('navigation--open');
    });
  });
})();



const arrowBtn   = document.getElementById('scrollDown');
  const serviceSec = document.getElementById('service');

  if (arrowBtn && serviceSec){
    arrowBtn.addEventListener('click', () => {
      serviceSec.scrollIntoView({ behavior:'smooth' });
    });
  }





});
