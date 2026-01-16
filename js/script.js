
// Theme Toggle 
const ThemeToggle = document.getElementById('ThemeToggle');
const Body = document.body;

// Check for saved user preference
const SavedTheme = localStorage.getItem('theme');
if (SavedTheme) {
    Body.classList.remove('DarkTheme', 'LightTheme');
    Body.classList.add(SavedTheme);
}

ThemeToggle.addEventListener('click', () => {
    if (Body.classList.contains('DarkTheme')) {
        Body.classList.replace('DarkTheme', 'LightTheme');
        localStorage.setItem('theme', 'LightTheme');
    } else {
        Body.classList.replace('LightTheme', 'DarkTheme');
        localStorage.setItem('theme', 'DarkTheme');
    }
});

// Scroll Animations (Simple Event Listener)
const Sections = document.querySelectorAll('.Section');

// Add .Hidden class initially
Sections.forEach(el => el.classList.add('Hidden'));

function checkScroll() {
    const TriggerBottom = window.innerHeight * 0.8; // Show when element is 80% visible

    Sections.forEach(section => {
        const SectionTop = section.getBoundingClientRect().top;

        if (SectionTop < TriggerBottom) {
            section.classList.add('Show');
        }
    });
}

// Initial check for elements already in view
checkScroll();

// Listen for scroll events
window.addEventListener('scroll', checkScroll);

// Typing Text Effect for Hero Subtitle
const TypeText = ["Full Stack Developer", "Dynamic Solutions", "Problem Solver", "Creative Thinker"];
const HeroSubtitle = document.querySelector('.HeroSubtitle');
let TextIndex = 0;
let CharIndex = 0;
let IsDeleting = false;

function Type() {
    const CurrentText = TypeText[TextIndex];
    if (IsDeleting) {
        HeroSubtitle.textContent = CurrentText.substring(0, CharIndex - 1);
        CharIndex--;
    } else {
        HeroSubtitle.textContent = CurrentText.substring(0, CharIndex + 1);
        CharIndex++;
    }

    HeroSubtitle.classList.add('TypingCursor');

    if (!IsDeleting && CharIndex === CurrentText.length) {
        IsDeleting = true;
        setTimeout(Type, 2000); // Pause at end
    } else if (IsDeleting && CharIndex === 0) {
        IsDeleting = false;
        TextIndex = (TextIndex + 1) % TypeText.length;
        setTimeout(Type, 500); // Pause before new word
    } else {
        setTimeout(Type, IsDeleting ? 100 : 200); // Typing speed
    }
}

// Start typing on load
document.addEventListener('DOMContentLoaded', Type);

// EmailJS Configuration
(function () {
    // Initialize EmailJS with your Public Key
    emailjs.init("tw6lznwmEtZe_Dw2j");
})();

document.getElementById('ContactForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const btn = this.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Sending...';

    // Get input values
    const userName = document.getElementById('Name').value;
    const userEmail = document.getElementById('Email').value;
    const userMessage = document.getElementById('Message').value;

    // Keys
    const serviceID = 'service_3cqq8xk';
    const templateID = 'template_mesblie';

    // Construct params - Appending email to message body
    const templateParams = {
        name: userName, // Mapped to {{name}} in EmailJS template
        user_name: userName,
        user_email: userEmail,
        // Hack to ensure email is in body even if template ignores user_email field
        message: `${userMessage}\n\n----------------\nSender Email: ${userEmail}`
    };

    emailjs.send(serviceID, templateID, templateParams)
        .then(() => {
            btn.innerText = 'Sent!';
            showModal(true, "Message Sent!", "Thanks for reaching out! I'll get back to you shortly.");
            this.reset();
            setTimeout(() => { btn.innerText = originalText; }, 3000);
        }, (err) => {
            btn.innerText = originalText;
            console.error('EmailJS Error:', err);

            // Fallback Strategy
            showModal(false, "Redirecting...", "Email service busy. Opening your default mail client...");

            // Construct Mailto Link
            const destEmail = "amirhamdy450@gmail.com";
            const subject = `Portfolio Contact: ${userName}`;
            const body = `Name: ${userName}\nEmail: ${userEmail}\n\nMessage:\n${userMessage}`;

            setTimeout(() => {
                window.location.href = `mailto:${destEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }, 1500);
        });
});

// Modal Logic
const Modal = document.getElementById('EmailModal');
const ModalTitle = document.getElementById('ModalTitle');
const ModalMessage = document.getElementById('ModalMessage');
const SuccessIcon = document.getElementById('SuccessIcon');
const ErrorIcon = document.getElementById('ErrorIcon');
const CloseModalBtn = document.getElementById('CloseModal');

function showModal(isSuccess, title, message) {
    ModalTitle.textContent = title;
    ModalMessage.textContent = message;

    // Reset Icons
    SuccessIcon.classList.remove('Active');
    ErrorIcon.classList.remove('Active');

    if (isSuccess) {
        SuccessIcon.classList.add('Active');
        ModalTitle.style.color = 'var(--AccentColor)';
    } else {
        ErrorIcon.classList.add('Active');
        ModalTitle.style.color = '#ff4d4d'; // Error Red
    }

    Modal.classList.add('Active');
    Modal.classList.remove('Hidden');
}

CloseModalBtn.addEventListener('click', () => {
    Modal.classList.remove('Active');
});

// Close on outside click
Modal.addEventListener('click', (e) => {
    if (e.target === Modal) {
        Modal.classList.remove('Active');
    }
});
