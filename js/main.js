/**
 * FUTUROPOLIS — AI W MUZYCE 2026
 * Interactive Engine & UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initTelemetryHUD();
  initCyberShader();
  initHoloCard3D();
  initTimelineLaserRail();
  initStickyHeader();
  initAudioVisualizer();
  initHeroVideoControls();
  initCountdown();
  initAgendaInteractions();
  initSpeakersModalAndFilter();
  initGalleryLightbox();
  initFaqAccordion();
  initContactForm();
  initBackToTop();
  initMobileMenu();
});

/* ==========================================================================
   1. Sticky Header & Active Nav Spy
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. Audio Wave Canvas Visualizer
   ========================================================================== */
function initAudioVisualizer() {
  const canvas = document.getElementById('audio-visualizer-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = 240;
  }
  window.addEventListener('resize', resize);
  resize();

  let phase = 0;
  const waves = [
    { freq: 0.008, amp: 28, speed: 0.02, color: 'rgba(0, 240, 255, 0.45)', width: 2 },
    { freq: 0.012, amp: 38, speed: -0.015, color: 'rgba(157, 78, 221, 0.4)', width: 2 },
    { freq: 0.005, amp: 20, speed: 0.01, color: 'rgba(247, 37, 133, 0.3)', width: 1.5 }
  ];

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const midY = canvas.height - 40;

    waves.forEach(w => {
      ctx.beginPath();
      ctx.lineWidth = w.width;
      ctx.strokeStyle = w.color;

      for (let x = 0; x < canvas.width; x += 3) {
        const y = midY + Math.sin(x * w.freq + phase * w.speed) * w.amp * (Math.sin((x / canvas.width) * Math.PI));
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    });

    phase += 1;
    requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================================================
   3. Hero Video Controls
   ========================================================================== */
function initHeroVideoControls() {
  const video = document.getElementById('hero-bg-video');
  const btnPlay = document.getElementById('btn-video-play');
  const btnMute = document.getElementById('btn-video-sound');

  if (!video) return;

  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        btnPlay.innerHTML = '<span class="icon">⏸</span> <span>Pauza</span>';
      } else {
        video.pause();
        btnPlay.innerHTML = '<span class="icon">▶</span> <span>Wideo</span>';
      }
    });
  }

  if (btnMute) {
    btnMute.addEventListener('click', () => {
      video.muted = !video.muted;
      if (video.muted) {
        btnMute.innerHTML = '<span class="icon">🔇</span> <span>Dźwięk wył.</span>';
      } else {
        btnMute.innerHTML = '<span class="icon">🔊</span> <span>Dźwięk wł.</span>';
      }
    });
  }
}

/* ==========================================================================
   4. Event Countdown Timer
   ========================================================================== */
function initCountdown() {
  // Target: 28 November 2026 10:00:00 CET
  const targetDate = new Date('2026-11-28T10:00:00+01:00').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl) return;

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = d < 10 ? `0${d}` : d;
    hoursEl.textContent = h < 10 ? `0${h}` : h;
    minsEl.textContent = m < 10 ? `0${m}` : m;
    secsEl.textContent = s < 10 ? `0${s}` : s;
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   5. Agenda Tabs & Accordion
   ========================================================================== */
function initAgendaInteractions() {
  const tabBtns = document.querySelectorAll('.agenda-tab-btn');
  const actCards = document.querySelectorAll('.act-card');

  // Filter tabs
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      actCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Accordion toggle
  actCards.forEach(card => {
    const header = card.querySelector('.act-card-header');
    if (header) {
      header.addEventListener('click', () => {
        const isExpanded = card.classList.contains('expanded');
        // Close others if user wants single accordion, or allow multi-expand
        card.classList.toggle('expanded');
      });
    }
  });
}

/* ==========================================================================
   6. Speakers Filter & Modal Dialog
   ========================================================================== */
