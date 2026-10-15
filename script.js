/* ==========================================================================
   ALYA KHAIRUNNISA — INFORMATICS & CREATIVE TECH PORTFOLIO JAVASCRIPT
   Tactile Stickers, Sound Effects, Sparkle Trail, Interactive Diary,
   Software Projects Case Studies & Guestbook
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAudioSystem();
  initSparkleTrail();
  initKeyboardClickTargets();
  initStickerInteractions();
  initNotebookTabs();
  initArticleModal();
  initProjectShowcase();
  initGuestbook();
  initClipboardHelpers();
  initInteractiveTodo();
  initLightbox();
});

/* ==========================================================================
   1. SOUND EFFECTS (Web Audio API)
   ========================================================================== */

let audioCtx = null;
let isSfxEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch((error) => {
      console.warn('Could not resume the audio context:', error);
    });
  }
  return audioCtx;
}

function initAudioSystem() {
  const sfxToggleBtn = document.getElementById('sfx-toggle-btn');
  const sfxIcon = document.getElementById('sfx-icon');

  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      isSfxEnabled = !isSfxEnabled;
      sfxToggleBtn.setAttribute('aria-pressed', String(isSfxEnabled));
      if (sfxIcon) sfxIcon.textContent = isSfxEnabled ? '🔊' : '🔇';
      showToast(`Sound Effects: ${isSfxEnabled ? 'Enabled' : 'Muted'}`, isSfxEnabled ? '✨' : '🔇');
    });
  }
}

// Play cute soft bubble pop on sticker drag/click
function playPopSound(freq = 520) {
  if (!isSfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (error) {
    console.warn('Could not play the pop sound:', error);
  }
}

// Play gentle magical chime on milestone or modal open
function playChimeSound() {
  if (!isSfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [587.33, 739.99, 880, 1046.5]; // D5, F#5, A5, C6
  notes.forEach((note, index) => {
    setTimeout(() => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, ctx.currentTime);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } catch (error) {
        console.warn('Could not play a chime note:', error);
      }
    }, index * 80);
  });
}

/* ==========================================================================
   2. SPARKLE CURSOR TRAIL (Fairy dust & star particles)
   ========================================================================== */

let isSparkleEnabled = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

function initSparkleTrail() {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  const sparkleColors = ['#00D8FF', '#FBC3D3', '#F79DB5', '#FFF3B3', '#98C49C', '#E0C3FC', '#FFFFFF'];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 3;
      this.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2 - 0.5;
      this.life = 1;
      this.decay = Math.random() * 0.03 + 0.02;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.1;
      this.isStar = Math.random() > 0.4;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.life -= this.decay;
      if (this.size > 0.5) this.size -= 0.05;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;

      if (this.isStar) {
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(Math.cos((i * Math.PI) / 2) * this.size, Math.sin((i * Math.PI) / 2) * this.size);
          ctx.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (this.size * 0.35), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (this.size * 0.35));
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  let mouseX = 0, mouseY = 0;
  let lastSpawn = 0;
  let animationFrameId = null;

  window.addEventListener('mousemove', (e) => {
    if (!isSparkleEnabled) return;
    mouseX = e.clientX;
    mouseY = e.clientY;

    const now = Date.now();
    if (now - lastSpawn > 25) {
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle(mouseX + (Math.random() * 10 - 5), mouseY + (Math.random() * 10 - 5)));
      }
      lastSpawn = now;
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(renderSparkles);
      }
    }
  });

  function renderSparkles() {
    animationFrameId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }
    if (particles.length > 0) {
      animationFrameId = requestAnimationFrame(renderSparkles);
    }
  }

  const sparkleToggleBtn = document.getElementById('sparkle-toggle-btn');
  if (sparkleToggleBtn) {
    sparkleToggleBtn.setAttribute('aria-pressed', String(isSparkleEnabled));
    sparkleToggleBtn.style.opacity = isSparkleEnabled ? '1' : '0.5';
    sparkleToggleBtn.addEventListener('click', () => {
      isSparkleEnabled = !isSparkleEnabled;
      sparkleToggleBtn.setAttribute('aria-pressed', String(isSparkleEnabled));
      sparkleToggleBtn.style.opacity = isSparkleEnabled ? '1' : '0.5';
      showToast(`Magic Sparkle Trail: ${isSparkleEnabled ? 'ON' : 'OFF'}`, '✨');
    });
  }
}

/* ==========================================================================
   3. TACTILE DRAGGABLE STICKERS & ENVELOPE CONTROLS
   ========================================================================== */

let highestZIndex = 100;

