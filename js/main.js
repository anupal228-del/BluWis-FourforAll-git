// Define global functions first
window.openChat = function () {
    const chatWidget = document.getElementById('chat-widget');
    const chatInput = document.getElementById('chat-input');
    if (chatWidget) {
        chatWidget.classList.add('active');
        chatWidget.style.display = 'flex';
        // Ensure input is focused if it's open
        if (chatInput) setTimeout(() => chatInput.focus(), 300);
    }
};

window.handleOption = function (option) {
    const chatOptions = document.getElementById('chat-options');
    // Remove options after selection to prevent multi-clicking
    if (chatOptions) chatOptions.style.display = 'none';

    // Add User Message
    addUserMessage(getOptionLabel(option));

    // Simulate Bot Thinking
    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();
        const response = getBotResponse(option);
        addBotMessage(response.text);

        // If response has follow-up actions
        if (response.nextAction === 'input') {
            enableInput();
        } else if (response.nextAction === 'reset') {
            // Determine if we should show options again
            setTimeout(() => {
                addBotMessage("Is there anything else I can help you with?");
                if (chatOptions) chatOptions.style.display = 'flex'; // Show options again
            }, 1000);
        }
    }, 800);
};

// Helper functions need to be accessible to handleOption
function addUserMessage(text) {
    const chatBody = document.getElementById('chat-body');
    const chatOptions = document.getElementById('chat-options');
    const div = document.createElement('div');
    div.className = 'message user-message';
    div.innerText = text;
    if (chatBody) {
        if (chatOptions && chatOptions.parentNode === chatBody) {
            chatBody.insertBefore(div, chatOptions);
        } else {
            chatBody.appendChild(div);
        }
        scrollToBottom();
    }
}

function addBotMessage(text) {
    const chatBody = document.getElementById('chat-body');
    const div = document.createElement('div');
    div.className = 'message bot-message';
    div.innerHTML = text;
    if (chatBody) {
        chatBody.appendChild(div);
        scrollToBottom();
    }
}

function showTypingIndicator() {
    const chatBody = document.getElementById('chat-body');
    const div = document.createElement('div');
    div.id = 'typing-indicator';
    div.className = 'message bot-message';
    div.style.fontStyle = 'italic';
    div.style.color = 'var(--light-slate)';
    div.innerText = 'Typing...';
    if (chatBody) {
        chatBody.appendChild(div);
        scrollToBottom();
    }
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function scrollToBottom() {
    const chatBody = document.getElementById('chat-body');
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
}

function enableInput() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    if (chatInput) {
        chatInput.disabled = false;
        chatInput.style.background = 'white';
        chatInput.style.cursor = 'text';
        chatInput.focus();
    }
    if (sendBtn) sendBtn.disabled = false;
}

function getOptionLabel(option) {
    switch (option) {
        case 'services': return 'Explore Services';
        case 'contact': return 'Details for Sales';
        case 'support': return 'Support';
        default: return option;
    }
}

function getBotResponse(option) {
    switch (option) {
        case 'services':
            return {
                text: 'We specialize in <strong>Plan-Build-Run</strong> SAP transformations. <br><br>Would you like to know more about our <a href="services.html#plan" style="color:var(--green)">Strategy</a>, <a href="services.html#build" style="color:var(--green)">Implementation</a>, or <a href="services.html#run" style="color:var(--green)">Optimization</a> services?',
                nextAction: 'reset'
            };
        case 'contact':
            return {
                text: 'Great! To get you to the right team, please enter your <strong>Email Address</strong> below, and a Senior Partner will reach out within 24 hours.',
                nextAction: 'input'
            };
        case 'support':
            return {
                text: 'For existing clients, please log in to the <a href="#" style="color:var(--green)">Client Portal</a> or email <strong>support@bluwis.com</strong> for immediate assistance.',
                nextAction: 'reset'
            };
        default:
            return { text: "I didn't understand that.", nextAction: 'reset' };
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Icon toggle
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Navbar Scroll Effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.padding = '15px 50px';
                navbar.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.85)';
                navbar.style.padding = '20px 50px';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // Fade In Animation on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));


    // --- CHATBOT UI LISTENERS ---
    const closeChatBtn = document.getElementById('close-chat');
    const chatWidget = document.getElementById('chat-widget');

    // Wire up "Start a Conversation" / "Contact" buttons using Event Delegation
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button');
        if (!target) return;

        // 1. Check for the specific class we added
        if (target.classList.contains('js-open-chat')) {
            e.preventDefault();
            console.log("Chat Trigger: Class Match");
            openChat();
            return;
        }

        // 2. Fallback: Check for ID or HREF if class is missing (e.g. dynamic content)
        if (target.id === 'cta-start-chat' || target.getAttribute('href') === '#chat') {
            e.preventDefault();
            console.log("Chat Trigger: ID/HREF Match");
            openChat();
            return;
        }
    });

    if (closeChatBtn && chatWidget) {
        closeChatBtn.addEventListener('click', () => {
            chatWidget.classList.remove('active');
        });
    }

    // Handle Input Submission (Email)
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');

    function handleInput() {
        if (!chatInput) return;
        const text = chatInput.value.trim();
        if (!text) return;

        addUserMessage(text);
        chatInput.value = '';
        chatInput.disabled = true;
        if (sendBtn) sendBtn.disabled = true;
        chatInput.style.background = 'rgba(255,255,255,0.5)';

        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            addBotMessage("Thank you! We have received your details. A BluWis expert will contact you shortly at " + text + ".");
        }, 1000);
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', handleInput);
    }
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleInput();
        });
    }

});