const speakersData = {
  'gniewomir-tomczyk': {
    name: 'Gniewomir Tomczyk',
    role: 'Inicjator Futuropolis / Perkusista, kompozytor, producent',
    topic: 'Możliwości wykorzystania AI w pracy artystycznej, dydaktycznej oraz koncertowej',
    badge: 'Artysta & Dyrektor',
    img: 'assets/speakers/Gniewomir Tomczyk.jpg',
    bio: 'Perkusista, kompozytor, producent i pedagog, inicjator projektu Futuropolis rozwijanego od 2023 roku w obszarze AI w muzyce. Autor autorskich albumów muzycznych, od 2024 roku wiceprezes Polskiego Stowarzyszenia Jazzowego. W projekcie Futuropolis łączy perkusję akustyczną i hybrydową z generatywnymi algorytmami AI oraz przetwarzaniem sygnału w czasie rzeczywistym.'
  },
  'grzegorz-stec': {
    name: 'Grzegorz Stec',
    role: 'Inżynier dźwięku / Architekt systemów audio & AI',
    topic: 'Integracja systemów elektronicznych, syntezy hybrydowej i modeli AI na scenie',
    badge: 'Technologia & Dźwięk',
    img: 'assets/speakers/Grzegorz Stec.jpeg',
    bio: 'Realizator dźwięku, inżynier systemów audio i producent. Odpowiada za warstwę technologiczną, spójność brzmieniową oraz integrację algorytmów sztucznej inteligencji z instrumentarium perkusyjnym i elektroniką w projektach Futuropolis oraz widowisku Lirael-9.'
  },
  'janusz-stoklosa': {
    name: 'Janusz Stokłosa',
    role: 'Kompozytor, pianista, wydawca, producent muzyczny',
    topic: 'Perspektywa kompozytora, doświadczenie twórcze, zmiany technologiczne w muzyce',
    badge: 'Mistrz Kompozycji',
    img: 'assets/speakers/Janusz Stokłosa.jpg',
    bio: 'Jeden z najwybitniejszych polskich kompozytorów muzyki teatralnej i filmowej, autor ponad 200 partytur. Twórca legendarnej muzyki do musicalu „Metro” (nominowanego do prestiżowej nagrody Tony na Broadwayu) oraz współzałożyciel Teatru Studio Buffo w Warszawie. Od dziesięcioleci śledzi ewolucję technologii w kompozycji i aranżacji.'
  },
  'natalia-kordiak': {
    name: 'Natalia Kordiak',
    role: 'Wokalistka jazzowa, improwizatorka, kompozytorka',
    topic: 'Twórca, improwizacja, własny język, indywidualność i autentyczność wobec AI',
    badge: 'Wokal & Improwizacja',
    img: 'assets/speakers/Natalia Kordiak.jpg',
    bio: 'Wokalistka i improwizatorka traktująca ludzki głos jako pole do radykalnych eksperymentów brzmieniowych. Liderka Natalia Kordiak Quintet, z którym zrealizowała nominowany do Fryderyka album „Bajka”. Jej prelekcja zgłębia ludzki błąd, emocje i organiczną spontaniczność głosu w zderzeniu z przewidywalną doskonałością algorytmów.'
  },
  'bartozzi-wojciechowski': {
    name: 'Bartozzi Wojciechowski',
    role: 'Basista, kompozytor, producent, pedagog',
    topic: 'Twórczość współczesna / technologia / nowe sposoby pracy artysty',
    badge: 'Scena & Studio',
    img: 'assets/speakers/Bartozzi Wojciechowski.jpg',
    bio: 'Wszechstronny basista i producent łączący jazz, funk i muzykę eksperymentalną. Współpracował m.in. z Tomaszem Stańką, Marysią Sadowską, Anitą Lipnicką i Wojciechem Konikiewiczem. Eksploruje nowe techniki pracy artysty z narzędziami cyfrowymi i urządzeniami hybrydowymi.'
  },
  'borys-stokalski': {
    name: 'Borys Stokalski',
    role: 'Ekspert AI & Deeptech, inwestor, przedsiębiorca',
    topic: 'Szersza perspektywa AI, dokąd zmierza technologia i jak zmienia kulturę',
    badge: 'Strategia & Przyszłość',
    img: 'assets/speakers/Borys Stokalski.jpeg',
    bio: 'Przedsiębiorca, inwestor i konsultant z ponad 30-letnim doświadczeniem w branży IT. Współzałożyciel grupy Infovide-Matrix, ekspert międzynarodowego Cutter Consortium, mentor i angel investor wspierający startupy z dziedziny sztucznej inteligencji, deeptechu i transformacji cyfrowej.'
  },
  'mateusz-modrzejewski': {
    name: 'dr inż. Mateusz Modrzejewski',
    role: 'Naukowiec Politechniki Warszawskiej, perkusista (b. Apple Music ML)',
    topic: 'AI i uczenie maszynowe w muzyce: algorytmy, analiza i wykonawstwo',
    badge: 'Nauka & Perkusja',
    img: 'assets/speakers/Mateusz Modrzejewski.jpg',
    bio: 'Naukowiec i inżynier w Instytucie Informatyki Politechniki Warszawskiej oraz aktywny perkusista z dorobkiem ponad 600 koncertów. Doświadczenie zdobywał m.in. w zespole Music Machine Learning w Apple Music. Łączy ścisłą wiedzę z zakresu sieci neuronowych i przetwarzania sygnału z praktyką koncertową.'
  },
  'dariusz-makaruk': {
    name: 'Dariusz Makaruk',
    role: 'Kompozytor muzyki elektronicznej, artysta multimedialny',
    topic: 'AI, eksperyment, sztuka cyfrowa, nowe sposoby tworzenia i immersji',
    badge: 'Sztuka Nowych Mediów',
    img: 'assets/speakers/Dariusz Makaruk.webp',
    bio: 'Kompozytor, producent muzyki elektronicznej i artysta multimedialny łączący dźwięk z nowymi technologiami, sztuką VR i instalacjami interaktywnymi. Członek Polskiego Stowarzyszenia Muzyki Elektroakustycznej, laureat międzynarodowych nagród w dziedzinie sztuki cyfrowej.'
  },
  'david-sypniewski': {
    name: 'David Sypniewski',
    role: 'Kierownik Zakładu Sztucznej Inteligencji Uniwersytetu SWPS',
    topic: 'Obraz / robotyka / nowe media: „Jak zaprojektowałem Bota, który nie jest moją zmarłą matką”',
    badge: 'Projektowanie & Etyka',
    img: 'assets/speakers/David Sypniewski.webp',
    bio: 'Projektant, wykładowca Uniwersytetu SWPS i badacz interakcji człowiek–technologia. Kieruje Zakładem Sztucznej Inteligencji oraz Otwartą Pracownią AI na Wydziale Projektowania. Zajmuje się generatywnym kodem, robotyką oraz humanistycznymi aspektami wykorzystania systemów autonomicznych.'
  },
  'sylwia-wiewiorka-zyga': {
    name: 'Sylwia Wiewiórka-Zyga',
    role: 'Radca prawny, ekspertka prawa własności intelektualnej',
    topic: 'Prawo autorskie w erze AI: trening modeli, autorstwo promptów, tantiemy',
    badge: 'Prawo Autorskie',
    img: 'assets/speakers/Sylwia Wiewiórka Zyga.jpg',
    bio: 'Radca prawny specjalizująca się w prawie własności intelektualnej, mediów i nowych technologii. Członkini Komisji Prawa Autorskiego X kadencji. Doradza artystom, wydawnictwom muzycznym oraz producentom filmowym, wyjaśniając złożone zagadnienia prawne generatywnej sztucznej inteligencji.'
  },
  'mariusz-misiek': {
    name: 'Mariusz Misiek',
    role: 'Head of AI w x-kom, ekspert technologii',
    topic: 'SUNO / Czy AI stało się producentem muzycznym? Narzędzia komercyjne',
    badge: 'Biznes & Modele Audio',
    img: 'assets/speakers/Mariusz Misiek.jpg',
    bio: 'Ekspert nowych technologii z ponad 25-letnim doświadczeniem w branży IT. Jako Head of AI w x-kom bada i wdraża systemy agentowe, modele generatywne oraz automatyzację. W muzyce testuje granice autonomii kompozytorskiej silników takich jak Suno czy Udio.'
  },
  'tomasz-wroblewski': {
    name: 'Tomasz Wróblewski',
    role: 'Twórca 0dB.pl, b. redaktor naczelny „Estrada i Studio”',
    topic: 'Czy AI zmienia tylko narzędzia w studiu, czy również proces twórczy?',
    badge: 'Produkcja Muzyczna',
    img: 'assets/speakers/Tomasz Wróblewski.jpg',
    bio: 'Realizator dźwięku, inżynier elektroniki, producent i edukator. Przez blisko 25 lat redaktor naczelny wiodącego pisma producentów dźwięku „Estrada i Studio”. Założyciel opiniotwórczego portalu i kanału wideo 0dB.pl, autorytet w dziedzinie sprzętu i oprogramowania audio.'
  },
  'atanas-valkov': {
    name: 'Atanas Valkov',
    role: 'Kompozytor muzyki filmowej i gier, pianista, producent',
    topic: 'Piano Odyseja: Fortepian akustyczny, synteza modularna i DSP Neutone',
    badge: 'Film & Gaming',
    img: 'assets/speakers/Atanas Valkov.jpg',
    bio: 'Polsko-bułgarski kompozytor i multiinstrumentalista, laureat głównej nagrody Berlinale Film Score Award. Autor muzyki do głośnych filmów i seriali (m.in. „Belfer”, „Legendy Polskie Allegro”). W autorskim projekcie „Piano Odyseja” integruje klasyczny fortepian z zaawansowanymi modelami AI.'
  },
  'krzysztof-cybulski': {
    name: 'dr Krzysztof Cybulski',
    role: 'Artysta dźwiękowy, panGenerator, UMFC',
    topic: 'AI a sztuka generatywna / Sprawczość, interpretowalność, namacalność',
    badge: 'Instrumenty Hybrydowe',
    img: 'assets/speakers/Krzysztof Cybulski.webp',
    bio: 'Muzyk, artysta dźwiękowy i konstruktor autorskich instrumentów hybrydowych. Współzałożyciel grupy panGenerator, laureat Paszportu Polityki, zdobywca prestiżowej Margaret Guthman Musical Instrument Competition w USA oraz wyróżnienia Prix Ars Electronica.'
  },
  'piotr-majewski': {
    name: 'Piotr Majewski',
    role: 'Prezes Polskiego Stowarzyszenia Jazzowego, Polskie Radio RDC',
    topic: 'Prowadzenie konferencji i moderacja Wielkiej Debaty o Kulturze i AI',
    badge: 'Prowadzący & Moderator',
    img: 'assets/speakers/Piotr Majewski.jpg',
    bio: 'Dziennikarz muzyczny Radia dla Ciebie, niestrudzony animator i propagator kultury improwizowanej, Prezes Polskiego Stowarzyszenia Jazzowego. Poprowadzi tegoroczną edycję oraz moderuje kluczową dyskusję z udziałem przedstawicieli mediów i artystów.'
  },
  'milosz-pekala': {
    name: 'prof. Miłosz Pękala',
    role: 'Profesor UMFC, perkusista, wibrafonista (Kwadrofonik)',
    topic: 'Koncert finałowy LIRAEL-9: wibrafon i perkusjonalia w dialogu z elektroniką',
    badge: 'Finał LIRAEL-9',
    img: 'assets/speakers/Bartek Miler.jpg', // fallback
    bio: 'Wybitny wibrafonista, perkusista, profesor Uniwersytetu Muzycznego Fryderyka Chopina w Warszawie. Współzałożyciel formacji Kwadrofonik i duetu Pękala Kordylasińska Pękala. Łączy wirtuozerię akustyczną z nowymi mediami dźwiękowymi.'
  },
  'bartek-miler': {
    name: 'Bartek Miler',
    role: 'Wirtuoz perkusji, marimbista, solista',
    topic: 'Koncert finałowy LIRAEL-9: wielowymiarowa marimba i instrumenty perkusyjne',
    badge: 'Finał LIRAEL-9',
    img: 'assets/speakers/Bartek Miler.jpg',
    bio: 'Znakomity perkusista i marimbista, laureat międzynarodowych konkursów w Europie i USA. Ceniony wykonawca muzyki współczesnej i improwizowanej, solista i kameralista w czołowych projektach scenicznych.'
  },
  'julianna-smuga': {
    name: 'Julianna Seidler-Smuga',
    role: 'Perkusistka, marimbistka, artystka handpanu',
    topic: 'Koncert finałowy LIRAEL-9: perkusjonalia, dzwonki, handpan',
    badge: 'Finał LIRAEL-9',
    img: 'assets/speakers/Julianna Seidler-Smuga.jpg',
    bio: 'Artystka perkusyjna poruszająca się między marimbą, ksylofonem a hipnotycznymi brzmieniami handpanu. W koncercie LIRAEL-9 tworzy subtelne, wielowarstwowe faktury akustyczne rezonujące z elektroniką.'
  },
  'kinga-rolka': {
    name: 'Kinga Rolka',
    role: 'Rytmiczka, pedagożka, choreografka (Akademia Muzyczna w Krakowie)',
    topic: 'Choreografia i ruch sceniczny w spektaklu LIRAEL-9',
    badge: 'Choreografia & Taniec',
    img: 'assets/speakers/Kinga Rolka.jpg',
    bio: 'Wykładowczyni Akademii Muzycznej im. Krzysztofa Pendereckiego w Krakowie, specjalistka ruchu scenicznego i improwizacji fortepianowej. Przygotowała choreografię grupy tanecznej, która ucieleśnia dialog człowieka z algorytmem w koncercie LIRAEL-9.'
  }
};