function initStickerInteractions() {
  const stickers = document.querySelectorAll('.scrapbook-sticker');
  const board = document.getElementById('stickers-board');
  const envelope = document.getElementById('envelope-body');
  const waxSeal = document.getElementById('wax-seal');
  const btnSpill = document.getElementById('btn-spill-stickers');
  const btnGather = document.getElementById('btn-gather-stickers');
  const btnAddSticker = document.getElementById('btn-add-custom-sticker');

  const bubbleName = document.getElementById('bubble-skill-name');
  const bubbleDesc = document.getElementById('bubble-skill-desc');

  const defaultPositions = [];
  stickers.forEach((sticker) => {
    defaultPositions.push({
      el: sticker,
      left: sticker.style.left || getComputedStyle(sticker).left,
      top: sticker.style.top || getComputedStyle(sticker).top,
      transform: sticker.style.transform || getComputedStyle(sticker).transform
    });

    makeDraggable(sticker);

    sticker.addEventListener('click', () => {
      playPopSound(600 + Math.random() * 200);
      const skillName = sticker.getAttribute('data-skill') || sticker.innerText.trim();
      const skillDesc = sticker.getAttribute('data-desc') || 'Core engineering proficiency and practical application.';

      if (bubbleName) bubbleName.textContent = skillName;
      if (bubbleDesc) bubbleDesc.textContent = skillDesc;

      const bubble = document.getElementById('skill-detail-bubble');
      if (bubble) {
        bubble.style.transform = 'scale(1.03)';
        setTimeout(() => { bubble.style.transform = 'scale(1)'; }, 200);
      }
    });
  });

  if (waxSeal && envelope) {
    waxSeal.addEventListener('click', () => {
      playPopSound(440);
      envelope.classList.toggle('opened');
      const isOpened = envelope.classList.contains('opened');
      showToast(isOpened ? 'Dev Envelope Opened! 💻' : 'Envelope Sealed! ✉️', '🌸');
    });
  }

  if (btnSpill) {
    btnSpill.addEventListener('click', () => {
      playChimeSound();
      if (envelope && !envelope.classList.contains('opened')) {
        envelope.classList.add('opened');
      }

      stickers.forEach((sticker) => {
        const randomX = Math.floor(Math.random() * 70 + 10);
        const randomY = Math.floor(Math.random() * 320 + 20);
        const randomRot = Math.floor(Math.random() * 30 - 15);

        sticker.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        sticker.style.left = `${randomX}%`;
        sticker.style.top = `${randomY}px`;
        sticker.style.transform = `rotate(${randomRot}deg)`;

        setTimeout(() => {
          sticker.style.transition = '';
        }, 650);
      });

      showToast('Tech stickers scattered! Drag them anywhere! 💥', '💻');
    });
  }

  if (btnGather) {
    btnGather.addEventListener('click', () => {
      playPopSound(500);
      stickers.forEach((sticker, i) => {
        const def = defaultPositions[i];
        if (def) {
          sticker.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
          sticker.style.left = def.left;
          sticker.style.top = def.top;
          sticker.style.transform = def.transform;

          setTimeout(() => {
            sticker.style.transition = '';
          }, 650);
        }
      });
      showToast('Stickers tucked back into envelope ✉️', '🎀');
    });
  }

  if (btnAddSticker && board) {
    const cuteDevStickers = [
      { text: 'TypeScript Fan ⚡', bg: '#3178C6', color: '#FFF' },
      { text: 'Bug Hunter 🐛', bg: '#EF4444', color: '#FFF' },
      { text: 'CSS Wizard 🎨', bg: '#06B6D4', color: '#FFF' },
      { text: 'git push --force 🚀', bg: '#F05032', color: '#FFF' },
      { text: 'Zero Errors 🟢', bg: '#10B981', color: '#FFF' },
      { text: 'Dark Mode Fan 🌙', bg: '#1E1E2E', color: '#CBA6F7' }
    ];

    btnAddSticker.addEventListener('click', () => {
      playChimeSound();
      const randItem = cuteDevStickers[Math.floor(Math.random() * cuteDevStickers.length)];
      const newSticker = document.createElement('div');
      newSticker.className = 'scrapbook-sticker';
      newSticker.style.background = randItem.bg;
      newSticker.style.color = randItem.color;
      newSticker.style.top = `${Math.floor(Math.random() * 200 + 50)}px`;
      newSticker.style.left = `${Math.floor(Math.random() * 60 + 20)}%`;
      newSticker.style.transform = `rotate(${Math.floor(Math.random() * 20 - 10)}deg)`;
      const stickerText = document.createElement('span');
      stickerText.className = 'sticker-text';
      stickerText.textContent = randItem.text;
      newSticker.appendChild(stickerText);
      newSticker.setAttribute('data-skill', randItem.text);
      newSticker.setAttribute('data-desc', 'A custom stamped developer sticker pinned to Alya’s board!');

      board.appendChild(newSticker);
      makeDraggable(newSticker);

      newSticker.addEventListener('click', () => {
        playPopSound(650);
        if (bubbleName) bubbleName.textContent = randItem.text;
        if (bubbleDesc) bubbleDesc.textContent = 'Custom developer sticker stamped by you!';
      });

      showToast(`Stamped: ${randItem.text}!`, '💻');
    });
  }
}

