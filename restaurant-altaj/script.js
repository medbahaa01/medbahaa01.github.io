// ================================================
// اللغة
// ================================================
let isArabic = true;

function toggleLang() {
  isArabic = !isArabic;

  // تحديث أزرار اللغة
  ['splashLangBtn', 'navLangBtn', 'mobileLangBtn'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.textContent = isArabic ? 'EN' : 'AR';
  });

  // اتجاه الصفحة
  document.documentElement.dir  = isArabic ? 'rtl' : 'ltr';
  document.documentElement.lang = isArabic ? 'ar'  : 'en';

  // العناصر الثابتة التي لا تتغير
  const fixed = ['brand-ar', 'brand-en-name', 'hero-title', 'hero-en-title', 'logo-ar', 'logo-en'];

  // ترجمة النصوص
  document.querySelectorAll('[data-ar]').forEach(el => {
    if (fixed.some(cls => el.classList.contains(cls))) return;
    el.textContent = isArabic ? el.dataset.ar : el.dataset.en;
  });

  // ترجمة الـ placeholders
  document.querySelectorAll('[data-ar-placeholder]').forEach(el => {
    el.placeholder = isArabic
      ? el.dataset.arPlaceholder
      : el.dataset.enPlaceholder;
  });
}

// ================================================
// SPLASH — زر الدخول
// ================================================
document.getElementById('enterBtn').addEventListener('click', () => {
  const splash = document.getElementById('splash');
  const main   = document.getElementById('mainSite');

  splash.style.opacity = '0';
  splash.style.pointerEvents = 'none';

  setTimeout(() => {
    splash.style.display = 'none';
    main.classList.remove('hidden');
    initMainSite();
  }, 900);
});