function initSpeakersModalAndFilter() {
  const modal = document.getElementById('speaker-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const filterBtns = document.querySelectorAll('.speaker-filters .filter-btn');
  const speakerCards = document.querySelectorAll('.speaker-card');

  // Filter
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      speakerCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal open
  speakerCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.speakerId;
      const data = speakersData[id];
      if (!data || !modal) return;

      document.getElementById('modal-speaker-name').textContent = data.name;
      document.getElementById('modal-speaker-role').textContent = data.role;
      document.getElementById('modal-topic-text').textContent = data.topic;
      document.getElementById('modal-speaker-bio').textContent = data.bio;
      document.getElementById('modal-speaker-img').src = data.img;
      document.getElementById('modal-speaker-img').alt = data.name;

      modal.showModal();
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.close();
    });
  }
}

/* ==========================================================================
   7. Gallery Lightbox
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('gallery-modal-img');
  const closeBtn = document.getElementById('gallery-close-btn');

  if (!modal || !modalImg) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Futuropolis Zdjęcie';
        modal.showModal();
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });
}

/* ==========================================================================
   8. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   9. Contact Form
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('conference-contact-form');
  const alertBox = document.getElementById('form-feedback-alert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      alertBox.textContent = 'Proszę wypełnić wszystkie wymagane pola.';
      alertBox.style.color = '#f72585';
      alertBox.style.display = 'block';
      return;
    }

    // Direct user to mailto or confirm message
    const subject = encodeURIComponent(`Zapytanie o konferencję Futuropolis od ${name}`);
    const body = encodeURIComponent(`Od: ${name} (${email})\n\nWiadomość:\n${message}`);

    alertBox.textContent = 'Dziękujemy! Otwieram Twojego klienta poczty lub wysyłam wiadomość...';
    alertBox.style.color = '#00f5a0';
    alertBox.style.display = 'block';

    setTimeout(() => {
      window.location.href = `mailto:kontakt@aiwmuzyce.pl?subject=${subject}&body=${body}`;
      form.reset();
    }, 600);
  });
}

/* ==========================================================================
   10. Back to top button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   11. Mobile Menu Drawer
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    const isOpen = navLinks.classList.contains('mobile-open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    menuBtn.innerHTML = isOpen ? '✕' : '☰';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      menuBtn.innerHTML = '☰';
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   12. HUD Telemetry Bar & Web Audio Synthesizer Feedback
   ========================================================================== */