// Reusable physics drag handler
function makeDraggable(element) {
  let isDragging = false;
  let startX = 0, startY = 0;
  let initialLeft = 0, initialTop = 0;

  element.addEventListener('pointerdown', (e) => {
    if (e.button && e.button !== 0) return;

    isDragging = true;
    highestZIndex++;
    element.style.zIndex = highestZIndex;
    element.classList.add('is-dragging');

    startX = e.clientX;
    startY = e.clientY;

    const rect = element.getBoundingClientRect();
    const parentRect = element.parentElement.getBoundingClientRect();

    initialLeft = rect.left - parentRect.left;
    initialTop = rect.top - parentRect.top;

    element.setPointerCapture(e.pointerId);
    playPopSound(480);
  });

  element.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    element.style.left = `${initialLeft + dx}px`;
    element.style.top = `${initialTop + dy}px`;
  });

  const stopDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    element.classList.remove('is-dragging');
    playPopSound(560);
  };

  element.addEventListener('pointerup', stopDrag);
  element.addEventListener('pointercancel', stopDrag);
}

/* ==========================================================================
   4. NOTEBOOK PLANNER TABS
   ========================================================================== */

function initNotebookTabs() {
  const tabs = document.querySelectorAll('.planner-tab');
  const tabContents = document.querySelectorAll('.notebook-tab-content');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      playPopSound(500);
      const targetId = tab.getAttribute('data-tab');

      tabs.forEach((t) => t.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add('active');
    });
  });
}

/* ==========================================================================
   5. FEATURED SOFTWARE PROJECTS SHOWCASE & CASE STUDIES
   ========================================================================== */

/* ==========================================================================
   5. FEATURED SOFTWARE PROJECTS SHOWCASE & CASE STUDIES
   ========================================================================== */

