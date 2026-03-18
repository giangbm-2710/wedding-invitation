/* ============================================================
   WEDDING WEBSITE – MAIN.JS
   Features: Countdown, Scroll Animation, Lightbox, RSVP, Petals, Tabs
   ============================================================ */

'use strict';

// ===== 1. FLOATING PETALS =====
(function initPetals() {
  const container = document.getElementById('petals');
  if (!container) return;

  const PETAL_COUNT = 18;

  for (let i = 0; i < PETAL_COUNT; i++) {
    const petal = document.createElement('div');
    petal.classList.add('petal');

    // Randomize properties
    const leftPct = Math.random() * 100;
    const duration = 6 + Math.random() * 10; // 6–16s
    const delay = Math.random() * 12; // 0–12s
    const size = 15 + Math.random() * 15; // 15–30px

    petal.style.cssText = `
      left: ${leftPct}%;
      width: ${size}px;
      height: ${size * 1.4}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    container.appendChild(petal);
  }
})();

// ===== 2. COUNTDOWN TIMER =====
(function initCountdown() {
  const countdowns = document.querySelectorAll('.countdown');
  if (!countdowns.length) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateAllCountdowns() {
    const now = Date.now();

    countdowns.forEach((el) => {
      const targetDateStr = el.getAttribute('data-date');
      if (!targetDateStr) return;

      const targetDate = new Date(targetDateStr).getTime();
      const diff = targetDate - now;

      const daysEl = el.querySelector('.js-days');
      const hoursEl = el.querySelector('.js-hours');
      const minutesEl = el.querySelector('.js-minutes');
      const secondsEl = el.querySelector('.js-seconds');

      if (!daysEl) return;

      if (diff <= 0) {
        // Find existing text or replace
        el.innerHTML = '<p style="font-family:var(--font-script); font-size:1.5rem; color:var(--color-rose); margin-top:8px;">Đã diễn ra 💕</p>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minutesEl.textContent = pad(minutes);
      secondsEl.textContent = pad(seconds);
    });
  }

  updateAllCountdowns();
  setInterval(updateAllCountdowns, 1000);
})();

// ===== 3. SCROLL ANIMATION =====
(function initScrollAnimation() {
  const items = document.querySelectorAll('.animate-on-scroll');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Stagger siblings
          const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
          siblings.forEach((sib, idx) => {
            sib.style.transitionDelay = `${idx * 0.1}s`;
          });
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((item) => observer.observe(item));
})();

// ===== 4. PHOTO LIGHTBOX =====
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (!lightbox) return;

  let currentIndex = 0;
  let photos = [];

  function collectPhotos() {
    photos = Array.from(document.querySelectorAll('.album-item img')).map((img) => img.src);
  }

  function openLightbox(index) {
    collectPhotos();
    currentIndex = index;
    lightboxImg.src = photos[currentIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    lightboxImg.src = photos[currentIndex];
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % photos.length;
    lightboxImg.src = photos[currentIndex];
  }

  // Bind clicks on album images
  function bindAlbumClicks() {
    document.querySelectorAll('.album-item').forEach((item, idx) => {
      item.addEventListener('click', () => openLightbox(idx));
    });
  }
  bindAlbumClicks();

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
})();

// ===== 5. VIEW MORE ALBUM =====
(function initViewMore() {
  const btn = document.getElementById('viewMoreBtn');
  const extra = document.getElementById('albumExtra');
  if (!btn || !extra) return;

  let expanded = false;

  btn.addEventListener('click', () => {
    expanded = !expanded;
    extra.style.display = expanded ? 'grid' : 'none';
    btn.textContent = expanded ? 'Thu Gọn' : 'Xem Thêm';
    if (expanded) {
      // Re-bind lightbox for new images
      document.querySelectorAll('.album-item').forEach((item, idx) => {
        item.onclick = null; // clear old
        item.addEventListener('click', () => {
          const photos = Array.from(document.querySelectorAll('.album-item img')).map(i => i.src);
          const lb = document.getElementById('lightbox');
          const lbImg = document.getElementById('lightboxImg');
          lbImg.src = photos[idx];
          lb.classList.add('active');
          document.body.style.overflow = 'hidden';
        });
      });
    }
  });
})();

// ===== 6. EVENT TABS =====
(function initEventTabs() {
  const tabs = document.querySelectorAll('.event-tab');
  const panels = document.querySelectorAll('.event-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(target);
      if (targetPanel) {
        targetPanel.classList.add('active');
        // Animate entry
        targetPanel.style.animation = 'none';
        targetPanel.offsetHeight; // reflow
        targetPanel.style.animation = 'fadeIn 0.4s ease both';
      }
    });
  });
})();

// ===== 7. RSVP FORM =====
(function initRSVP() {
  const form = document.getElementById('rsvpForm');
  const success = document.getElementById('rsvpSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('guestName').value.trim();
    const phone = document.getElementById('guestPhone').value.trim();
    const count = document.getElementById('guestCount').value;
    const attendance = document.getElementById('attendance').value;

    if (!name || !phone || !count || !attendance) {
      showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
      return;
    }

    // Simulate submission
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Đang gửi...';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      success.style.display = 'block';
      success.style.animation = 'fadeInUp 0.6s ease both';
    }, 1200);
  });
})();

// ===== 8. SCROLL TO TOP =====
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ===== 9. MUSIC TOGGLE =====
(function initMusic() {
  const btn = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');
  if (!btn || !audio) return;

  let playing = false;
  let hasInteracted = false;
  audio.volume = 1.0; // Âm lượng tối đa

  function updateBtnUI() {
    if (playing) {
      btn.classList.add('playing');
      btn.textContent = '🔇';
    } else {
      btn.classList.remove('playing');
      btn.textContent = '🎵';
    }
  }

  function playMusic() {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        playing = true;
        updateBtnUI();
      }).catch(error => {
        // Tắt cờ playing nếu play bị lỗi (do thiếu source mp3 hoặc bị chặn)
        playing = false;
        updateBtnUI();
        console.error("Audio play failed:", error);
      });
    }
  }

  // Thử tự động bật ngay khi khởi tạo
  playMusic();

  // Bắt sự kiện click để bật nhạc (chỉ 1 lần lầu tiên)
  function unlockAudio() {
    if (hasInteracted) return;
    hasInteracted = true;
    if (!playing) {
      playMusic();
    }
    document.body.removeEventListener('click', unlockAudio);
    document.body.removeEventListener('touchstart', unlockAudio);
  }

  document.body.addEventListener('click', unlockAudio);
  document.body.addEventListener('touchstart', unlockAudio);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    hasInteracted = true; 
    document.body.removeEventListener('click', unlockAudio);
    document.body.removeEventListener('touchstart', unlockAudio);

    if (playing) {
      audio.pause();
      playing = false;
      updateBtnUI();
    } else {
      // Ép buộc playing true tạm thời để nút phản hồi, nếu lỗi sẽ tự tắt
      playing = true; 
      updateBtnUI();
      playMusic();
    }
  });
})();

// ===== 10. NOTIFICATION HELPER =====
function showNotification(message, type = 'info') {
  const existing = document.getElementById('notification');
  if (existing) existing.remove();

  const n = document.createElement('div');
  n.id = 'notification';
  n.textContent = message;
  n.style.cssText = `
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    padding: 14px 28px;
    border-radius: 50px;
    background: ${type === 'error' ? '#d4826b' : '#7a5c44'};
    color: white;
    font-family: 'Lato', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 1px;
    z-index: 99999;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    animation: fadeInDown 0.4s ease;
  `;
  document.body.appendChild(n);
  setTimeout(() => {
    n.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => n.remove(), 300);
  }, 3000);
}

// ===== 11. SMOOTH NAV LINKS =====
(function initSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ===== 12. PARALLAX HERO =====
(function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      hero.style.backgroundPositionY = `${scrolled * 0.3}px`;
    }
  }, { passive: true });
})();

console.log('💕 Wedding website loaded – Minh Đức & Đỗ Huyền 28.03.2026');