function initTelemetryHUD() {
  const clockEl = document.getElementById('telemetry-clock');
  const audioToggle = document.getElementById('telemetry-audio-toggle');
  const fxStatusText = document.getElementById('fx-status-text');

  // Real-time CET Clock
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('pl-PL', { hour12: false, timeZone: 'Europe/Warsaw' });
      clockEl.textContent = `${timeStr} CET`;
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // Futuristic Web Audio Synthesizer Feedback
  let audioCtx = null;
  let fxEnabled = false;

  function playCyberChime(freq = 600, duration = 0.08, type = 'sine') {
    if (!fxEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // AudioContext policy fallback
    }
  }

  if (audioToggle && fxStatusText) {
    audioToggle.addEventListener('click', () => {
      fxEnabled = !fxEnabled;
      fxStatusText.textContent = fxEnabled ? 'ON' : 'OFF';
      audioToggle.style.borderColor = fxEnabled ? 'var(--neon-emerald)' : 'rgba(0, 240, 255, 0.3)';
      audioToggle.style.color = fxEnabled ? 'var(--neon-emerald)' : 'var(--neon-cyan)';
      
      if (fxEnabled) {
        playCyberChime(880, 0.12, 'triangle');
      }
    });

    // Attach subtle acoustic feedback to cyber buttons
    document.querySelectorAll('.btn-ticket-hud, .btn-cyber-primary, .btn-cyber-outline, .agenda-tab-btn, .speaker-card').forEach(el => {
      el.addEventListener('mouseenter', () => playCyberChime(440, 0.04, 'sine'));
      el.addEventListener('click', () => playCyberChime(750, 0.08, 'triangle'));
    });
  }
}