const projectDatabase = {
  'vocalearn': {
    badge: '🏆 KMIPN 2026 Winner • AI Adaptive Learning',
    title: 'VocaLearn Adaptive Learning Engine',
    meta: 'Role: Project Manager & Full-Stack Developer • Stack: Flutter, Python (FastAPI), MySQL, OpenAI, Gemini AI, JWT',
    content: `
      <img src="assets/images/project_vocalearn_demo.svg" class="modal-project-img" onclick="openLightbox(this.src, 'VocaLearn Adaptive Learning Engine — Flutter & AI Platform')" alt="VocaLearn anonymized demo preview">
      <div class="project-case-grid">
        <div class="case-box">
          <h5>🎯 Problem Statement</h5>
          <p>Vocational students experience varied pacing and skill acquisition rates. Conventional static curricula fail to personalize learning modules, adapt quizzes to student competency, or provide timely individualized tutor interactions.</p>
        </div>
        <div class="case-box">
          <h5>💡 Solution & Leadership</h5>
          <p>As Project Manager and Full-Stack Developer, Alya led the development of VocaLearn: building high-performance asynchronous REST APIs, implementing JWT authentication, integrating Bayesian Knowledge Tracing (BKT) competency assessment, and orchestrating OpenAI & Google Gemini AI for personalized recommendations.</p>
        </div>
      </div>

      <h4>💻 Technical Architecture & Implementation:</h4>
      <ul>
        <li><strong>Backend Engine (FastAPI):</strong> Asynchronous REST APIs with relational MySQL database integration, Pydantic schema validation, and secure JWT-based authentication.</li>
        <li><strong>AI & Competency Assessment:</strong> Combined Bayesian Knowledge Tracing (BKT) to dynamically infer student mastery level with Google Gemini & OpenAI API models to generate personalized modules and interactive quizzes.</li>
        <li><strong>Mobile Application (Flutter):</strong> Responsive cross-platform mobile client featuring smooth module navigation, interactive quizzes, progress trackers, and real-time tutor interaction.</li>
        <li><strong>Project Management:</strong> Coordinated sprint milestones, task allocation, code integration, and deployment deadlines across the engineering team.</li>
      </ul>

      <div class="case-box" style="margin-top: 14px;">
        <h5>🏆 Recognition & Impact:</h5>
        <p>Awarded <strong>2nd Winner in the Hackathon Challenge Category</strong> and <strong>Silver Medalist at KMIPN Awards 2026</strong> (Kompetisi Mahasiswa Informatika Politeknik Nasional).</p>
        <p style="margin-top: 8px;"><a href="https://github.com/ariskiandrijusaldi/Vocalearn" target="_blank" rel="noopener noreferrer" style="color: var(--pink-deep); font-weight: 700; text-decoration: underline;">➔ View GitHub Repository (ariskiandrijusaldi/Vocalearn)</a></p>
      </div>
    `
  },
  'ppdb-sd': {
    badge: '🏫 Web & GIS Spatial System',
    title: 'Sistem Informasi PPDB Sekolah Dasar (Elementary School Admission System)',
    meta: 'Role: Full-Stack Developer • Stack: PHP, MySQL, JavaScript, HTML, CSS, Leaflet.js',
    content: `
      <img src="assets/images/project_ppdb.png" class="modal-project-img" onclick="openLightbox(this.src, 'Sistem Informasi PPDB Sekolah Dasar — PHP & Leaflet.js GIS')" alt="PPDB SD Screenshot">
      <div class="project-case-grid">
        <div class="case-box">
          <h5>🎯 Challenge</h5>
          <p>Elementary school admissions suffered from tedious paper registrations, manual verification bottlenecks, and difficulty for parents in identifying nearby zoned elementary schools.</p>
        </div>
        <div class="case-box">
          <h5>💡 Engineering Solution</h5>
          <p>Engineered an end-to-end web-based PPDB platform to digitalize applicant registrations, manage participant data verification, streamline administrative selection, and provide geographic visibility through interactive Leaflet.js maps.</p>
        </div>
      </div>

      <h4>💻 Technical Highlights & Features:</h4>
      <ul>
        <li><strong>Full-Stack Architecture:</strong> Clean PHP backend handling database interactions, form validations, document status management, and automated administrative reports.</li>
        <li><strong>GIS Location Visualization:</strong> Integrated Leaflet.js with OpenStreetMap to calculate and display coordinates, helping parents easily locate schools and understand zoning proximity.</li>
        <li><strong>Administrative Dashboard:</strong> Secure management portal for school staff to review applicant dossiers, verify prerequisites, and publish admission quotas in real time.</li>
      </ul>

      <div class="case-box" style="margin-top: 14px;">
        <h5>📈 Key Deliverables:</h5>
        <p>Simplified the entire admission cycle for students, parents, and administrative staff with zero manual paper overhead.</p>
        <p style="margin-top: 8px;"><a href="https://github.com/alyakhairunnisa1303/website_ppdb_sd" target="_blank" rel="noopener noreferrer" style="color: var(--green-leaf); font-weight: 700; text-decoration: underline;">➔ View GitHub Repository (alyakhairunnisa1303/website_ppdb_sd)</a></p>
      </div>
    `
  },
  'peminjaman-uks': {
    badge: '🏥 Facility Inventory & Borrowing System',
    title: 'Peminjaman Fasilitas UKS (Facility Borrowing System)',
    meta: 'Role: Developer • Stack: PHP Native, MySQL, PDO, HTML, CSS, JavaScript, SweetAlert2',
    content: `
      <img src="assets/images/project_uks.png" class="modal-project-img" onclick="openLightbox(this.src, 'Peminjaman Fasilitas UKS — PHP Native & SweetAlert2')" alt="Peminjaman UKS Screenshot">
      <div class="project-case-grid">
        <div class="case-box">
          <h5>🎯 Operational Bottleneck</h5>
          <p>UKS (School Health Unit) medical equipment and room facilities were tracked using handwritten physical logbooks, causing lost medical devices, unrecorded returns, and administrative delays.</p>
        </div>
        <div class="case-box">
          <h5>💡 Digital Transformation</h5>
          <p>Built a comprehensive web management system that digitalizes inventory tracking, item requests, return verification, document uploads, and administrative transaction auditing.</p>
        </div>
      </div>

      <h4>💻 Technical Implementation:</h4>
      <ul>
        <li><strong>Secure Data Layer:</strong> PHP Native with PDO (PHP Data Objects) and prepared statements to ensure full protection against SQL injection vulnerabilities.</li>
        <li><strong>Borrowing & Approval Workflow:</strong> User registration and authentication, real-time facility inventory status, borrowing submissions, and document/proof upload handling.</li>
        <li><strong>Interactive Feedback:</strong> Integrated SweetAlert2 dialogs for intuitive approval confirmations, deletion prompts, and transaction alerts.</li>
        <li><strong>Administrative Inventory Management:</strong> Automated transaction ledger tracking borrow durations, overdue alerts, and facility availability history.</li>
      </ul>

      <div class="case-box" style="margin-top: 14px;">
        <h5>📈 Results:</h5>
        <p>Streamlined the equipment loan process and organized facility records with 100% accountability.</p>
        <p style="margin-top: 8px;"><a href="https://github.com/alyakhairunnisa1303/website_peminjaman" target="_blank" rel="noopener noreferrer" style="color: var(--pink-deep); font-weight: 700; text-decoration: underline;">➔ View GitHub Repository (alyakhairunnisa1303/website_peminjaman)</a></p>
      </div>
    `
  },
  'padu-padan': {
    badge: '👗 Interactive Digital Wardrobe',
    title: 'Padu Padan — Wardrobe Planner',
    meta: 'Interactive web application • Digital wardrobe and outfit planning',
    content: `
      <img src="assets/images/project_wardobe.png" class="modal-project-img" onclick="openLightbox(this.src, 'Padu Padan — Interactive Wardrobe & Outfit Planner')" alt="Padu Padan wardrobe and outfit planner screenshot">
      <div class="project-case-grid">
        <div class="case-box">
          <h5>🎯 The Challenge</h5>
          <p>Planning a complete outfit can be difficult when clothing options are spread across different categories and occasions.</p>
        </div>
        <div class="case-box">
          <h5>💡 The Solution</h5>
          <p>Padu Padan brings outfit planning into an interactive wardrobe, where users can combine clothing by category and choose looks for casual, formal, or party occasions.</p>
        </div>
      </div>

      <h4>✨ Product Highlights:</h4>
      <ul>
        <li>Browse and mix clothing items across wardrobe categories.</li>
        <li>Build a complete look and review the selected outfit in a summary.</li>
        <li>Choose an occasion and save favorite outfit combinations.</li>
      </ul>
    `
  }
};