// ================================================
// MAIN — تشغيل بعد الدخول
// ================================================
function initMainSite() {

  // --- NAVBAR ---
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });

  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(8,5,0,0.98)';
      nav.style.borderBottomColor = 'rgba(201,168,76,0.4)';
    } else {
      nav.style.background = 'rgba(8,5,0,0.94)';
      nav.style.borderBottomColor = 'rgba(201,168,76,0.2)';
    }
  });

  // --- روابط الـ Navbar ---
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');

      // إخفاء كل الأقسام
      ['menu-page', 'reservation', 'contact'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
      });

      document.getElementById('mobileMenu').classList.remove('open');

      if      (href === '#menu-page')   openMenu('main');
      else if (href === '#reservation') document.getElementById('reservation').classList.remove('hidden');
      else if (href === '#contact')     document.getElementById('contact').classList.remove('hidden');
      else if (href === '#hero')        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ================================================
  // WAITERS — النادلان
  // ================================================
  function openMenu(tabName) {
    const menuPage = document.getElementById('menu-page');
    menuPage.classList.remove('hidden');

    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu-content').forEach(c => c.classList.remove('active'));

    const targetTab     = document.querySelector(`.menu-tab[data-tab="${tabName}"]`);
    const targetContent = document.getElementById('tab-' + tabName);
    if (targetTab)     targetTab.classList.add('active');
    if (targetContent) targetContent.classList.add('active');

    menuPage.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setupWaiter(btnId, popupId) {
    const btn   = document.getElementById(btnId);
    const popup = document.getElementById(popupId);
    if (!btn || !popup) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.waiter-popup').forEach(p => {
        if (p !== popup) p.classList.remove('open');
      });
      popup.classList.toggle('open');
    });

    popup.addEventListener('click', (e) => e.stopPropagation());

    popup.querySelectorAll('.popup-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.preventDefault();
        popup.classList.remove('open');

        const tab  = opt.dataset.tab;
        const href = opt.getAttribute('href');

        if (tab)               openMenu(tab);
        else if (href === '#reservation') {
          document.getElementById('contact').classList.add('hidden');
          document.getElementById('reservation').classList.remove('hidden');
        }
        else if (href === '#contact') {
          document.getElementById('reservation').classList.add('hidden');
          document.getElementById('contact').classList.remove('hidden');
        }
      });
    });
  }

  setupWaiter('waiter-food',    'popup-food');
  setupWaiter('waiter-service', 'popup-service');

  // إغلاق عند الضغط خارجاً
  document.addEventListener('click', () => {
    document.querySelectorAll('.waiter-popup').forEach(p => p.classList.remove('open'));
  });

  // ================================================
  // MENU — تبويبات القائمة
  // ================================================
  document.getElementById('backFromMenu').addEventListener('click', () => {
    document.getElementById('menu-page').classList.add('hidden');
  });

  document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.menu-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // ================================================
  // RESERVATION — الحجز
  // ================================================
  document.getElementById('backFromReservation').addEventListener('click', () => {
    document.getElementById('reservation').classList.add('hidden');
    document.getElementById('selectedInfo').classList.remove('show');
    document.querySelectorAll('.table-item[data-status="selected"]').forEach(t => {
      t.dataset.status = t.dataset.original || 'available';
    });
  });

  let selectedTable = null;

  document.querySelectorAll('.table-item').forEach(table => {
    table.dataset.original = table.dataset.status;

    table.addEventListener('click', () => {
      if (table.dataset.status === 'booked') return;

      if (selectedTable && selectedTable !== table) {
        selectedTable.dataset.status = selectedTable.dataset.original;
      }

      selectedTable = table;
      table.dataset.status = 'selected';

      const num  = table.dataset.table;
      const type = table.dataset.type;

      const typeNames = {
        double: isArabic ? 'ثنائية (٢ كراسي)'  : 'Double (2 seats)',
        quad:   isArabic ? 'رباعية (٤ كراسي)'  : 'Four-seat (4 seats)',
        family: isArabic ? 'عائلية (٦ كراسي)'  : 'Family (6 seats)',
        vip:    'VIP — ' + (isArabic ? 'حسب الطلب' : 'On Request')
      };

      document.getElementById('selectedDetails').textContent =
        (isArabic ? 'طاولة رقم ' : 'Table No. ') + num + ' — ' + typeNames[type];

      document.getElementById('selectedInfo').classList.add('show');
    });
  });

  document.getElementById('confirmRes').addEventListener('click', () => {
    if (!selectedTable) return;

    const name   = document.getElementById('bookingName').value.trim();
    const phone  = document.getElementById('bookingPhone').value.trim();
    const date   = document.getElementById('bookingDate').value;
    const time   = document.getElementById('bookingTime').value;
    const guests = document.getElementById('bookingGuests').value;

    if (!name || !phone || !date || !time || !guests) {
      alert(isArabic ? 'يرجى تعبئة جميع الحقول' : 'Please fill all fields');
      return;
    }

    selectedTable.dataset.status   = 'booked';
    selectedTable.dataset.original = 'booked';
    selectedTable = null;

    document.getElementById('selectedInfo').classList.remove('show');
    document.getElementById('bookingName').value   = '';
    document.getElementById('bookingPhone').value  = '';
    document.getElementById('bookingDate').value   = '';
    document.getElementById('bookingTime').value   = '';
    document.getElementById('bookingGuests').value = '';

    const successDiv = document.createElement('div');
    successDiv.className = 'booking-success';
    successDiv.innerHTML = `
      <div class="success-box">
        <span class="success-icon">✅</span>
        <h2 class="success-title">${isArabic ? 'تم الحجز بنجاح!' : 'Booking Confirmed!'}</h2>
        <p class="success-msg">
          ${isArabic
            ? `مرحباً <strong>${name}</strong>،<br>تم تأكيد حجزك في ${date} الساعة ${time}<br>سنتواصل معك على <strong>${phone}</strong>`
            : `Hello <strong>${name}</strong>,<br>Booking confirmed for ${date} at ${time}<br>We'll contact you at <strong>${phone}</strong>`}
        </p>
        <button class="success-close" onclick="this.parentElement.parentElement.remove()">
          ${isArabic ? 'حسناً، شكراً' : 'OK, Thank you'}
        </button>
      </div>
    `;
    document.body.appendChild(successDiv);
  });

  // ================================================
  // CONTACT — التواصل
  // ================================================
  document.getElementById('backFromContact').addEventListener('click', () => {
    document.getElementById('contact').classList.add('hidden');
  });

  document.getElementById('sendContact').addEventListener('click', () => {
    const name  = document.getElementById('contactName').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const msg   = document.getElementById('contactMsg').value.trim();

    if (!name || !phone || !msg) {
      alert(isArabic ? 'يرجى تعبئة الاسم والهاتف والرسالة' : 'Please fill name, phone and message');
      return;
    }

    document.getElementById('contactName').value  = '';
    document.getElementById('contactPhone').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactMsg').value   = '';

    const successDiv = document.createElement('div');
    successDiv.className = 'booking-success';
    successDiv.innerHTML = `
      <div class="success-box">
        <span class="success-icon">💌</span>
        <h2 class="success-title">${isArabic ? 'تم إرسال رسالتك!' : 'Message Sent!'}</h2>
        <p class="success-msg">
          ${isArabic
            ? `شكراً <strong>${name}</strong>،<br>وصلتنا رسالتك وسنرد عليك قريباً<br>على رقم <strong>${phone}</strong>`
            : `Thank you <strong>${name}</strong>,<br>Your message received and we'll reply soon<br>at <strong>${phone}</strong>`}
        </p>
        <button class="success-close" onclick="this.parentElement.parentElement.remove()">
          ${isArabic ? 'حسناً، شكراً' : 'OK, Thank you'}
        </button>
      </div>
    `;
    document.body.appendChild(successDiv);
  });

}
