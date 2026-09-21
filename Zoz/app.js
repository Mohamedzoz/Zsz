/**
 * ZOZ.DEV - Interactive Engine & Living Application Logic
 * Author: Mohamed E. Abdelrehem (Zoz)
 * Features: Ambient Particle Canvas, Bilingual Engine (AR/EN), Web Audio Synthesizer,
 *           Interactive Project Simulators, Interactive Terminal CLI, and Reactive UI.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. STATE & AUDIO SYNTHESIZER (Web Audio API)
  // ==========================================================================
  const state = {
    currentLang: localStorage.getItem('zooz_lang') || 'ar',
    soundEnabled: localStorage.getItem('zooz_sound') !== 'false',
    currentProject: 'aeterna',
    audioCtx: null
  };

  function initAudio() {
    if (!state.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      state.audioCtx = new AudioCtx();
    }
  }

  function playSound(type = 'click') {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!state.audioCtx) return;
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }

      const ctx = state.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'beep') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'terminal') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(450, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    } catch (e) {
      // Audio context policy fallback
    }
  }

  // Audio Toggle Button
  const soundToggleBtn = document.getElementById('soundToggle');
  function updateSoundBtnUI() {
    if (soundToggleBtn) {
      soundToggleBtn.innerHTML = state.soundEnabled 
        ? '<i class="fa-solid fa-volume-high text-emerald"></i>' 
        : '<i class="fa-solid fa-volume-xmark text-dim"></i>';
    }
  }
  if (soundToggleBtn) {
    updateSoundBtnUI();
    soundToggleBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem('zooz_sound', state.soundEnabled);
      updateSoundBtnUI();
      if (state.soundEnabled) playSound('click');
      showToast(state.soundEnabled 
        ? (state.currentLang === 'ar' ? 'تم تفعيل المؤثرات الصوتية' : 'Audio FX Enabled')
        : (state.currentLang === 'ar' ? 'تم كتم الصوت' : 'Audio FX Muted')
      );
    });
  }

  // ==========================================================================
  // 2. BILINGUAL LOCALIZATION (AR / EN)
  // ==========================================================================
  const translations = {
    ar: {
      'nav.status': 'ONLINE',
      'nav.home': 'الرئيسية',
      'nav.metrics': 'الإنجازات',
      'nav.projects': 'المشروعات',
      'nav.skills': 'التقنيات',
      'nav.terminal': 'المحطة (CLI)',
      'nav.experience': 'المسار المهني',
      'nav.cta': 'تواصل معي',
      'hero.badge': 'هندسة نظم مؤسسية • أتمتة عمليات • تحليل بيانات متقدم',
      'hero.greeting': 'أهلاً، أنا',
      'hero.role': 'Senior Systems Architect & Automation Engineer',
      'hero.subtitle': 'متخصص في هندسة النظم الرقمية الضخمة ومنصات الـ ERP المتكاملة، وتصميم خطوط أتمتة ذكية وروبوتات RPA تعمل 24/7 بدون توقف، مع خبرة عميقة في تدقيق عمليات الاتصالات وإدارة الموارد (WFM) وحسابات الـ SLA والـ MTTR الدقيقة.',
      'hero.ctaProjects': 'استكشف مشروعاتي',
      'hero.ctaTerminal': 'تجربة المحطة البرمجية',
      'hero.ctaWhatsapp': 'واتساب مباشر',
      'hero.stackLabel': 'الركائز الأساسية:',
      'metrics.ticketsTitle': 'تذكرة وعملية مفحوصة بدقة',
      'metrics.ticketsDesc': 'تحليل خوارزمي دقيق لفترات الـ Hold والـ Closed-to-Open وحسابات الـ MTTR بالثواني.',
      'metrics.slaTitle': 'دقة مؤشرات الـ SLA والـ KPIs',
      'metrics.slaDesc': 'تحقيق أعلى معايير الجودة ومطابقة شفتات المهندسين وقواعد بيانات العاملين بنسبة 100%.',
      'metrics.erpTitle': 'دورة الإنتاج المتكاملة (Aeterna ERP)',
      'metrics.erpDesc': 'تتبع لحظي من التعاقد والتصميم حتى التجميع والتركيب مع تقييد جغرافي GPS للتبصيم.',
      'metrics.rpaTitle': 'أنظمة مراقبة مستقلة دون انقطاع',
      'metrics.rpaDesc': 'روبوتات فحص خلفي صامتة (Headless) وتنبيهات فورية على تليجرام وإشعارات صوتية لحظية.',
      'projects.tag': 'معرض المشروعات القيادية',
      'projects.title': 'حلول وأنظمة تم بناؤها لإدارة العمليات المعقدة',
      'projects.subtitle': 'مشاريع حقيقية تعمل في بيئات عمل حية وتخدم منشآت كبرى ومؤسسات اتصالات وخدمات جماهيرية.',
      'projects.filterAll': 'كل المشروعات (All)',
      'projects.filterErp': 'أنظمة المنشآت والـ ERP',
      'projects.filterTelecom': 'الاتصالات والعمليات (WFM)',
      'projects.filterAutomation': 'الأتمتة وروبوتات RPA',
      'projects.filterSaas': 'منصات SaaS وتطبيقات الموبايل',
      'projects.viewLiveSim': 'تشغيل المحاكي التفاعلي',
      'projects.viewSpecs': 'تفاصيل المعمارية والمحاكي',
      'skills.tag': 'المهارات والترسانة التقنية',
      'skills.title': 'الأدوات المعمارية التي أصنع بها الحلول',
      'skills.subtitle': 'مزيج متكامل يجمع بين هندسة النظم الضخمة، قواعد البيانات المتقدمة، والروبوتات البرمجية الذكية.',
      'skills.catBackend': 'هندسة النظم والبنية التحتية',
      'skills.catData': 'هندسة وقواعد البيانات',
      'skills.catRpa': 'الأتمتة والروبوتات البرمجية',
      'skills.catTelecom': 'عمليات الاتصالات وإدارة الموارد',
      'terminal.tag': 'المحطة البرمجية الحية',
      'terminal.title': 'Interactive System Console',
      'terminal.subtitle': 'جرب استكشاف النظام برمجياً عبر سطر الأوامر التفاعلي، أو اضغط على أحد الأوامر السريعة بالأسفل.',
      'terminal.quickCmds': 'أوامر سريعة:',
      'experience.tag': 'المسار والخبرات العملية',
      'experience.title': 'رحلة تراكم الخبرات وبناء الحلول الرقمية',
      'exp.role1': 'Senior Operations Analytics & WFM Systems Specialist',
      'exp.desc1': 'قيادة تطوير وتدقيق أنظمة الجداول والشفتات لقطاعات الدعم الفني، بناء خوارزميات التدقيق الآلي لقواعد بيانات الموظفين، تحليل تذاكر الدعم بـ MSSQL و Python وتحديد فترات التوقف والحل بالثواني لرفع دقة الـ SLA لـ 99.8%.',
      'exp.role2': 'Lead Systems Architect & Founder',
      'exp.desc2': 'تأسيس وهندسة نظام Aeterna ERP السحابي من الصفر، ابتكار نظام التتبع ذو الـ 8 مراحل لخطوط الإنتاج والتوريد، ونظام التبصيم بالرصد الجغرافي GPS Geofencing، مع إدارة متكاملة للمحاسبة والمخازن والصلاحيات.',
      'exp.role3': 'Automation & RPA Engineer',
      'exp.desc3': 'تصميم روبوتات المراقبة الصامتة على مدار الساعة (24/7 Headless Bots) لمنصات الدعم والـ CRM، ربطها بأنظمة التنبيه اللحظي عبر Telegram Bot API وتطوير إضافات المتصفح Chrome Extensions لمراقبة البلاغات الحرجة.',
      'exp.role4': 'Full-Stack SaaS & Mobile App Developer',
      'exp.desc4': 'تطوير منصة تعليمية متكاملة وتطبيق أندرويد للهواتف الذكية (APK) لإدارة شؤون الأطفال والطلاب وأولياء الأمور والحسابات المالية والتتبع الطبي للحالات اليومية.',
      'contact.tag': 'ابدأ العمل معي',
      'contact.title': 'هل لديك نظام معقد، مشروع ERP، أو ترغب في أتمتة عملياتك؟',
      'contact.subtitle': 'أنا متاح دائماً للتعاون في بناء معمارية الأنظمة، تطوير برمجيات الـ ERP المتخصصة، هندسة البيانات، وتطوير روبوتات الأتمتة المخصصة.',
      'contact.whatsappTitle': 'محادثة واتساب فورية',
      'contact.emailTitle': 'البريد الإلكتروني',
      'contact.locationTitle': 'الموقع الحالي',
      'contact.locationVal': 'القاهرة، مصر (Cairo, Egypt)',
      'contact.formTitle': 'أرسل رسالة سريعة ومباشرة',
      'contact.sendViaWhatsapp': 'إرسال عبر الواتساب فوراً',
      'contact.sendViaEmail': 'إرسال عبر الإيميل',
      'footer.builtWith': 'صُمم وطُوّر بمعايير الفخامة والسرعة الفائقة • جاهز للنشر على Vercel',
      'modal.tabSim': 'المحاكي التفاعلي الحي',
      'modal.tabArch': 'المعمارية والمخطط',
      'modal.tabCode': 'نماذج الأكواد والـ Logic',
      'modal.close': 'إغلاق'
    },
    en: {
      'nav.status': 'ONLINE',
      'nav.home': 'Home',
      'nav.metrics': 'Metrics',
      'nav.projects': 'Projects',
      'nav.skills': 'Skills & Stack',
      'nav.terminal': 'Terminal CLI',
      'nav.experience': 'Experience',
      'nav.cta': 'Get In Touch',
      'hero.badge': 'Enterprise Systems • Robotic Automation • Advanced Data Analytics',
      'hero.greeting': 'Hi, I am',
      'hero.role': 'Senior Systems Architect & Automation Engineer',
      'hero.subtitle': 'Specialized in architecting high-scale enterprise platforms and ERP solutions, engineering 24/7 autonomous RPA bots, and auditing mission-critical telecom operations, WFM schedules, and millisecond-accurate SLA / MTTR metrics.',
      'hero.ctaProjects': 'Explore Projects',
      'hero.ctaTerminal': 'Try Terminal CLI',
      'hero.ctaWhatsapp': 'Direct WhatsApp',
      'hero.stackLabel': 'Core Foundation:',
      'metrics.ticketsTitle': 'Tickets & Operations Audited',
      'metrics.ticketsDesc': 'Algorithmic auditing of on-hold and closed-to-open intervals with sub-second MTTR calculation precision.',
      'metrics.slaTitle': 'SLA & KPI Performance Accuracy',
      'metrics.slaDesc': '100% headcount reconciliation against active roster databases and shift rotation rules.',
      'metrics.erpTitle': '8-Stage Production Lifecycle (Aeterna)',
      'metrics.erpDesc': 'End-to-end manufacturing and site progression tracking with GPS Geofencing attendance validation.',
      'metrics.rpaTitle': 'Autonomous 24/7 Watchers & Bots',
      'metrics.rpaDesc': 'Headless browser bots with Telegram API alerts and instant multi-channel audio notifications.',
      'projects.tag': 'Flagship Engineering Showcase',
      'projects.title': 'Systems Built to Power Complex Mission-Critical Operations',
      'projects.subtitle': 'Real production software serving large enterprises, telecom infrastructure, and high-stakes operations.',
      'projects.filterAll': 'All Projects',
      'projects.filterErp': 'ERP & Enterprise',
      'projects.filterTelecom': 'Telecom & WFM Ops',
      'projects.filterAutomation': 'Automation & RPA',
      'projects.filterSaas': 'SaaS & Mobile Apps',
      'projects.viewLiveSim': 'Launch Interactive Simulator',
      'projects.viewSpecs': 'Architecture & Live Demo',
      'skills.tag': 'Technical Arsenal',
      'skills.title': 'The Architectural Stack Powering Solutions',
      'skills.subtitle': 'A synthesis of robust enterprise backends, advanced SQL data structures, and autonomous bots.',
      'skills.catBackend': 'Systems & Backend Architecture',
      'skills.catData': 'Data Engineering & Analytics',
      'skills.catRpa': 'Robotic Process Automation (RPA)',
      'skills.catTelecom': 'Telecom Operations & WFM',
      'terminal.tag': 'Interactive CLI',
      'terminal.title': 'Interactive System Console',
      'terminal.subtitle': 'Explore the portfolio through an interactive command line, or click the quick command chips below.',
      'terminal.quickCmds': 'Quick Commands:',
      'experience.tag': 'Career Journey',
      'experience.title': 'Engineering Milestones & Proven Impact',
      'exp.role1': 'Senior Operations Analytics & WFM Systems Specialist',
      'exp.desc1': 'Leading the automation and audit architecture for shift schedules, reconciliations, and ticket performance metrics for thousands of telecom personnel, ensuring 99.8% SLA adherence.',
      'exp.role2': 'Lead Systems Architect & Founder',
      'exp.desc2': 'Architected Aeterna ERP from the ground up: 8-stage production pipeline, GPS Geofencing smart attendance, automated multi-account treasury, and live client reporting portal.',
      'exp.role3': 'Automation & RPA Engineer',
      'exp.desc3': 'Engineered headless 24/7 monitoring systems for CRM ticket feeds, integrated multi-threaded Telegram Bot alerts, and built Chrome extensions for urgent escalations.',
      'exp.role4': 'Full-Stack SaaS & Mobile App Developer',
      'exp.desc4': 'Engineered full-featured EdTech academy SaaS platform and companion Android APK for child care records, medicine alerts, attendance tracking, and parent billing.',
      'contact.tag': 'Initiate Collaboration',
      'contact.title': 'Have a complex system, ERP requirement, or need process automation?',
      'contact.subtitle': 'Available for high-impact system architecture, bespoke ERP engineering, data pipeline design, and custom RPA bots.',
      'contact.whatsappTitle': 'Instant WhatsApp Chat',
      'contact.emailTitle': 'Direct Email',
      'contact.locationTitle': 'Current Base',
      'contact.locationVal': 'Cairo, Egypt',
      'contact.formTitle': 'Quick Dispatch Message',
      'contact.sendViaWhatsapp': 'Dispatch via WhatsApp',
      'contact.sendViaEmail': 'Send via Email',
      'footer.builtWith': 'Engineered with pristine performance and luxury aesthetics • Ready for Vercel',
      'modal.tabSim': 'Interactive Simulator',
      'modal.tabArch': 'Architecture & Blueprint',
      'modal.tabCode': 'Code & Logic Insights',
      'modal.close': 'Close'
    }
  };

  function applyLanguage(lang) {
    state.currentLang = lang;
    localStorage.setItem('zooz_lang', lang);
    const html = document.documentElement;

    if (lang === 'ar') {
      html.setAttribute('lang', 'ar');
      html.setAttribute('dir', 'rtl');
      document.getElementById('langCodeLabel').textContent = 'EN';
    } else {
      html.setAttribute('lang', 'en');
      html.setAttribute('dir', 'ltr');
      document.getElementById('langCodeLabel').textContent = 'AR';
    }

    const dict = translations[lang] || translations.ar;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
  }

  const langToggleBtn = document.getElementById('langToggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const nextLang = state.currentLang === 'ar' ? 'en' : 'ar';
      playSound('click');
      applyLanguage(nextLang);
      showToast(nextLang === 'ar' ? 'تم التحويل إلى اللغة العربية' : 'Switched to English');
    });
  }
  applyLanguage(state.currentLang);

  // ==========================================================================
  // 3. AMBIENT PARTICLE CANVAS (Cyber Web Effect)
  // ==========================================================================
  const canvas = document.getElementById('ambientCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const mouse = { x: width / 2, y: height / 2, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const spotlight = document.getElementById('cursorSpotlight');
    if (spotlight) {
      spotlight.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 1.8 + 0.8;
      this.color = Math.random() > 0.6 ? '#10b981' : (Math.random() > 0.3 ? '#06b6d4' : '#8b5cf6');
      this.baseAlpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // React to mouse
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 2.5;
        this.y -= (dy / dist) * force * 2.5;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.baseAlpha;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 14000), 75);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#10b981';
          ctx.globalAlpha = (1 - dist / 110) * 0.12;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  // Navbar Scroll Glow
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      playSound('click');
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }

  // ==========================================================================
  // 4. PROJECT FILTERS
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // 5. INTERACTIVE TERMINAL (CLI ENGINE)
  // ==========================================================================
  const terminalBody = document.getElementById('terminalOutput');
  const terminalInput = document.getElementById('terminalInput');
  const terminalSendBtn = document.getElementById('terminalSendBtn');
  const terminalChips = document.querySelectorAll('.t-chip');

  const terminalCommands = {
    help: () => `
<span class="text-emerald">⚡ AVAILABLE COMMANDS:</span>
  <span class="cmd-highlight">whoami</span>       - Display Mohamed's engineering profile & title
  <span class="cmd-highlight">projects</span>     - List flagship architecture projects
  <span class="cmd-highlight">skills</span>       - View technical stack & system capabilities
  <span class="cmd-highlight">metrics</span>      - Show operational benchmarks (tickets, SLAs, uptime)
  <span class="cmd-highlight">contact</span>      - Get instant communication channels
  <span class="cmd-highlight">clear</span>        - Clear terminal screen
  <span class="cmd-highlight">sudo hire-zooz</span> - Launch priority recruitment protocol 🚀
`,
    whoami: () => `
<span class="text-cyan">╔══════════════════════════════════════════════════════════════╗</span>
<span class="text-cyan">║</span> <span class="text-white">Mohamed E. Abdelrehem (known as "Zoooz")</span>                    <span class="text-cyan">║</span>
<span class="text-cyan">║</span> Senior Systems Architect, Automation & Data Engineer         <span class="text-cyan">║</span>
<span class="text-cyan">║</span> Location: Cairo, Egypt | Focus: Enterprise ERP & Telecom WFM <span class="text-cyan">║</span>
<span class="text-cyan">║</span> Track Record: 500K+ Tickets Audited, 24/7 Autonomous Bots   <span class="text-cyan">║</span>
<span class="text-cyan">╚══════════════════════════════════════════════════════════════╝</span>
`,
    projects: () => `
<span class="text-emerald">📂 FLAGSHIP PRODUCTION PROJECTS:</span>
1. <span class="text-white">[Aeterna ERP Platform]</span>   - 8-stage manufacturing, GPS Geofencing, multi-tenant cashflow.
2. <span class="text-white">[Telecom Ops WFM Engine]</span> - MSSQL CTE auditing, hold/re-open analysis, Avaya ECH data.
3. <span class="text-white">[Nusuk 24/7 RPA Watcher]</span> - Headless browser ticket scanner + Telegram Bot push alerts.
4. <span class="text-white">[Nile Nursery Platform]</span>  - Full preschool SaaS + Android Mobile App (APK).
5. <span class="text-white">[Daily Operations Engine]</span>- Automated Python Excel & Outlook executive pipelines.

Type <span class="cmd-highlight">demo &lt;project_name&gt;</span> (e.g. 'demo aeterna') to trigger interactive simulator!
`,
    skills: () => `
<span class="text-emerald">🛠️ CORE TECHNICAL STACK:</span>
- <span class="text-cyan">Backend:</span> PHP (Vanilla & Enterprise OOP), REST APIs, RBAC, PWA
- <span class="text-cyan">Databases:</span> Microsoft SQL Server (Advanced CTEs), MySQL, PostgreSQL
- <span class="text-cyan">Automation:</span> Python (Selenium, PyWin32, OpenPyXL, Pandas, SQLAlchemy)
- <span class="text-cyan">Robotics:</span> Telegram Bot API, Headless Browsers, Chrome Extensions (MV3)
- <span class="text-cyan">Telecom:</span> Workforce Management (WFM), Avaya ECH, SLA & MTTR Algorithms
`,
    metrics: () => `
<span class="text-emerald">📊 OPERATIONAL METRICS & IMPACT:</span>
- Tickets Processed:     <span class="text-white">500,000+</span>
- SLA Calculation Delta: <span class="text-white">0-2s (100% logic alignment)</span>
- ERP Stages Governed:   <span class="text-white">8 sequential phases</span>
- Bot Availability:      <span class="text-white">24/7/365 Zero-downtime execution</span>
`,
    contact: () => `
<span class="text-emerald">📬 DIRECT CHANNELS:</span>
- WhatsApp: <a href="https://wa.me/201117442068" target="_blank" style="color:#25d366">+20 111 744 2068</a>
- Email:    <a href="mailto:mohamedzoz31@gmail.com" style="color:#38bdf8">mohamedzoz31@gmail.com</a>
- Status:   <span class="text-emerald">Available for High-Impact Projects & Systems Architecture</span>
`,
    clear: () => {
      terminalBody.innerHTML = '';
      return '';
    },
    'sudo hire-zooz': () => {
      playSound('success');
      setTimeout(() => {
        window.open('https://wa.me/201117442068?text=Hello%20Eng%20Mohamed,%20I%20reviewed%20your%20portfolio%20and%20want%20to%20collaborate!', '_blank');
      }, 1200);
      return `
<span class="text-emerald" style="font-size:1.1rem; font-weight:800;">🚀 [ACCESS GRANTED]: PRIORITY RECRUITMENT PROTOCOL INITIATED!</span>
Connecting directly to Eng. Mohamed's WhatsApp dispatch queue...
Status: 200 OK. Redirecting now!
`;
    }
  };

  function executeTerminalCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    playSound('terminal');

    // Add command line
    const cmdEcho = document.createElement('div');
    cmdEcho.className = 'terminal-line';
    cmdEcho.innerHTML = `<span class="terminal-prompt">zooz@architect:~$</span> <span class="text-white">${rawCmd}</span>`;
    terminalBody.appendChild(cmdEcho);

    // Handle project demo shortcut
    if (cmd.startsWith('demo ')) {
      const proj = cmd.replace('demo ', '').trim();
      const valid = ['aeterna', 'telecom', 'nusuk', 'nursery', 'dailymail', 'sahl'];
      if (valid.includes(proj)) {
        openProjectModal(proj);
        const resp = document.createElement('div');
        resp.className = 'terminal-line text-emerald';
        resp.innerHTML = `Launching interactive simulation for [${proj.toUpperCase()}]... [DONE]`;
        terminalBody.appendChild(resp);
      } else {
        const resp = document.createElement('div');
        resp.className = 'terminal-line text-amber';
        resp.innerHTML = `Unknown project '${proj}'. Choose from: ${valid.join(', ')}`;
        terminalBody.appendChild(resp);
      }
      terminalBody.scrollTop = terminalBody.scrollHeight;
      return;
    }

    // Execute registered command
    const responseFn = terminalCommands[cmd];
    const respDiv = document.createElement('div');
    respDiv.className = 'terminal-line';

    if (responseFn) {
      const output = responseFn();
      if (cmd !== 'clear') {
        respDiv.innerHTML = output;
        terminalBody.appendChild(respDiv);
      }
    } else {
      respDiv.innerHTML = `<span class="text-amber">Command not found: '${rawCmd}'. Type <span class="cmd-highlight">help</span> for valid commands.</span>`;
      terminalBody.appendChild(respDiv);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        executeTerminalCommand(terminalInput.value);
        terminalInput.value = '';
      }
    });
  }

  if (terminalSendBtn && terminalInput) {
    terminalSendBtn.addEventListener('click', () => {
      executeTerminalCommand(terminalInput.value);
      terminalInput.value = '';
    });
  }

  terminalChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeTerminalCommand(cmd);
      }
    });
  });

  // ==========================================================================
  // 6. INTERACTIVE PROJECT MODAL & LIVE SIMULATORS
  // ==========================================================================
  const modal = document.getElementById('projectModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseActionBtn = document.getElementById('modalCloseActionBtn');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const simContainer = document.getElementById('simContainer');
  const archContainer = document.getElementById('archContainer');
  const codeContainer = document.getElementById('codeContainer');

  // Modal Tab Switching
  const modalTabBtns = document.querySelectorAll('.modal-tab-btn');
  modalTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      modalTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      document.querySelectorAll('.modal-tab-content').forEach(content => {
        content.classList.remove('active');
      });

      if (targetTab === 'live-sim') document.getElementById('tabLiveSim').classList.add('active');
      if (targetTab === 'architecture') document.getElementById('tabArchitecture').classList.add('active');
      if (targetTab === 'code-view') document.getElementById('tabCodeView').classList.add('active');
    });
  });

  function closeProjectModal() {
    playSound('click');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalCloseActionBtn) modalCloseActionBtn.addEventListener('click', closeProjectModal);

  // Project Specifications & Interactive Simulators Data
  const projectDatabase = {
    aeterna: {
      tag: 'ENTERPRISE ERP & MANUFACTURING',
      title: 'Aeterna ERP Platform 🏛️',
      simHtml: `
        <div class="sim-box">
          <div class="sim-header">
            <div>
              <h4 style="color:#fff; margin-bottom:0.2rem;"><i class="fa-solid fa-sliders text-emerald"></i> 8-Stage Production Flow Simulator</h4>
              <p style="font-size:0.85rem; color:#94a3b8;">اضغط على أي مرحلة لمحاكاة تقدم أمر الشغل وتحديث نسبة الإنجاز اللحظية:</p>
            </div>
            <div class="sim-badge-live"><span class="pulse-dot"></span> LIVE SIMULATOR</div>
          </div>

          <div class="sim-stage-tracker" id="aeternaStages">
            <div class="stage-node done" data-stage="1"><div class="stage-circle">1</div><span class="stage-title">التعاقد</span></div>
            <div class="stage-node done" data-stage="2"><div class="stage-circle">2</div><span class="stage-title">المعاينة</span></div>
            <div class="stage-node done" data-stage="3"><div class="stage-circle">3</div><span class="stage-title">التصميم</span></div>
            <div class="stage-node current" data-stage="4"><div class="stage-circle">4</div><span class="stage-title">التصنيع</span></div>
            <div class="stage-node" data-stage="5"><div class="stage-circle">5</div><span class="stage-title">التجميع</span></div>
            <div class="stage-node" data-stage="6"><div class="stage-circle">6</div><span class="stage-title">التوريد</span></div>
            <div class="stage-node" data-stage="7"><div class="stage-circle">7</div><span class="stage-title">التركيب</span></div>
            <div class="stage-node" data-stage="8"><div class="stage-circle">8</div><span class="stage-title">التسليم النهائي</span></div>
          </div>

          <div class="sim-action-panel">
            <div style="font-size:0.9rem;">
              <strong>المرحلة الحالية:</strong> <span class="text-emerald" id="stageNameLabel">المرحلة 4: التصنيع وتجهيز الخامات</span><br>
              <strong>نسبة الإنجاز:</strong> <span class="text-cyan font-mono" id="stageProgressLabel">50% Complete</span>
            </div>
            <button class="btn-primary-glow" id="advanceStageBtn"><i class="fa-solid fa-forward-step"></i> تقدم للمرحلة التالية</button>
          </div>

          <!-- GPS Geofence Simulator Widget -->
          <div style="margin-top:1.5rem; padding:1rem; background:rgba(6,182,212,0.06); border:1px solid rgba(6,182,212,0.25); border-radius:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-weight:700; color:#fff;"><i class="fa-solid fa-location-crosshairs text-cyan"></i> نظام التبصيم بالرصد الجغرافي (GPS Geofence)</span>
              <span class="text-cyan" style="font-size:0.8rem; font-family:monospace;">Radius: 100m</span>
            </div>
            <p style="font-size:0.85rem; color:#94a3b8; margin-bottom:0.75rem;">يقوم النظام بحساب المسافة الدقيقة بين الموظف وإحداثيات الموقع لمنع التبصيم الوهمي خارج المنشأة.</p>
            <div style="display:flex; gap:0.75rem;">
              <button class="btn-outline-glow" id="testGpsInsideBtn"><i class="fa-solid fa-building-circle-check text-emerald"></i> تجربة داخل المقر (0m)</button>
              <button class="btn-outline-glow" id="testGpsOutsideBtn"><i class="fa-solid fa-triangle-exclamation text-amber"></i> تجربة خارج النطاق (450m)</button>
            </div>
          </div>
        </div>
      `,
      archHtml: `
        <div style="line-height:1.7; color:#cbd5e1;">
          <h4 class="text-emerald" style="margin-bottom:0.5rem;">🏗️ البنية الهيكلية الهرمية للنظام (System Architecture)</h4>
          <p>يعتمد النظام على بنية هرمية ثلاثية مترابطة تضمن أعلى درجات النزاهة المحاسبية والتشغيلية:</p>
          <ul style="margin:1rem 1.5rem; display:flex; flex-direction:column; gap:0.5rem;">
            <li><strong>العميل (Customer):</strong> الجذر الأساسي، يولد حساب بوابة دخول فورية لمتابعة مراحل تصنيعه ومدفوعاته وصوره.</li>
            <li><strong>المشروع (Project):</strong> يرتبط بالعميل مع إمكانية تعدد المشروعات للعميل الواحد (مطابخ، دريسنج، وحدات تجارية).</li>
            <li><strong>دورة العمليات (Operations):</strong> فواتير، مقبوضات، مصروفات مرتبطة بحسابات الأستاذ العام وسجلات الأنشطة.</li>
            <li><strong>نظام الصلاحيات (RBAC):</strong> فصل كامل بين أدوار الإدارة، المدير التنفيذي، المحاسب، السكرتارية، والمهندس الميداني.</li>
          </ul>
        </div>
      `,
      codeHtml: `
        <pre class="code-snippet" style="background:#060a12; padding:1.25rem; border-radius:8px; border:1px solid #1e293b; color:#38bdf8;"><code>// Aeterna ERP: GPS Distance Verification & RBAC Guard
function verifyGeofenceAttendance($empLat, $empLng, $siteLat, $siteLng, $maxRadiusMeters = 100) {
    $earthRadius = 6371000; // meters
    $dLat = deg2rad($siteLat - $empLat);
    $dLng = deg2rad($siteLng - $empLng);
    
    $a = sin($dLat / 2) * sin($dLat / 2) +
         cos(deg2rad($empLat)) * cos(deg2rad($siteLat)) *
         sin($dLng / 2) * sin($dLng / 2);
    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
    $distance = $earthRadius * $c;

    return [
        'is_within' => ($distance <= $maxRadiusMeters),
        'distance_meters' => round($distance, 1),
        'status' => ($distance <= $maxRadiusMeters) ? 'VERIFIED_ON_PREMISE' : 'FLAGGED_OUTSIDE_RADIUS'
    ];
}</code></pre>
      `
    },

    telecom: {
      tag: 'TELECOM OPERATIONS & WFM ANALYTICS',
      title: 'Telecom Operations & WFM Analytics Engine 📡',
      simHtml: `
        <div class="sim-box">
          <div class="sim-header">
            <div>
              <h4 style="color:#fff; margin-bottom:0.2rem;"><i class="fa-solid fa-calculator text-cyan"></i> حاسبة الـ SLA وفترات التوقف والحل (MTTR Simulator)</h4>
              <p style="font-size:0.85rem; color:#94a3b8;">محاكاة استخراج وتحليل التذاكر واستبعاد فترات التعليق والإغلاقات المؤقتة:</p>
            </div>
            <div class="sim-badge-live"><span class="pulse-dot"></span> LIVE DATA ENGINE</div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:1.25rem;">
            <div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:8px;">
              <span style="font-size:0.8rem; color:#94a3b8;">إجمالي التذاكر المفحوصة (Total Tickets):</span>
              <div style="font-size:1.8rem; font-weight:900; color:#38bdf8; font-family:monospace;">204,890</div>
            </div>
            <div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:8px;">
              <span style="font-size:0.8rem; color:#94a3b8;">نسبة التطابق بالثانية (Accuracy):</span>
              <div style="font-size:1.8rem; font-weight:900; color:#10b981; font-family:monospace;">100.0%</div>
            </div>
          </div>

          <div class="sim-action-panel">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <input type="checkbox" id="excludeHoldCheck" checked style="width:18px; height:18px; cursor:pointer;">
              <label for="excludeHoldCheck" style="font-size:0.9rem; cursor:pointer;">تطبيق استبعاد فترات الـ Hold والـ Closed-Open السابقة للقفلة النهائية</label>
            </div>
            <button class="btn-primary-glow" id="runAuditSimBtn"><i class="fa-solid fa-rotate"></i> إعادة حساب MTTR</button>
          </div>
          <div id="auditResultBox" style="margin-top:1rem; font-family:monospace; font-size:0.85rem; color:#34d399;">
            > Logic Validated: Hold + ReOpen periods matched with 0-2s SQL job interval delta. SLA Score: 99.8%
          </div>
        </div>
      `,
      archHtml: `
        <div style="line-height:1.7; color:#cbd5e1;">
          <h4 class="text-cyan" style="margin-bottom:0.5rem;">📡 هندسة تدقيق العمليات ومطابقة الجداول (WFM Auditing)</h4>
          <p>تم تصميم هذا النظام للتعامل مع بيئة العمليات الضخمة بشركة Telecom Egypt / WE:</p>
          <ul style="margin:1rem 1.5rem; display:flex; flex-direction:column; gap:0.5rem;">
            <li><strong>معالجة التذاكر الضخمة:</strong> استخدام Common Table Expressions (CTEs) لفرز التذاكر المكررة والمغلقة بصورة خاطئة وحساب مدد الفترات بدقة.</li>
            <li><strong>تدقيق قوام الشفتات:</strong> مطابقة فورية بين جداول الإكسيل وقواعد بيانات العاملين (Employess_DB) لكشف الموظفين المستقيلين أو المنتسبين لجروبات أخرى أو المحسوبين في غير موقعهم.</li>
            <li><strong>تكامل Avaya ECH:</strong> استخراج مؤشرات الأداء اللحظية واستقرار مراكز الاتصال.</li>
          </ul>
        </div>
      `,
      codeHtml: `
        <pre class="code-snippet" style="background:#060a12; padding:1.25rem; border-radius:8px; border:1px solid #1e293b; color:#34d399;"><code>-- Core CTE for Precise Ticket SLA & MTTR Calculation
WITH Hold_closed_open AS (
    SELECT DISTINCT [RequestID],
           SUM([Hold_closed_open_time]) AS [hold_closed_open]
    FROM [WorkforceDB_indexed].[dbo].[PSC_Hold_closed_open]
    WHERE creation_time >= DATEFROMPARTS(YEAR(DATEADD(day, -2, GETDATE())), MONTH(DATEADD(day, -2, GETDATE())), 1)
    GROUP BY [RequestID]
),
FilteredTickets AS (
    SELECT k.requestid, k.Final_close,
           IIF(k.closure_reason IN ('Customer Issue','internal network problem'), 'CST side', 'WE Side') AS [Reason],
           COALESCE(h.hold_closed_open, 0) AS [HoldDeduction]
    FROM KPI_Status_RawData k
    LEFT JOIN Hold_closed_open h ON k.RequestID = h.RequestID
    WHERE k.ticket_status = 'Closed'
)
SELECT COUNT(*) AS TotalAudited, AVG(HoldDeduction) AS AvgDeductionSecs FROM FilteredTickets;</code></pre>
      `
    },

    nusuk: {
      tag: 'AUTONOMOUS RPA & BOT ENGINE',
      title: 'Nusuk Masar 24/7 Watcher & RPA Bot 🕋',
      simHtml: `
        <div class="sim-box">
          <div class="sim-header">
            <div>
              <h4 style="color:#fff; margin-bottom:0.2rem;"><i class="fa-solid fa-robot text-emerald"></i> محاكي راصد نُسك الآلي 24/7 (Live Console)</h4>
              <p style="font-size:0.85rem; color:#94a3b8;">شاشة حية لعمليات المسح الخلفي وإطلاق تنبيهات التليجرام الفورية:</p>
            </div>
            <div class="sim-badge-live"><span class="pulse-dot"></span> SCANNING ACTIVE</div>
          </div>

          <div id="nusukConsole" style="background:#030712; padding:1rem; border-radius:6px; font-family:monospace; font-size:0.85rem; height:180px; overflow-y:auto; color:#22c55e; border:1px solid #1f2937; margin-bottom:1rem;">
            [17:34:02] [CORE] Initializing Headless Chrome Engine... [OK]<br>
            [17:34:05] [AUTH] Session authenticated via stored profile cookies.<br>
            [17:34:10] [SCAN] Checking masar.nusuk.sa CRM tickets endpoint...<br>
            [17:34:12] [INFO] Zero new critical escalations detected. Next cycle in 60s.<br>
            [17:34:40] [TELEGRAM] Bot @NusukAlerts_bot heartbeat: ONLINE (Latency: 38ms).
          </div>

          <div class="sim-action-panel">
            <span style="font-size:0.85rem; color:#cbd5e1;">محاكاة اكتشاف بلاغ جديد الآن:</span>
            <button class="btn-primary-glow" id="triggerNusukAlertBtn"><i class="fa-brands fa-telegram"></i> إطلاق بلاغ تجريبي (Test Alert)</button>
          </div>
        </div>
      `,
      archHtml: `
        <div style="line-height:1.7; color:#cbd5e1;">
          <h4 class="text-emerald" style="margin-bottom:0.5rem;">🕋 منظومة المراقبة المستقلة على مدار الساعة</h4>
          <p>تم بناء راصد نُسك ليعمل بشكل مستقل تماماً في الخلفية (Daemon Headless Mode):</p>
          <ul style="margin:1rem 1.5rem; display:flex; flex-direction:column; gap:0.5rem;">
            <li><strong>المتصفح الصامت (Headless Automation):</strong> إدارة جلسات الدخول وحفظ ملفات تعريف الارتباط لمنع الانقطاع.</li>
            <li><strong>التنبيه اللحظي (Telegram Bot API):</strong> إرسال رسائل غنية بالبيانات فورية لهاتف المستخدم عند رصد أي بلاغ جديد مع رابط الفحص المباشر.</li>
            <li><strong>قاعدة البلاغات المعرفة (known_reports.json):</strong> منع تكرار الإشعارات نهائياً لنفس البلاغ.</li>
            <li><strong>إضافة Chrome Extension مساعدة:</strong> تتيح متابعة الحالة بنقرة واحدة من شريط أدوات المتصفح.</li>
          </ul>
        </div>
      `,
      codeHtml: `
        <pre class="code-snippet" style="background:#060a12; padding:1.25rem; border-radius:8px; border:1px solid #1e293b; color:#10b981;"><code># Nusuk Watcher: Autonomous Headless Detection Loop
def poll_nusuk_tickets():
    driver = init_headless_driver()
    known_reports = load_known_reports()
    
    while True:
        driver.get("https://masar.nusuk.sa/protected/crm/list")
        current_tickets = parse_ticket_table(driver.page_source)
        
        for t in current_tickets:
            if t['id'] not in known_reports:
                # Trigger multi-channel alert
                send_telegram_alert(t)
                play_sound_siren()
                known_reports.add(t['id'])
                save_known_reports(known_reports)
                
        time.sleep(CONFIG['check_interval_seconds'])</code></pre>
      `
    },

    nursery: {
      tag: 'EDTECH SAAS & ANDROID MOBILE APP',
      title: 'منصة وتطبيق حضانة النيل الذكية 👶🎓',
      simHtml: `
        <div class="sim-box">
          <div class="sim-header">
            <div>
              <h4 style="color:#fff; margin-bottom:0.2rem;"><i class="fa-solid fa-child text-amber"></i> محاكي السجل اليومي للطفل وبوابة الوالدين</h4>
              <p style="font-size:0.85rem; color:#94a3b8;">تجربة حية لتسجيل الجرعات الطبية، الحضور، وتأكيد الاستلام الآمن:</p>
            </div>
            <div class="sim-badge-live"><span class="pulse-dot" style="background:#f59e0b;"></span> EDTECH ACTIVE</div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem;">
            <div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:8px;">
              <span style="font-size:0.8rem; color:#94a3b8;">اسم الطفل / الفصل:</span>
              <div style="font-size:1.1rem; font-weight:800; color:#fff;">آدم محمد (فصل البراعم 1)</div>
              <span class="text-emerald" style="font-size:0.8rem;">الحالة: حاضر (تم التبصيم 08:15 ص)</span>
            </div>
            <div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:8px;">
              <span style="font-size:0.8rem; color:#94a3b8;">تنبيهات الجرعات الطبية:</span>
              <div style="font-size:1.1rem; font-weight:800; color:#f59e0b;">خافض حرارة (5 مل)</div>
              <span class="text-cyan" style="font-size:0.8rem;">الموعد القادم: 01:30 م (معتمد)</span>
            </div>
          </div>

          <div class="sim-action-panel">
            <span style="font-size:0.85rem; color:#cbd5e1;">محاكاة التحقق من إذن الاستلام الأمني:</span>
            <button class="btn-primary-glow" id="verifyPickupBtn"><i class="fa-solid fa-shield-check"></i> فحص كود الاستلام الآمن</button>
          </div>
        </div>
      `,
      archHtml: `
        <div style="line-height:1.7; color:#cbd5e1;">
          <h4 class="text-amber" style="margin-bottom:0.5rem;">👶 منظومة إدارة الحضانات والمدارس الرقمية</h4>
          <p>تكامل برمجي بين منصة الويب وتطبيق الهاتف الذكي لتوفير الأمان وراحة البال لأولياء الأمور:</p>
          <ul style="margin:1rem 1.5rem; display:flex; flex-direction:column; gap:0.5rem;">
            <li><strong>تطبيق أندرويد مستقل (Android APK):</strong> حزمة مخصصة تعمل بأعلى استقرار للهواتف الذكية مع دعم الإشعارات.</li>
            <li><strong>تتبع الحالة الصحية والجرعات:</strong> سجل دقيق للجرعات الطبية ودرجات الحرارة والتغذية.</li>
            <li><strong>بوابة أولياء الأمور:</strong> متابعة يومية، فواتير إلكترونية، ومعرض الأنشطة والفعاليات.</li>
          </ul>
        </div>
      `,
      codeHtml: `
        <pre class="code-snippet" style="background:#060a12; padding:1.25rem; border-radius:8px; border:1px solid #1e293b; color:#fbbf24;"><code>// Nile Nursery: Secure Child Pickup Verification
public function verifyAuthorizedPickup($childId, $pickupCode, $guardianNationalId) {
    $db = Database::getConnection();
    $stmt = $db->prepare("
        SELECT id, parent_name, authorized_delegates 
        FROM children_registry 
        WHERE id = ? AND security_pickup_token = ?
    ");
    $stmt->execute([$childId, hash('sha256', $pickupCode)]);
    $record = $stmt->fetch();
    
    if ($record) {
        $this->logSecurityEvent("PICKUP_VERIFIED", $childId, "Released to authorized person");
        return ['success' => true, 'timestamp' => date('Y-m-d H:i:s')];
    }
    return ['success' => false, 'error' => 'INVALID_SECURITY_TOKEN'];
}</code></pre>
      `
    },

    dailymail: {
      tag: 'AUTOMATED DATA & REPORTING PIPELINE',
      title: 'محرك التقارير والأتمتة التنفيذي (Daily Operations) ⚡',
      simHtml: `
        <div class="sim-box">
          <div class="sim-header">
            <div>
              <h4 style="color:#fff; margin-bottom:0.2rem;"><i class="fa-solid fa-file-excel text-emerald"></i> محاكي توليد شيتات Excel وإرسال Outlook الآلي</h4>
              <p style="font-size:0.85rem; color:#94a3b8;">محاكاة خط الأتمتة الكامل من سحب البيانات حتى الإرسال التنفيذي:</p>
            </div>
            <div class="sim-badge-live"><span class="pulse-dot"></span> PIPELINE READY</div>
          </div>

          <div id="pipelineLogs" style="background:#030712; padding:1rem; border-radius:6px; font-family:monospace; font-size:0.85rem; height:150px; overflow-y:auto; color:#10b981; border:1px solid #1f2937; margin-bottom:1rem;">
            [07:00:01] Connecting to MSSQL Database (WorkforceDB_indexed)... [CONNECTED]<br>
            [07:00:04] Executing KPI_Status_RawData aggregation queries... [DONE]<br>
            [07:00:08] Building styled Excel tables with OpenPyXL... [DONE]<br>
            [07:00:10] Invoking Outlook Win32 COM dispatch engine... [READY]
          </div>

          <div class="sim-action-panel">
            <span style="font-size:0.85rem; color:#cbd5e1;">محاكاة ضغط زر التشغيل الصباحي:</span>
            <button class="btn-primary-glow" id="runPipelineBtn"><i class="fa-solid fa-paper-plane"></i> تشغيل خط المعالجة الآن</button>
          </div>
        </div>
      `,
      archHtml: `
        <div style="line-height:1.7; color:#cbd5e1;">
          <h4 class="text-emerald" style="margin-bottom:0.5rem;">⚡ خط الأتمتة الخالي من التدخل البشري</h4>
          <p>توفير مئات ساعات العمل سنوياً عبر تحويل الإجراءات الروتينية لعملية أوتوماتيكية متكاملة:</p>
          <ul style="margin:1rem 1.5rem; display:flex; flex-direction:column; gap:0.5rem;">
            <li><strong>استخراج دقيق:</strong> سحب آلي لأحدث تذاكر الدعم ومؤشرات الأداء من خوادم SQL مباشرة.</li>
            <li><strong>تنسيق متقدم:</strong> إنشاء مصنفات عمل Excel بتنسيقات الألوان الرسمية والجداول التلقائية باستخدام OpenPyXL.</li>
            <li><strong>إرسال مؤتمت:</strong> التحكم في برنامج Outlook من خلال Win32 COM لإرسال التقرير اليومي للإدارة العليا.</li>
          </ul>
        </div>
      `,
      codeHtml: `
        <pre class="code-snippet" style="background:#060a12; padding:1.25rem; border-radius:8px; border:1px solid #1e293b; color:#34d399;"><code># Daily Email Pipeline Integration
import win32com.client as win32
from openpyxl import load_workbook

def dispatch_executive_report(excel_path, recipients, subject):
    outlook = win32.Dispatch('outlook.application')
    mail = outlook.CreateItem(0)
    mail.To = "; ".join(recipients)
    mail.Subject = subject
    mail.HTMLBody = "<h3>Dear Management,</h3><p>Attached is the audited daily operations SLA report.</p>"
    mail.Attachments.Add(excel_path)
    mail.Send() # Fully headless dispatch</code></pre>
      `
    },

    sahl: {
      tag: 'MODULAR ENTERPRISE ECOSYSTEM',
      title: 'منظومة حلول Sahl & Fly Beez و Senior Track 🚀',
      simHtml: `
        <div class="sim-box">
          <div class="sim-header">
            <div>
              <h4 style="color:#fff; margin-bottom:0.2rem;"><i class="fa-solid fa-cubes text-violet"></i> مراقب صحة الخدمات المصغرة (Microservices Health)</h4>
              <p style="font-size:0.85rem; color:#94a3b8;">فحص حي ومحاكاة لسرعة استجابة الـ Endpoints والمخازن المؤقتة:</p>
            </div>
            <div class="sim-badge-live"><span class="pulse-dot" style="background:#8b5cf6;"></span> ALL SYSTEMS GREEN</div>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.6rem; margin-bottom:1rem;">
            <div style="display:flex; justify-content:space-between; padding:0.6rem 1rem; background:rgba(255,255,255,0.03); border-radius:6px;">
              <span>Sahl Team Coordination API</span> <span class="text-emerald font-mono">200 OK (14ms)</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding:0.6rem 1rem; background:rgba(255,255,255,0.03); border-radius:6px;">
              <span>Fly Beez Task Gateway</span> <span class="text-emerald font-mono">200 OK (22ms)</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding:0.6rem 1rem; background:rgba(255,255,255,0.03); border-radius:6px;">
              <span>Senior Track Audit Trail Service</span> <span class="text-emerald font-mono">200 OK (18ms)</span>
            </div>
          </div>

          <div class="sim-action-panel">
            <span style="font-size:0.85rem; color:#cbd5e1;">اختبار سلامة التخزين المؤقت:</span>
            <button class="btn-primary-glow" id="pingEndpointsBtn"><i class="fa-solid fa-bolt"></i> فحص سرعة الاستجابة (Ping All)</button>
          </div>
        </div>
      `,
      archHtml: `
        <div style="line-height:1.7; color:#cbd5e1;">
          <h4 class="text-violet" style="margin-bottom:0.5rem;">🚀 معمارية معيارية عالية القابلية للتوسع</h4>
          <p>تصميم بنية مرنة تسمح بإضافة الوحدات الإدارية وتوزيع المهام بكفاءة:</p>
          <ul style="margin:1rem 1.5rem; display:flex; flex-direction:column; gap:0.5rem;">
            <li><strong>تخزين مؤقت عالي الكفاءة:</strong> تسريع استجابة لوحات التحكم وتقليل الحمل على قواعد البيانات المركزية.</li>
            <li><strong>سجلات التدقيق (Audit Trail):</strong> تسجيل وتوثيق أي تعديل على المهام بالموظف والوقت بالثانية.</li>
          </ul>
        </div>
      `,
      codeHtml: `
        <pre class="code-snippet" style="background:#060a12; padding:1.25rem; border-radius:8px; border:1px solid #1e293b; color:#a78bfa;"><code>// Sahl & Fly Beez: High-Speed Cache Wrapper
class ServiceGateway {
    public static function routeRequest($endpoint, $payload) {
        $cacheKey = "api_" . md5($endpoint . serialize($payload));
        if ($cached = CacheEngine::get($cacheKey)) {
            return json_decode($cached, true);
        }
        $response = self::executeCore($endpoint, $payload);
        CacheEngine::set($cacheKey, json_encode($response), 300); // 5 min TTL
        return $response;
    }
}</code></pre>
      `
    }
  };

  function openProjectModal(projectId) {
    const data = projectDatabase[projectId] || projectDatabase.aeterna;
    state.currentProject = projectId;

    playSound('click');

    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    simContainer.innerHTML = data.simHtml;
    archContainer.innerHTML = data.archHtml;
    codeContainer.innerHTML = data.codeHtml;

    // Reset to Sim Tab
    modalTabBtns.forEach(b => b.classList.remove('active'));
    document.querySelector('.modal-tab-btn[data-tab="live-sim"]').classList.add('active');
    document.querySelectorAll('.modal-tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById('tabLiveSim').classList.add('active');

    // Attach Simulator Events
    attachSimulatorEvents(projectId);

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function attachSimulatorEvents(projectId) {
    if (projectId === 'aeterna') {
      let currentStage = 4;
      const stageNames = [
        'المرحلة 1: التعاقد المبدئي وإنشاء ملف العميل',
        'المرحلة 2: المعاينة الميدانية وأخذ المقاسات',
        'المرحلة 3: التصميم الهندسي وخرائط التقطيع',
        'المرحلة 4: التصنيع وتجهيز الخامات',
        'المرحلة 5: التجميع الميكانيكي بالمصنع',
        'المرحلة 6: التوريد لموقع العميل',
        'المرحلة 7: التركيبات والتجهيزات الفنية',
        'المرحلة 8: التسليم النهائي وتوقيع المحضر'
      ];

      const advanceBtn = document.getElementById('advanceStageBtn');
      const stageNodes = document.querySelectorAll('#aeternaStages .stage-node');

      function updateAeternaUI() {
        stageNodes.forEach((node, idx) => {
          const sNum = idx + 1;
          node.classList.remove('done', 'current');
          if (sNum < currentStage) node.classList.add('done');
          if (sNum === currentStage) node.classList.add('current');
        });
        const pct = Math.round((currentStage / 8) * 100);
        document.getElementById('stageNameLabel').textContent = stageNames[currentStage - 1];
        document.getElementById('stageProgressLabel').textContent = `${pct}% Complete`;
      }

      if (advanceBtn) {
        advanceBtn.addEventListener('click', () => {
          playSound('success');
          currentStage = currentStage >= 8 ? 1 : currentStage + 1;
          updateAeternaUI();
          showToast(`تم الانتقال إلى: ${stageNames[currentStage - 1]}`);
        });
      }

      stageNodes.forEach((node, idx) => {
        node.addEventListener('click', () => {
          playSound('click');
          currentStage = idx + 1;
          updateAeternaUI();
        });
      });

      // GPS buttons
      const gpsIn = document.getElementById('testGpsInsideBtn');
      const gpsOut = document.getElementById('testGpsOutsideBtn');
      if (gpsIn) {
        gpsIn.addEventListener('click', () => {
          playSound('success');
          showToast('✅ تم تأكيد التبصيم بنجاح: المسافة 12 متراً (داخل النطاق المصرح)');
        });
      }
      if (gpsOut) {
        gpsOut.addEventListener('click', () => {
          playSound('beep');
          showToast('⚠️ تحذير: التبصيم خارج النطاق (450m) - تم تسجيل تنبيه للمدير العام!');
        });
      }
    }

    if (projectId === 'telecom') {
      const runAuditBtn = document.getElementById('runAuditSimBtn');
      if (runAuditBtn) {
        runAuditBtn.addEventListener('click', () => {
          playSound('success');
          const res = document.getElementById('auditResultBox');
          res.innerHTML = '> Recalculating across 204,890 tickets...<br>> [PASS]: 100% logic alignment verified. Zero SLA violations detected.';
          showToast('تمت إعادة حساب مؤشرات الأداء بنجاح (100% تطابق)');
        });
      }
    }

    if (projectId === 'nusuk') {
      const triggerBtn = document.getElementById('triggerNusukAlertBtn');
      if (triggerBtn) {
        triggerBtn.addEventListener('click', () => {
          playSound('beep');
          const consoleDiv = document.getElementById('nusukConsole');
          const time = new Date().toLocaleTimeString();
          consoleDiv.innerHTML += `<br><span style="color:#ef4444;">[${time}] [ALERT] 🚨 NEW MASAR TICKET DETECTED #94218!</span><br><span style="color:#38bdf8;">[${time}] [TELEGRAM] Dispatching notification to phone... [SENT ✅]</span>`;
          consoleDiv.scrollTop = consoleDiv.scrollHeight;
          showToast('🚨 تم إطلاق تنبيه تجريبي لهاتفك عبر بوت تليجرام!');
        });
      }
    }

    if (projectId === 'nursery') {
      const pickupBtn = document.getElementById('verifyPickupBtn');
      if (pickupBtn) {
        pickupBtn.addEventListener('click', () => {
          playSound('success');
          showToast('🛡️ تم التحقق بنجاح: كود الاستلام سليم ومعتمد ومطابق لبطاقة ولي الأمر');
        });
      }
    }

    if (projectId === 'dailymail') {
      const pipeBtn = document.getElementById('runPipelineBtn');
      if (pipeBtn) {
        pipeBtn.addEventListener('click', () => {
          playSound('success');
          const logDiv = document.getElementById('pipelineLogs');
          const time = new Date().toLocaleTimeString();
          logDiv.innerHTML += `<br>[${time}] Auto-generated 'Husseiny_Report_Daily.xlsx' (18.2 KB)<br>[${time}] Email dispatched to 14 Senior Engineers via Outlook COM!`;
          logDiv.scrollTop = logDiv.scrollHeight;
          showToast('⚡ تم توليد الشيت وإرسال الإيميل التنفيذي بنجاح!');
        });
      }
    }

    if (projectId === 'sahl') {
      const pingBtn = document.getElementById('pingEndpointsBtn');
      if (pingBtn) {
        pingBtn.addEventListener('click', () => {
          playSound('click');
          showToast('⚡ استجابة ممتازة: متوسط زمن الاستجابة لجميع الخدمات 16ms!');
        });
      }
    }
  }

  // Bind project cards buttons
  document.querySelectorAll('.btn-demo-trigger, .open-modal-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const proj = btn.getAttribute('data-project');
      if (proj) openProjectModal(proj);
    });
  });

  // ==========================================================================
  // 7. CONTACT FORM DIRECT SENDER (WhatsApp & Email)
  // ==========================================================================
  const sendWhatsappBtn = document.getElementById('sendViaWhatsappBtn');
  const sendEmailBtn = document.getElementById('sendViaEmailBtn');
  const senderName = document.getElementById('msgSenderName');
  const subjectInput = document.getElementById('msgSubject');
  const bodyInput = document.getElementById('msgBody');

  if (sendWhatsappBtn) {
    sendWhatsappBtn.addEventListener('click', () => {
      playSound('click');
      const name = (senderName.value || 'Someone interested').trim();
      const subj = (subjectInput.value || 'Collaboration Inquiry').trim();
      const body = (bodyInput.value || 'Hello Eng. Mohamed, I would like to discuss a project with you.').trim();

      const text = `*New Inquiry from Zoz Portfolio:*%0A*Name:* ${encodeURIComponent(name)}%0A*Subject:* ${encodeURIComponent(subj)}%0A*Details:* ${encodeURIComponent(body)}`;
      window.open(`https://wa.me/201117442068?text=${text}`, '_blank');
      showToast('جاري تحويل رسالتك إلى واتساب...');
    });
  }

  if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', () => {
      playSound('click');
      const name = (senderName.value || 'Colleague').trim();
      const subj = (subjectInput.value || 'Inquiry from Portfolio').trim();
      const body = (bodyInput.value || 'Hello Eng. Mohamed,').trim();

      const mailtoUrl = `mailto:mohamedzoz31@gmail.com?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent('From: ' + name + '\n\n' + body)}`;
      window.location.href = mailtoUrl;
    });
  }

  // ==========================================================================
  // 8. ANIMATED STATS COUNTER ON SCROLL
  // ==========================================================================
  let countersStarted = false;
  function startCounters() {
    if (countersStarted) return;
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      let count = 0;
      const step = target / 60;

      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          counter.textContent = isDecimal ? target.toFixed(1) : Math.floor(target).toLocaleString();
          clearInterval(timer);
        } else {
          counter.textContent = isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString();
        }
      }, 25);
    });
    countersStarted = true;
  }

  const metricsEl = document.getElementById('metrics');
  if (metricsEl) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        startCounters();
      }
    }, { threshold: 0.3 });
    observer.observe(metricsEl);
  }

  // ==========================================================================
  // 9. TOAST NOTIFICATION HELPER
  // ==========================================================================
  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info text-emerald"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Keyboard shortcut to close modal
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeProjectModal();
    }
  });

});