function initProjectShowcase() {
  const modal = document.getElementById('project-modal');
  const backdrop = document.getElementById('project-modal-backdrop');
  const closeBtn = document.getElementById('project-modal-close-btn');
  const doneBtn = document.getElementById('project-modal-done-btn');

  const modalBadge = document.getElementById('project-modal-badge');
  const modalTitle = document.getElementById('project-modal-title');
  const modalMeta = document.getElementById('project-modal-meta');
  const modalContent = document.getElementById('project-modal-content');
  let modalTrigger = null;

  function openProjectModal(key) {
    const data = projectDatabase[key];
    if (!data) return;

    modalTrigger = document.activeElement;
    playChimeSound();
    if (modalBadge) modalBadge.textContent = data.badge;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalMeta) modalMeta.textContent = data.meta;
    if (modalContent) modalContent.innerHTML = data.content;

    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }
    if (closeBtn) closeBtn.focus();
    updateModalScrollLock();
  }

  // Expose globally for inline onclick handlers
  window.openProjectModal = openProjectModal;

  function closeProjectModal() {
    playPopSound(420);
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
    updateModalScrollLock();
    if (modalTrigger && typeof modalTrigger.focus === 'function') modalTrigger.focus();
  }

  document.addEventListener('click', (e) => {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    const filterBtn = target.closest('.project-filter-btn');
    if (filterBtn) {
      e.preventDefault();
      playPopSound(520);
      document.querySelectorAll('.project-filter-btn').forEach(b => b.classList.remove('active'));
      filterBtn.classList.add('active');

      const filter = filterBtn.getAttribute('data-filter');
      document.querySelectorAll('.project-showcase-card').forEach((card) => {
        const catList = (card.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || catList.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
      return;
    }

    const openBtn = target.closest('.open-project-btn');
    if (openBtn) {
      e.preventDefault();
      const projKey = openBtn.getAttribute('data-project');
      openProjectModal(projKey);
      return;
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
  if (doneBtn) doneBtn.addEventListener('click', closeProjectModal);
  if (backdrop) backdrop.addEventListener('click', closeProjectModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeProjectModal();
    }
  });
}

/* ==========================================================================
   6. ARTICLE PREVIEW MODAL (Tech Papers & Engineering Essays)
   ========================================================================== */

const articleDatabase = {
  'kmipn-award': {
    badge: '🏆 National Honors & Awards • KMIPN',
    title: '2nd Winner Hackathon Challenge & Silver Medalist at KMIPN Awards 2026',
    meta: 'Kompetisi Mahasiswa Informatika Politeknik Nasional • Padang & National Stage • 2026',
    content: `
      <div class="modal-cert-preview-wrap">
        <img src="assets/images/cert_kmipn.png" class="modal-cert-img" onclick="openLightbox(this.src, 'KMIPN 2026 — 2nd Winner Hackathon & Silver Medalist')" alt="KMIPN 2026 Certificate">
        <div class="modal-cert-hint">🔍 Click certificate to enlarge</div>
      </div>

      <h4>About KMIPN & Achievement</h4>
      <p>Kompetisi Mahasiswa Informatika Politeknik Nasional (KMIPN) is the premier national-level informatics championship among polytechnic institutions across Indonesia. Competing alongside top polytechnic developers nationwide, Alya Khairunnisa achieved dual honors:</p>
      
      <ul>
        <li><strong>2nd Winner — Hackathon Challenge Category:</strong> Rapid prototype engineering, end-to-end full-stack implementation, and live product defense under intense time constraints.</li>
        <li><strong>Silver Medal — KMIPN Awards 2026:</strong> Recognized for exceptional software engineering rigor, innovation in education technology, and impactful technical presentation.</li>
      </ul>

      <blockquote>"Engineering VocaLearn under competition pressure proved the power of clean architectural separation: a solid FastAPI asynchronous backend paired with a nimble Flutter mobile client."</blockquote>

      <h4>Key Competencies Demonstrated:</h4>
      <ul>
        <li>Rapid REST API prototyping and JWT authentication integration.</li>
        <li>Bayesian Knowledge Tracing (BKT) competency modeling for adaptive learning.</li>
        <li>Dual LLM orchestration (OpenAI and Google Gemini AI) for contextual student assistance.</li>
      </ul>
    `
  },
  'cert-huawei': {
    badge: '☁️ Cloud Architecture Certification',
    title: 'Huawei ICT Academy HCIA-Cloud Service V3.5 and V5.5',
    meta: 'Huawei ICT Academy • Professional Cloud Certification',
    content: `
      <div class="modal-cert-preview-wrap">
        <img src="assets/images/cert_huawei.png" class="modal-cert-img" onclick="openLightbox(this.src, 'Huawei HCIA-Cloud Service V3.5 & V5.5')" alt="Huawei HCIA-Cloud Certificate">
        <div class="modal-cert-hint">🔍 Click certificate to enlarge</div>
      </div>

      <h4>Certification Overview</h4>
      <p>Certified in enterprise cloud infrastructure, virtualization technologies, and distributed cloud computing services through the official Huawei ICT Academy.</p>

      <h4>Core Competencies & Cloud Services Covered:</h4>
      <ul>
        <li><strong>Compute & Virtualization:</strong> Elastic Cloud Server (ECS), Auto Scaling, and image management.</li>
        <li><strong>Storage Architecture:</strong> Elastic Volume Service (EVS), Object Storage Service (OBS), and Scalable File Service (SFS).</li>
        <li><strong>Virtual Networking:</strong> Virtual Private Cloud (VPC), Elastic IP (EIP), NAT Gateway, and security group rule orchestration.</li>
        <li><strong>Management & High Availability:</strong> Cloud Eye monitoring, Identity and Access Management (IAM), and fault-tolerant architecture design.</li>
      </ul>
    `
  },
  'cert-redhat': {
    badge: '🐧 Enterprise Linux Administration',
    title: 'Red Hat System Administration I (RH124) - Version 8.2',
    meta: 'Red Hat Inc. • Enterprise Linux Systems',
    content: `
      <div class="modal-cert-preview-wrap">
        <img src="assets/images/cert_redhat.png" class="modal-cert-img" onclick="openLightbox(this.src, 'Red Hat System Administration I (RH124) v8.2')" alt="Red Hat RH124 Certificate">
        <div class="modal-cert-hint">🔍 Click certificate to enlarge</div>
      </div>

      <h4>Certification Overview</h4>
      <p>Official course completion and certification for Red Hat Enterprise Linux (RHEL 8.2), establishing foundational enterprise sysadmin and server infrastructure proficiencies.</p>

      <h4>Technical Proficiencies:</h4>
      <ul>
        <li><strong>Command Line & Shell Automation:</strong> Advanced Bash scripting, standard I/O redirection, pipes, and text-processing utilities (grep, sed, awk).</li>
        <li><strong>Process & Service Control:</strong> Controlling system services and daemons via systemctl, analyzing log files via journalctl.</li>
        <li><strong>Storage & File Systems:</strong> Managing local storage partitions, logical volumes (LVM), and permissions (POSIX permissions, ACLs, umask).</li>
        <li><strong>Network & Security:</strong> Configuring network interfaces, firewall-cmd rules, SSH key pairs, and secure remote server management.</li>
      </ul>
    `
  },
  'bkt-ai': {
    badge: '🧠 AI & Engineering Architecture',
    title: 'Bayesian Knowledge Tracing (BKT) and Adaptive AI Recommendation in VocaLearn',
    meta: 'VocaLearn Adaptive Engine • Python, FastAPI & LLMs',
    content: `
      <h4>Architecture Overview</h4>
      <p>How VocaLearn dynamically adjusts vocational learning materials to each student's competency level in real time using probabilistic algorithms and generative AI.</p>

      <blockquote>"Adaptive learning isn't just about showing random quizzes — it's about computing the hidden probability of skill mastery and scaffolding content accordingly."</blockquote>

      <h4>Engineering Workflow:</h4>
      <ul>
        <li><strong>BKT Competency Engine:</strong> Models latent student understanding using 4 parameters (prior knowledge $P(L_0)$, transition probability $P(T)$, slip probability $P(S)$, and guess probability $P(G)$) to update student mastery probabilities after each response.</li>
        <li><strong>FastAPI Async Pipeline:</strong> Low-latency API processing evaluating response streams asynchronously without blocking student interactions.</li>
        <li><strong>LLM Augmentation:</strong> Invoking Google Gemini and OpenAI to generate contextualized vocational explanations, diagnostic hints, and personalized study roadmaps.</li>
      </ul>
    `
  },
  'osis-experience': {
    badge: '🤝 Organizational Leadership',
    title: 'Coordinator for Academic, Arts and Athletics Achievement Development',
    meta: 'OSIS SMA Negeri 9 Padang • Padang, Indonesia • July 2020 - May 2022',
    content: `
      <h4>Leadership Role & Scope</h4>
      <p>Served as Coordinator for Academic, Arts and Athletics Achievement Development at OSIS SMA Negeri 9 Padang, leading talent programs, student mentorship, and large-scale school events.</p>

      <h4>Key Contributions & Milestones:</h4>
      <ul>
        <li><strong>Student Development Guidance:</strong> Mentored and guided fellow students based on their individual talents and academic interests.</li>
        <li><strong>Achievement Support:</strong> Coordinated programs and coaching sessions supporting academic competitions and extracurricular excellence.</li>
        <li><strong>Event Management:</strong> Organized recurring school events, including regular arts performances (pentas seni) and inter-class tournaments, overseeing committee logistics, budgeting, and stage coordination.</li>
      </ul>
    `
  }
};

function initArticleModal() {
  const modal = document.getElementById('article-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');
  const doneBtn = document.getElementById('modal-done-btn');

  const modalBadge = document.getElementById('modal-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalMeta = document.getElementById('modal-meta');
  const modalContent = document.getElementById('modal-content');

  const readButtons = document.querySelectorAll('.read-preview-btn');
  let modalTrigger = null;

  function openArticle(key) {
    const data = articleDatabase[key];
    if (!data) return;

    modalTrigger = document.activeElement;
    playChimeSound();
    if (modalBadge) modalBadge.textContent = data.badge;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalMeta) modalMeta.textContent = data.meta;
    if (modalContent) modalContent.innerHTML = data.content;

    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }
    if (closeBtn) closeBtn.focus();
    updateModalScrollLock();
  }

  function closeModal() {
    playPopSound(420);
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
    updateModalScrollLock();
    if (modalTrigger && typeof modalTrigger.focus === 'function') modalTrigger.focus();
  }

  readButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const articleKey = btn.getAttribute('data-article');
      openArticle(articleKey);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (doneBtn) doneBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. VIRTUAL SCRAPBOOK CORKBOARD GUESTBOOK
   ========================================================================== */

function initGuestbook() {
  const form = document.getElementById('guestbook-form');
  const notesContainer = document.getElementById('corkboard-notes');
  const radioPills = document.querySelectorAll('.radio-pill');
  const storageKey = 'alya_it_guestbook_notes';
  const allowedPins = ['🌸', '💻', '✨', '🍵', '⚡'];
  const allowedColors = ['note-yellow', 'note-pink', 'note-green', 'note-blue'];
  const allowedTilts = ['tilt-1', 'tilt-2', 'tilt-3'];

  radioPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      playPopSound(500);
      radioPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  if (!form || !notesContainer) return;

  let savedNotes = [];
  try {
    const storedNotes = localStorage.getItem(storageKey);
    const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];
    if (!Array.isArray(parsedNotes)) throw new TypeError('Stored guestbook data must be an array.');
    savedNotes = parsedNotes.filter(isValidStoredNote).slice(0, 15);
    if (savedNotes.length !== parsedNotes.length) {
      console.warn('Some invalid saved guestbook notes were ignored.');
    }
  } catch (error) {
    console.error('Could not load saved guestbook notes:', error);
    showToast('Saved guestbook notes could not be loaded.', '⚠️');
  }
  savedNotes.forEach((note) => renderStickyNote(note, false));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    playChimeSound();

    const nameInput = document.getElementById('visitor-name');
    const msgInput = document.getElementById('visitor-msg');
    const selectedPin = form.querySelector('input[name="pin-icon"]:checked');
    if (!nameInput || !msgInput) {
      console.error('Guestbook form is missing its name or message field.');
      return;
    }

    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();
    const pin = selectedPin ? selectedPin.value : '💻';

    if (!name || !msg) return;

    const newNote = {
      name,
      msg,
      pin,
      time: 'Just now',
      colorClass: getRandomStickyColor(),
      tiltClass: getRandomTilt()
    };

    renderStickyNote(newNote, true);

    savedNotes.unshift(newNote);
    try {
      localStorage.setItem(storageKey, JSON.stringify(savedNotes.slice(0, 15)));
    } catch (error) {
      console.error('Could not save the guestbook note:', error);
      showToast('Note posted, but could not be saved in this browser.', '⚠️');
      return;
    }

    form.reset();
    showToast('Your note was pinned to the corkboard! 📌', '💻');
  });

  function isValidStoredNote(note) {
    return Boolean(
      note &&
      typeof note === 'object' &&
      typeof note.name === 'string' &&
      note.name.length <= 30 &&
      typeof note.msg === 'string' &&
      note.msg.length <= 180 &&
      allowedPins.includes(note.pin) &&
      typeof note.time === 'string' &&
      note.time.length <= 40 &&
      allowedColors.includes(note.colorClass) &&
      allowedTilts.includes(note.tiltClass)
    );
  }

  function renderStickyNote(note, prepend = true) {
    const card = document.createElement('div');
    card.className = `cork-sticky ${allowedColors.includes(note.colorClass) ? note.colorClass : 'note-pink'} ${allowedTilts.includes(note.tiltClass) ? note.tiltClass : 'tilt-1'}`;

    const pin = document.createElement('div');
    pin.className = 'cork-pin';
    pin.textContent = allowedPins.includes(note.pin) ? note.pin : '💻';

    const message = document.createElement('p');
    message.className = 'cork-text';
    message.textContent = `"${note.msg}"`;

    const author = document.createElement('div');
    author.className = 'cork-author';
    author.textContent = `— ${note.name}`;

    const time = document.createElement('div');
    time.className = 'cork-time';
    time.textContent = note.time || 'Recently';

    card.append(pin, message, author, time);

    if (prepend && notesContainer.firstChild) {
      notesContainer.insertBefore(card, notesContainer.firstChild);
    } else {
      notesContainer.appendChild(card);
    }
  }

  function getRandomStickyColor() {
    const colors = ['note-yellow', 'note-pink', 'note-green', 'note-blue'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function getRandomTilt() {
    const tilts = ['tilt-1', 'tilt-2', 'tilt-3'];
    return tilts[Math.floor(Math.random() * tilts.length)];
  }
}

/* ==========================================================================
   8. INTERACTIVE CHECKLIST & TO-DO
   ========================================================================== */

function initInteractiveTodo() {
  const checkboxes = document.querySelectorAll('.todo-item input[type="checkbox"]');
  checkboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      playPopSound(cb.checked ? 620 : 400);

      const allChecked = Array.from(checkboxes).every((c) => c.checked);
      if (allChecked) {
        playChimeSound();
        showToast('All developer sprint checklist items completed! 🚀', '🎉');
      }
    });
  });
}