/* ==========================================================================
   13. Cyber Shader / Particle Constellation Canvas
   ========================================================================== */
function initCyberShader() {
  const canvas = document.getElementById('page-shader-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let animationId;
  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 30), 45);

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent ? parent.offsetWidth : window.innerWidth;
    height = canvas.height = parent ? parent.offsetHeight : window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
  });
  resize();

  function isLight() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  // Create nodes
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 1,
      isAlt: Math.random() > 0.6
    });
  }

  let mouseX = -1000;
  let mouseY = -1000;

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }, { passive: true });

  function render() {
    ctx.clearRect(0, 0, width, height);

    const light = isLight();
    const primaryRGB = light ? '2, 132, 199' : '0, 240, 255';
    const secondaryRGB = light ? '124, 58, 237' : '168, 85, 247';
    const linkAlphaMult = light ? 1.6 : 1.0;

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      const pRGB = p.isAlt ? secondaryRGB : primaryRGB;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${pRGB}, 0.75)`;
      ctx.fill();

      // Connect to neighbors
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.22 * linkAlphaMult;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${primaryRGB}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Mouse interactive links
      const mdx = p.x - mouseX;
      const mdy = p.y - mouseY;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < 160) {
        const mAlpha = (1 - mDist / 160) * 0.45 * linkAlphaMult;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${primaryRGB}, ${mAlpha})`;
        ctx.lineWidth = 1;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
      }
    }

    animationId = requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   14. Holographic 3D Card Tilt
   ========================================================================== */
