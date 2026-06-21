/* app.js – Portfolio Logic */

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ===== REVEAL ON SCROLL =====
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { el.textContent = target; clearInterval(timer); }
      else el.textContent = Math.floor(current);
    }, 30);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// ===== TERMINAL ANIMATION =====
const terminalLines = [
  { type: 'prompt', text: 'whoami' },
  { type: 'output', text: 'kallepalli_satish' },
  { type: 'prompt', text: 'cat skills.json' },
  { type: 'output', text: '{ "languages": ["Python", "C", "Embedded C"],' },
  { type: 'output', text: '  "domains": ["AI", "IoT", "Automation"],' },
  { type: 'output', text: '  "tools": ["Arduino", "VS Code", "GitHub"] }' },
  { type: 'prompt', text: 'python3 plant_care_ai.py' },
  { type: 'success', text: '✓ CNN model loaded successfully' },
  { type: 'success', text: '✓ Disease detection: 97.3% accuracy' },
  { type: 'prompt', text: 'echo "Seeking internship opportunities..."' },
  { type: 'output', text: 'Seeking internship opportunities...' },
  { type: 'prompt', text: 'git status' },
  { type: 'success', text: 'On branch main – ready to build! 🚀' },
];

const terminalBody = document.getElementById('terminal-body');
let lineIndex = 0;
let charIndex = 0;
let isTyping = false;

function getColor(type) {
  if (type === 'prompt') return '<span class="t-prompt">$ </span><span class="t-cmd">';
  if (type === 'success') return '<span class="t-success">';
  return '<span class="t-out">';
}

function typeNextLine() {
  if (lineIndex >= terminalLines.length) {
    lineIndex = 0;
    terminalBody.innerHTML = '';
    setTimeout(typeNextLine, 1500);
    return;
  }
  const line = terminalLines[lineIndex];
  const div = document.createElement('div');
  div.className = 't-line';
  terminalBody.appendChild(div);
  terminalBody.scrollTop = terminalBody.scrollHeight;

  const color = getColor(line.type);
  let displayed = '';
  charIndex = 0;

  const speed = line.type === 'prompt' ? 60 : 20;
  const interval = setInterval(() => {
    displayed += line.text[charIndex];
    div.innerHTML = color + displayed + '</span>';
    charIndex++;
    terminalBody.scrollTop = terminalBody.scrollHeight;
    if (charIndex >= line.text.length) {
      clearInterval(interval);
      lineIndex++;
      const delay = line.type === 'prompt' ? 400 : 150;
      setTimeout(typeNextLine, delay);
    }
  }, speed);
}

// Start terminal after hero reveals
setTimeout(typeNextLine, 1200);

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    const colors = ['139,92,246', '167,139,250', '196,181,253'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();

// Draw connecting lines
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(139,92,246,${0.1 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animate);
}
animate();

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !email || !subject || !message) {
    formStatus.textContent = 'Please fill in all fields.';
    formStatus.className = 'form-status error';
    return;
  }
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
    formStatus.className = 'form-status success';
    form.reset();
    btn.textContent = 'Send Message 🚀';
    btn.disabled = false;
    setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'form-status'; }, 5000);
  }, 1200);
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinkEls.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current ? '#7C3AED' : '';
  });
});

// ===== SKILL TAG HOVER PULSE =====
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    tag.style.transform = 'scale(1.05)';
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.transform = '';
  });
});
