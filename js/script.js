const ThemeToggle = document.getElementById('ThemeToggle');
const ThemeIcon = ThemeToggle?.querySelector('.Icon');
const MenuToggle = document.getElementById('MenuToggle');
const Body = document.body;
const Sections = document.querySelectorAll('.Section');
const NavAnchors = document.querySelectorAll('.NavLink');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setTheme(theme) {
    Body.classList.remove('DarkTheme', 'LightTheme');
    Body.classList.add(theme);
    localStorage.setItem('theme', theme);

    if (ThemeIcon) {
        ThemeIcon.innerHTML = theme === 'DarkTheme' ? '&#9728;' : '&#9790;';
    }

    ThemeToggle?.setAttribute('aria-label', theme === 'DarkTheme' ? 'Switch to light theme' : 'Switch to dark theme');
}

setTheme(localStorage.getItem('theme') || 'DarkTheme');

ThemeToggle?.addEventListener('click', () => {
    setTheme(Body.classList.contains('DarkTheme') ? 'LightTheme' : 'DarkTheme');
});

MenuToggle?.addEventListener('click', () => {
    const isOpen = Body.classList.toggle('MenuOpen');
    MenuToggle.setAttribute('aria-expanded', String(isOpen));
});

NavAnchors.forEach(anchor => {
    anchor.addEventListener('click', () => {
        Body.classList.remove('MenuOpen');
        MenuToggle?.setAttribute('aria-expanded', 'false');
    });
});

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('Show');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.18 });

Sections.forEach((section, index) => {
    section.classList.add('Hidden');
    section.style.setProperty('--RevealDelay', `${Math.min(index, 4) * 45}ms`);
    revealObserver.observe(section);
});

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        }

        NavAnchors.forEach(anchor => {
            anchor.classList.toggle('Active', anchor.getAttribute('href') === `#${entry.target.id}`);
        });
    });
}, {
    rootMargin: '-42% 0px -50% 0px',
    threshold: 0
});

Sections.forEach(section => navObserver.observe(section));

const TypeText = ['Full Stack Engineer', 'Realtime Systems Builder', 'Problem Solver', 'Product-Minded Engineer'];
const HeroSubtitle = document.querySelector('.HeroSubtitle');
let TextIndex = 0;
let CharIndex = 0;
let IsDeleting = false;

function typeHeroText() {
    if (!HeroSubtitle || prefersReducedMotion) {
        return;
    }

    const currentText = TypeText[TextIndex];
    HeroSubtitle.textContent = IsDeleting
        ? currentText.substring(0, CharIndex - 1)
        : currentText.substring(0, CharIndex + 1);

    CharIndex += IsDeleting ? -1 : 1;
    HeroSubtitle.classList.add('TypingCursor');

    if (!IsDeleting && CharIndex === currentText.length) {
        IsDeleting = true;
        setTimeout(typeHeroText, 1600);
        return;
    }

    if (IsDeleting && CharIndex === 0) {
        IsDeleting = false;
        TextIndex = (TextIndex + 1) % TypeText.length;
        setTimeout(typeHeroText, 420);
        return;
    }

    setTimeout(typeHeroText, IsDeleting ? 60 : 105);
}

typeHeroText();

if (window.emailjs) {
    emailjs.init('tw6lznwmEtZe_Dw2j');
}

const ContactForm = document.getElementById('ContactForm');

ContactForm?.addEventListener('submit', function (event) {
    event.preventDefault();

    const btn = this.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Sending...';
    btn.disabled = true;

    const userName = document.getElementById('Name').value;
    const userEmail = document.getElementById('Email').value;
    const userMessage = document.getElementById('Message').value;
    const serviceID = 'service_3cqq8xk';
    const templateID = 'template_mesblie';
    const templateParams = {
        name: userName,
        user_name: userName,
        user_email: userEmail,
        message: `${userMessage}\n\n----------------\nSender Email: ${userEmail}`
    };

    const resetButton = (text = originalText) => {
        btn.innerText = text;
        btn.disabled = false;
    };

    if (!window.emailjs) {
        resetButton();
        openMailFallback(userName, userEmail, userMessage);
        return;
    }

    emailjs.send(serviceID, templateID, templateParams)
        .then(() => {
            btn.innerText = 'Sent!';
            showModal(true, 'Message Sent!', "Thanks for reaching out. I'll get back to you shortly.");
            this.reset();
            setTimeout(() => resetButton(), 3000);
        })
        .catch(err => {
            console.error('EmailJS Error:', err);
            resetButton();
            openMailFallback(userName, userEmail, userMessage);
        });
});

const Modal = document.getElementById('EmailModal');
const ModalTitle = document.getElementById('ModalTitle');
const ModalMessage = document.getElementById('ModalMessage');
const SuccessIcon = document.getElementById('SuccessIcon');
const ErrorIcon = document.getElementById('ErrorIcon');
const CloseModalBtn = document.getElementById('CloseModal');

function showModal(isSuccess, title, message) {
    ModalTitle.textContent = title;
    ModalMessage.textContent = message;
    SuccessIcon.classList.remove('Active');
    ErrorIcon.classList.remove('Active');

    if (isSuccess) {
        SuccessIcon.classList.add('Active');
        ModalTitle.style.color = 'var(--AccentColor)';
    } else {
        ErrorIcon.classList.add('Active');
        ModalTitle.style.color = '#ff5d5d';
    }

    Modal.classList.add('Active');
    Modal.classList.remove('Hidden');
}

function openMailFallback(userName, userEmail, userMessage) {
    showModal(false, 'Redirecting...', 'Email service is busy. Opening your default mail client...');

    const destEmail = 'amirhamdy450@gmail.com';
    const subject = `Portfolio Contact: ${userName}`;
    const body = `Name: ${userName}\nEmail: ${userEmail}\n\nMessage:\n${userMessage}`;

    setTimeout(() => {
        window.location.href = `mailto:${destEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }, 1200);
}

function closeModal() {
    Modal.classList.remove('Active');
}

CloseModalBtn?.addEventListener('click', closeModal);

Modal?.addEventListener('click', event => {
    if (event.target === Modal) {
        closeModal();
    }
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        Body.classList.remove('MenuOpen');
        MenuToggle?.setAttribute('aria-expanded', 'false');
        closeModal();
    }
});
