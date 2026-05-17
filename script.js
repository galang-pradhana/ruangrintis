document.addEventListener('DOMContentLoaded', () => {
  // Force scroll to top on refresh
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  gsap.registerPlugin(ScrollTrigger);

  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
    gsap.to(follower, { x: e.clientX - 15, y: e.clientY - 15, duration: 0.3 });
  });

  // Loader
  const tl = gsap.timeline();
  // ── Hero word split + stagger reveal ──────────────
  function splitHeroWords() {
    document.querySelectorAll('.hero-h1 > span').forEach(line => {
      const nodes = Array.from(line.childNodes);
      let html = '';
      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent.trim().split(/\s+/).forEach(word => {
            html += `<span class="w-wrap"><span class="w-word">${word}</span></span><span class="w-sp"> </span>`;
          });
        } else if (node.nodeName === 'EM') {
          // Keep entire em word as ONE unit — preserves outline styling
          html += `<span class="w-wrap"><em class="w-word">${node.innerHTML}</em></span>`;
        }
      });
      line.innerHTML = html;
      line.style.overflow = 'visible';
    });
    gsap.set('.w-word', { yPercent: 115 });
  }

  splitHeroWords();

  tl.to(".loader-logo", { rotationY: 360, duration: 1.5, ease: "power2.inOut", repeat: -1 })
    .to(".loader-bar", { width: "100%", duration: 2, ease: "expo.inOut" }, 0)
    .to("#loader", { yPercent: -100, duration: 1.2, ease: "expo.inOut" })
    .call(() => {
      gsap.to('.w-word', {
        yPercent: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: 'expo.out'
      });
    });



  // Nav Reveal on Scroll
  ScrollTrigger.create({
    start: "top -100",
    onUpdate: (self) => {
      if (self.scroll() > 100) {
        document.getElementById('nav').classList.add('visible');
      } else {
        document.getElementById('nav').classList.remove('visible');
      }
    }
  });


  // Portfolio Carousel Drag Logic
  const carousel = document.getElementById('port-carousel');
  const track = document.querySelector('.port-track');
  let isDown = false;
  let startX;
  let scrollLeft;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.classList.add('active');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  carousel.addEventListener('mouseleave', () => {
    isDown = false;
  });
  carousel.addEventListener('mouseup', () => {
    isDown = false;
  });
  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2.5; // Adjusted sensitivity
    carousel.scrollLeft = scrollLeft - walk;
  });

  // Carousel Buttons
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');

  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: 840, behavior: 'smooth' });
  });
  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -840, behavior: 'smooth' });
  });

  // Services & Why Us Animation (Synced Style)
  const revealItems = [
    { selector: '.srv-card', x: 0, y: 100 },
    { selector: '.why-item', x: 50, y: 0 }
  ];

  revealItems.forEach(group => {
    const elements = gsap.utils.toArray(group.selector);
    gsap.set(elements, { opacity: 0, y: group.y, x: group.x }); // Set initial state via JS

    elements.forEach((item) => {
      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 95%",
          toggleActions: "play none none reverse"
        },
        x: 0,
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "expo.out"
      });
    });
  });

  // Reveal Text Animation for Section Headers
  const splitHeaders = gsap.utils.toArray('.section-h, .section-title, .why-content h2');
  splitHeaders.forEach(header => {
    const text = header.innerText;
    header.innerHTML = text.split(' ').map(word => `<span style="display:inline-block; overflow:hidden;"><span style="display:inline-block;">${word}&nbsp;</span></span>`).join('');
    
    gsap.from(header.querySelectorAll('span span'), {
      scrollTrigger: {
        trigger: header,
        start: "top 95%",
      },
      yPercent: 100,
      duration: 1,
      stagger: 0.1,
      ease: "expo.out"
    });
  });

  gsap.from(".testi-card", {
    scrollTrigger: { trigger: ".testi-grid", start: "top 60%" },
    y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out"
  });

  // FAQ Accordion Toggle Interaction
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const trigger = item.querySelector(".faq-trigger");
    const content = item.querySelector(".faq-content");
    
    trigger.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      
      // Close other open FAQ items to keep layout clean
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active");
          const otherContent = otherItem.querySelector(".faq-content");
          const otherTrigger = otherItem.querySelector(".faq-trigger");
          otherTrigger.setAttribute("aria-expanded", "false");
          otherContent.setAttribute("aria-hidden", "true");
          
          gsap.to(otherContent, {
            height: 0,
            duration: 0.5,
            ease: "power3.inOut"
          });
        }
      });
      
      // Toggle current item state
      if (isActive) {
        item.classList.remove("active");
        trigger.setAttribute("aria-expanded", "false");
        content.setAttribute("aria-hidden", "true");
        
        gsap.to(content, {
          height: 0,
          duration: 0.5,
          ease: "power3.inOut"
        });
      } else {
        item.classList.add("active");
        trigger.setAttribute("aria-expanded", "true");
        content.setAttribute("aria-hidden", "false");
        
        const inner = content.querySelector(".faq-content-inner");
        gsap.to(content, {
          height: inner.offsetHeight,
          duration: 0.5,
          ease: "power3.inOut"
        });
      }
    });
  });

  // FAQ Section Entrance Animations using ScrollTrigger
  gsap.from("#faq .section-h", {
    scrollTrigger: { trigger: "#faq", start: "top 85%" },
    y: 40, duration: 1, ease: "expo.out"
  });
  
  gsap.from("#faq .hero-desc", {
    scrollTrigger: { trigger: "#faq", start: "top 85%" },
    y: 25, duration: 1, delay: 0.1, ease: "expo.out"
  });
  
  gsap.from(".faq-item", {
    scrollTrigger: { trigger: ".faq-list", start: "top 92%" },
    y: 25, duration: 0.7, stagger: 0.07, ease: "expo.out"
  });

  // ── Hamburger Mobile Menu ──────────────────────
  const navToggle  = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mmLinks    = document.querySelectorAll('.mm-link');
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    gsap.fromTo(mmLinks,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'expo.out', delay: 0.1 }
    );
  }

  function closeMenu() {
    menuOpen = false;
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    gsap.to(mmLinks, { opacity: 0, y: 20, duration: 0.3, stagger: 0.04, ease: 'expo.in' });
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
    mmLinks.forEach(link => link.addEventListener('click', closeMenu));
  }

  // Footer reveal
  gsap.from(".foot-col", {
    scrollTrigger: { trigger: "#footer", start: "top 90%" },
    y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out"
  });
});