function initHoloCard3D() {
  const card = document.getElementById('holo-head-card');
  if (!card) return;

  let bounds = null;

  function updateBounds() {
    bounds = card.getBoundingClientRect();
  }

  window.addEventListener('resize', updateBounds);
  window.addEventListener('scroll', updateBounds, { passive: true });

  card.addEventListener('mouseenter', () => {
    updateBounds();
  });

  card.addEventListener('mousemove', (e) => {
    if (!bounds) updateBounds();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    const rotateX = ((mouseY - centerY) / centerY) * -12;
    const rotateY = ((mouseX - centerX) / centerX) * 14;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
  });
}

/* ==========================================================================
   15. Scroll-Driven Laser Rail for the 7 Acts
   ========================================================================== */
function initTimelineLaserRail() {
  const railLit = document.getElementById('timeline-rail-lit');
  const wrapper = document.querySelector('.acts-timeline-wrapper');
  const actCards = document.querySelectorAll('.act-card');

  if (!railLit || !wrapper) return;

  function updateRail() {
    const rect = wrapper.getBoundingClientRect();
    const windowH = window.innerHeight;

    // Viewport middle position relative to wrapper
    const scrollTriggerY = windowH * 0.55;
    const offsetFromTop = scrollTriggerY - rect.top;
    const totalHeight = rect.height;

    let progress = (offsetFromTop / totalHeight) * 100;
    progress = Math.max(0, Math.min(100, progress));

    railLit.style.height = `${progress.toFixed(1)}%`;

    // Highlight active card
    actCards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      if (cardRect.top < scrollTriggerY && cardRect.bottom > 100) {
        card.style.borderColor = 'rgba(0, 240, 255, 0.45)';
      } else {
        card.style.borderColor = 'var(--border-glass)';
      }
    });
  }

  window.addEventListener('scroll', updateRail, { passive: true });
  window.addEventListener('resize', updateRail, { passive: true });
  updateRail();
}

