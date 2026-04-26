const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navbar = document.querySelector(".navbar");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

const revealTargets = document.querySelectorAll(
  ".section-heading, .glass-card, .project-image, .hero-metrics li, .cta-panel"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("reveal", "is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  revealTargets.forEach((element) => {
    if (
      element.closest(".hero-copy") ||
      element.closest(".page-hero-copy") ||
      element.classList.contains("hero-visual") ||
      element.classList.contains("hero-media")
    ) {
      return;
    }

    element.classList.add("reveal");
    revealObserver.observe(element);
  });
}

if (navbar) {
  const syncNavbarState = () => {
    const isScrolled = window.scrollY > 18;
    navbar.style.transform = isScrolled ? "translateY(0.15rem)" : "translateY(0)";
    navbar.style.borderColor = isScrolled ? "rgba(79, 209, 197, 0.2)" : "rgba(255, 255, 255, 0.08)";
    navbar.style.background = isScrolled ? "rgba(7, 21, 47, 0.84)" : "rgba(7, 21, 47, 0.68)";
    navbar.style.boxShadow = isScrolled ? "0 18px 40px rgba(3, 11, 28, 0.32)" : "none";
  };

  syncNavbarState();
  window.addEventListener("scroll", syncNavbarState, { passive: true });
}

const heroRotatorText = document.querySelector(".hero-rotator-text");
const homeHeroVideo = document.querySelector("#home-hero-video");
const homeHeroVideoPrimary = document.querySelector("#home-hero-video-primary");
const homeHeroVideoSecondary = document.querySelector("#home-hero-video-secondary");

if (heroRotatorText) {
  const heroSlides = [
    {
      text: "Innovating the Future with Smart Technology",
      poster: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
      ariaLabel: "Developers coding on laptops",
      sources: [
        "https://www.pexels.com/download/video/34704446/",
        "https://www.pexels.com/download/video/11274330/"
      ]
    },
    {
      text: "We build digital systems with clarity and long-term thinking",
      poster: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      ariaLabel: "Software developers coding at their workstations",
      sources: [
        "https://www.pexels.com/download/video/8266177/",
        "https://www.pexels.com/download/video/34704446/"
      ]
    },
    {
      text: "Work where strategy, design, and engineering come together",
      poster: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
      ariaLabel: "Nighttime software development workspace",
      sources: [
        "https://www.pexels.com/download/video/34818829/",
        "https://www.pexels.com/download/video/8266177/"
      ]
    },
    {
      text: "Let us build something strong together",
      poster: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      ariaLabel: "Developers coding together",
      sources: [
        "https://www.pexels.com/download/video/34704446/",
        "https://www.pexels.com/download/video/11274330/"
      ]
    }
  ];

  let heroMessageIndex = 0;
  let heroRotationTimer = null;
  let heroIsAnimating = false;

  const renderHeroMessage = (message, state) => {
    const words = message.split(" ");
    heroRotatorText.textContent = "";
    heroRotatorText.classList.remove("is-entering", "is-leaving");
    if (state) {
      heroRotatorText.classList.add(state);
    }

    words.forEach((word, index) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "hero-rotator-word";
      wordSpan.textContent = word;
      if (state === "is-entering") {
        wordSpan.style.animationDelay = `${index * 0.12}s`;
      }
      if (state === "is-leaving") {
        wordSpan.style.animationDelay = `${index * 0.08}s`;
      }
      heroRotatorText.appendChild(wordSpan);
    });
  };

  const syncHeroVideo = (slide) => {
    if (!homeHeroVideo || !homeHeroVideoPrimary || !homeHeroVideoSecondary) return;

    homeHeroVideo.classList.add("is-swapping");
    homeHeroVideo.poster = slide.poster;
    homeHeroVideo.setAttribute("aria-label", slide.ariaLabel);
    homeHeroVideoPrimary.src = slide.sources[0];
    homeHeroVideoSecondary.src = slide.sources[1];
    homeHeroVideo.load();

    const playVideo = () => {
      homeHeroVideo.classList.remove("is-swapping");
      const playAttempt = homeHeroVideo.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(() => {});
      }
    };

    if (homeHeroVideo.readyState >= 2) {
      playVideo();
    } else {
      homeHeroVideo.onloadeddata = () => {
        homeHeroVideo.onloadeddata = null;
        playVideo();
      };
    }
  };

  renderHeroMessage(heroSlides[heroMessageIndex].text, "");

  heroRotationTimer = window.setInterval(() => {
    if (heroIsAnimating) return;
    heroIsAnimating = true;

    renderHeroMessage(heroSlides[heroMessageIndex].text, "is-leaving");

    window.setTimeout(() => {
      heroMessageIndex = (heroMessageIndex + 1) % heroSlides.length;
      renderHeroMessage(heroSlides[heroMessageIndex].text, "is-entering");
      syncHeroVideo(heroSlides[heroMessageIndex]);

      window.setTimeout(() => {
        heroRotatorText.classList.remove("is-entering");
        heroIsAnimating = false;
      }, 900);
    }, 650);
  }, 4000);
}

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const messageField = contactForm.querySelector('textarea[name="message"]');
  const nameField = contactForm.querySelector('input[name="name"]');
  const emailField = contactForm.querySelector('input[name="email"]');
  const sendOptions = contactForm.querySelector(".send-options");
  const sendMethodInputs = contactForm.querySelectorAll('input[name="sendMethod"]');

  const toggleSendOptions = () => {
    if (!messageField || !sendOptions) return;

    const hasMessage = messageField.value.trim().length > 0;
    sendOptions.hidden = !hasMessage;

    if (!hasMessage) {
      sendMethodInputs.forEach((input) => {
        input.checked = false;
      });
    }
  };

  if (messageField) {
    messageField.addEventListener("input", toggleSendOptions);
    toggleSendOptions();
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = contactForm.querySelector("button");
    const selectedMethod = contactForm.querySelector('input[name="sendMethod"]:checked');
    if (!button || !messageField) return;

    const name = nameField ? nameField.value.trim() : "";
    const email = emailField ? emailField.value.trim() : "";
    const message = messageField.value.trim();

    if (!message) {
      messageField.focus();
      return;
    }

    if (!selectedMethod) {
      if (sendOptions) {
        sendOptions.hidden = false;
      }
      window.alert("Choose WhatsApp or Email before sending your message.");
      return;
    }

    const originalText = button.textContent;
    const composedMessage = [
      name ? `Name: ${name}` : "",
      email ? `Email: ${email}` : "",
      "",
      `Message: ${message}`
    ]
      .filter(Boolean)
      .join("\n");

    let destination = "";

    if (selectedMethod.value === "whatsapp") {
      destination = `https://wa.me/254700000000?text=${encodeURIComponent(composedMessage)}`;
    } else {
      destination = `mailto:veltrixtechnologies.co.ke@gmail.com?subject=${encodeURIComponent("New project inquiry from website")}&body=${encodeURIComponent(composedMessage)}`;
    }

    button.textContent = "Opening...";
    button.disabled = true;
    window.location.href = destination;

    window.setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      contactForm.reset();
      if (sendOptions) {
        sendOptions.hidden = true;
      }
    }, 1800);
  });
}
 // Projects Page Navigation Functionality