/* ==========================================================================
   9. CLIPBOARD HELPERS & TOAST NOTIFICATIONS
   ========================================================================== */

function initClipboardHelpers() {
  const copyBtns = document.querySelectorAll('.copy-mini-btn');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        if (!navigator.clipboard || !navigator.clipboard.writeText) {
          showToast('Clipboard access requires HTTPS or localhost.', '⚠️');
          return;
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
          playPopSound(600);
          showToast(`Copied: ${textToCopy}`, '📋');
        }).catch((error) => {
          console.error('Could not copy text to the clipboard:', error);
          showToast('Failed to copy', '⚠️');
        });
      }
    });
  });
}

function showToast(message, icon = '🌸') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  const iconElement = document.createElement('span');
  iconElement.textContent = icon;
  const messageElement = document.createElement('span');
  messageElement.textContent = message;
  toast.append(iconElement, messageElement);

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

function initKeyboardClickTargets() {
  document.querySelectorAll('[onclick]:not(button):not(a)').forEach((element) => {
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        element.click();
      }
    });
  });
}

/* ==========================================================================
   10. IMAGE LIGHTBOX
   ========================================================================== */

function initLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  const backdrop = document.getElementById('lightbox-backdrop');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  let lightboxTrigger = null;

  if (!lightbox) return;

  function openLightbox(src, caption) {
    lightboxTrigger = document.activeElement;
    if (lightboxImg) lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    updateModalScrollLock();
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    updateModalScrollLock();
    if (lightboxTrigger && typeof lightboxTrigger.focus === 'function') lightboxTrigger.focus();
    setTimeout(() => {
      if (lightboxImg) lightboxImg.src = '';
    }, 350);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Expose globally for inline onclick handlers
  window.openLightbox = openLightbox;
}

function updateModalScrollLock() {
  const openModal = document.querySelector('[aria-modal="true"][aria-hidden="false"]');
  document.body.style.overflow = openModal ? 'hidden' : '';
}