/* ==========================================================================
   16. Theme Toggle System (Cyber-Dark / Cleanroom-Light)
   ========================================================================== */
function initThemeToggle() {
  const telemetryBtn = document.getElementById('theme-toggle-telemetry');
  const navBtn = document.getElementById('nav-theme-toggle');

  function getActiveTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme, save = true) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    if (save) {
      try {
        localStorage.setItem('futuropolis-theme', theme);
      } catch {
        // localStorage not available
      }
    }

    updateUI(theme);
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  function updateUI(theme) {
    const isLight = theme === 'light';

    if (telemetryBtn) {
      const icon = telemetryBtn.querySelector('.theme-icon');
      const label = telemetryBtn.querySelector('.theme-label');
      if (icon) icon.textContent = isLight ? '🌙' : '☀️';
      if (label) label.textContent = isLight ? 'DARK' : 'LIGHT';
      telemetryBtn.setAttribute('title', isLight ? 'Przełącz na tryb ciemny' : 'Przełącz na tryb jasny');
    }

    if (navBtn) {
      const icon = navBtn.querySelector('.theme-icon');
      if (icon) icon.textContent = isLight ? '🌙' : '☀️';
      navBtn.setAttribute('title', isLight ? 'Przełącz na tryb ciemny' : 'Przełącz na tryb jasny');
    }
  }

  function toggle() {
    const current = getActiveTheme();
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
  }

  if (telemetryBtn) telemetryBtn.addEventListener('click', toggle);
  if (navBtn) navBtn.addEventListener('click', toggle);

  // Initialize UI state
  updateUI(getActiveTheme());
}