(function() {
  // Project Data Store
  const projectsData = {
    "business-platform": {
      title: "Business Landing Platform",
      description: "A high-conversion marketing hub built for a B2B software startup. The platform features dynamic sections, optimized load times, and immersive storytelling that increased demo requests by 37% within 3 months.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
      tech: ["React", "Framer Motion", "Tailwind CSS", "Headless CMS"],
      outcome: "✅ 37% increase in qualified leads • 99 Lighthouse performance score • Fully responsive design."
    },
    "mobile-booking": {
      title: "Mobile Booking App",
      description: "An end-to-end hospitality booking app with real-time availability, biometric login, and push notifications. Designed for boutique hotels, reducing booking friction and enabling direct guest communication.",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80",
      tech: ["React Native", "Node.js", "MongoDB", "Stripe Connect", "Firebase Push"],
      outcome: "🚀 Launch partner saw 52% faster booking completion • 28% increase in direct reservations within first 6 months."
    },
    "analytics-dashboard": {
      title: "Analytics Dashboard",
      description: "Interactive dashboard for operations teams: visualize KPIs, anomaly detection, and exportable reports. Custom widgets and drag-and-drop layout empower business leaders to monitor critical metrics in real time.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      tech: ["Vue.js", "D3.js", "Express", "PostgreSQL", "WebSockets"],
      outcome: "📊 Reduced reporting time by 70% • Real-time data sync • Adopted by 4 enterprise clients."
    }
  };

  // DOM Elements
  const modal = document.getElementById('projectModal');
  const detailTitle = document.getElementById('detailTitle');
  const detailImage = document.getElementById('detailImage');
  const detailDescription = document.getElementById('detailDescription');
  const techStackContainer = document.getElementById('techStackContainer');
  const detailOutcome = document.getElementById('detailOutcome');
  const closeBtn = document.querySelector('.close-detail');
  const backBtn = document.getElementById('backToProjectsBtn');

  // Helper: Open project detail
  function openProjectDetail(projectKey) {
    const project = projectsData[projectKey];
    if (!project || !modal) return;
    
    detailTitle.innerText = project.title;
    detailDescription.innerText = project.description;
    if (detailImage) {
      detailImage.style.backgroundImage = `url('${project.image}')`;
      detailImage.style.backgroundSize = "cover";
      detailImage.style.backgroundPosition = "center";
    }
    if (techStackContainer) {
      techStackContainer.innerHTML = project.tech.map(tech => `<span>${tech}</span>`).join('');
    }
    if (detailOutcome) detailOutcome.innerText = project.outcome;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Update URL hash for deep linking
    if (history.pushState) {
      history.pushState({ project: projectKey }, project.title, `#project/${projectKey}`);
    }
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    if (window.location.hash.includes('#project/')) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
  }

  // Attach click listeners to project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    const projectId = card.getAttribute('data-project');
    if (projectId) {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        openProjectDetail(projectId);
      });
      
      const linkInside = card.querySelector('.card-link-trigger');
      if (linkInside) {
        linkInside.addEventListener('click', (e) => {
          e.stopPropagation();
          openProjectDetail(projectId);
        });
      }
    }
  });

  // Modal close handlers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backBtn) backBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Handle browser back/forward navigation
  window.addEventListener('popstate', (event) => {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#project/')) {
      if (modal && modal.classList.contains('active')) closeModal();
      return;
    }
    const projectKey = hash.replace('#project/', '');
    if (projectsData[projectKey] && modal && !modal.classList.contains('active')) {
      openProjectDetail(projectKey);
    }
  });

  // If URL contains project hash on load, open automatically
  if (window.location.hash && window.location.hash.startsWith('#project/')) {
    const initialKey = window.location.hash.replace('#project/', '');
    if (projectsData[initialKey]) {
      setTimeout(() => {
        openProjectDetail(initialKey);
      }, 100);
    }
  }

  // Mobile navigation toggle
  const navToggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-links');
  if (navToggleBtn && navMenu) {
    navToggleBtn.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
      navMenu.classList.toggle('open');
      this.setAttribute('aria-expanded', expanded);
    });
  }

  // Video autoplay fallback
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.play().catch(e => console.log("Video autoplay prevented"));
  }

  console.log('✅ Projects page ready — Click any project card to view details');
})();