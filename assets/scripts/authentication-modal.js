// Authentication Modal JavaScript - Forgot Password Flow

// Global variables
let isForgotModalOpen = false;
let isResetModalOpen = false;

// Forgot Password Modal Functions
function openForgotModal() {
    const forgotModal = document.getElementById('forgotModalOverlay');
    if (forgotModal) {
        forgotModal.style.display = 'flex';
        forgotModal.classList.add('show');
        isForgotModalOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Focus on email input
        setTimeout(() => {
            const emailInput = document.getElementById('forgotEmail');
            if (emailInput) {
                emailInput.focus();
            }
        }, 100);
        
        console.log('Forgot password modal opened');
    }
}

function closeForgotModal() {
    const forgotModal = document.getElementById('forgotModalOverlay');
    if (forgotModal) {
        forgotModal.style.display = 'none';
        forgotModal.classList.remove('show');
        isForgotModalOpen = false;
        document.body.style.overflow = '';
        
        // Clear form
        clearForgotForm();
        
        console.log('Forgot password modal closed');
    }
}

function clearForgotForm() {
    const forgotForm = document.getElementById('forgotForm');
    const emailInput = document.getElementById('forgotEmail');
    const sendBtn = document.querySelector('.send-code-btn');
    
    if (forgotForm) {
        forgotForm.reset();
    }
    
    if (emailInput) {
        emailInput.classList.remove('error', 'success');
    }
    
    if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<span>Send Verification Code</span><i class="fas fa-paper-plane"></i>';
    }
    
    // Hide any error messages
    hideForgotError();
}

// Reset Password Modal Functions (if using modal instead of page)
function openResetModal() {
    const resetModal = document.getElementById('resetModalOverlay');
    if (resetModal) {
        resetModal.style.display = 'flex';
        resetModal.classList.add('show');
        isResetModalOpen = true;
        document.body.style.overflow = 'hidden';
        
        console.log('Reset password modal opened');
    }
}

function closeResetModal() {
    const resetModal = document.getElementById('resetModalOverlay');
    if (resetModal) {
        resetModal.style.display = 'none';
        resetModal.classList.remove('show');
        isResetModalOpen = false;
        document.body.style.overflow = '';
        
        console.log('Reset password modal closed');
    }
}

// Form Validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showForgotError(message) {
    hideForgotError(); // Remove any existing error
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'forgot-error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    // Add error styles
    const errorStyles = `
        <style>
        .forgot-error-message {
            background: #fef2f2;
            border: 1px solid #fca5a5;
            color: #dc2626;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            animation: slideInDown 0.3s ease-out;
        }
        
        .forgot-error-message i {
            font-size: 1rem;
        }
        
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        </style>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#forgot-error-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'forgot-error-styles';
        styleElement.textContent = errorStyles.replace(/<style>|<\/style>/g, '');
        document.head.appendChild(styleElement);
    }
    
    // Insert error after form
    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        forgotForm.parentNode.insertBefore(errorDiv, forgotForm.nextSibling);
    }
}

function hideForgotError() {
    const existingError = document.querySelector('.forgot-error-message');
    if (existingError) {
        existingError.remove();
    }
}

function showForgotSuccess(message) {
    hideForgotError(); // Remove any existing error
    
    const successDiv = document.createElement('div');
    successDiv.className = 'forgot-success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add success styles
    const successStyles = `
        <style>
        .forgot-success-message {
            background: #f0f9ff;
            border: 1px solid #7dd3fc;
            color: #0369a1;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            animation: slideInDown 0.3s ease-out;
        }
        
        .forgot-success-message i {
            font-size: 1rem;
        }
        </style>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#forgot-success-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'forgot-success-styles';
        styleElement.textContent = successStyles.replace(/<style>|<\/style>/g, '');
        document.head.appendChild(styleElement);
    }
    
    // Insert success after form
    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        forgotForm.parentNode.insertBefore(successDiv, forgotForm.nextSibling);
    }
}

// Handle Forgot Password Form Submission
function handleForgotPasswordSubmit(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('forgotEmail');
    const sendBtn = document.querySelector('.send-code-btn');
    
    if (!emailInput || !sendBtn) {
        console.error('Forgot password form elements not found');
        return;
    }
    
    const email = emailInput.value.trim();
    
    // Validate email
    if (!email) {
        showForgotError('Please enter your email address');
        emailInput.classList.add('error');
        emailInput.focus();
        return;
    }
    
    if (!validateEmail(email)) {
        showForgotError('Please enter a valid email address');
        emailInput.classList.add('error');
        emailInput.focus();
        return;
    }
    
    // Clear previous states
    emailInput.classList.remove('error');
    hideForgotError();
    
    // Set loading state
    setSendButtonLoading(true);
    
    // Simulate API call to send verification code
    setTimeout(() => {
        console.log('Sending verification code to:', email);
        
        // Simulate success
        showForgotSuccess('Verification code sent! Redirecting to reset password page...');
        
        // Reset button state
        setSendButtonLoading(false);
        
        // Redirect to reset password page after a short delay
        setTimeout(() => {
            redirectToResetPassword(email);
        }, 2000);
        
    }, 1500);
}

function setSendButtonLoading(loading) {
    const sendBtn = document.querySelector('.send-code-btn');
    if (!sendBtn) return;
    
    if (loading) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    } else {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<span>Send Verification Code</span><i class="fas fa-paper-plane"></i>';
    }
}

// Redirect to Reset Password Page
function redirectToResetPassword(email) {
    // Store email in sessionStorage for the reset password page
    sessionStorage.setItem('resetPasswordEmail', email);
    
    // Close the forgot password modal
    closeForgotModal();
    
    // Redirect to reset password page
    window.location.href = 'reset-password.html';
    
    console.log('Redirecting to reset password page with email:', email);
}

// Input field styling
function handleEmailInputChange() {
    const emailInput = document.getElementById('forgotEmail');
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    
    // Remove error styling when user starts typing
    if (emailInput.classList.contains('error')) {
        emailInput.classList.remove('error');
        hideForgotError();
    }
    
    // Add success styling for valid email
    if (email && validateEmail(email)) {
        emailInput.classList.add('success');
    } else {
        emailInput.classList.remove('success');
    }
}

// Initialize Authentication Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing authentication modal functionality...');
    
    // Forgot Password Modal Elements
    const forgotModal = document.getElementById('forgotModalOverlay');
    const forgotModalClose = document.getElementById('forgotModalClose');
    const forgotForm = document.getElementById('forgotForm');
    const emailInput = document.getElementById('forgotEmail');
    
    // Forgot Password Modal Event Listeners
    if (forgotModalClose) {
        forgotModalClose.addEventListener('click', closeForgotModal);
    }
    
    // Close modal when clicking overlay
    if (forgotModal) {
        forgotModal.addEventListener('click', function(e) {
            if (e.target === forgotModal) {
                closeForgotModal();
            }
        });
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isForgotModalOpen) {
            closeForgotModal();
        }
    });
    
    // Form submission
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPasswordSubmit);
    }
    
    // Email input validation
    if (emailInput) {
        emailInput.addEventListener('input', handleEmailInputChange);
        emailInput.addEventListener('blur', handleEmailInputChange);
    }
    
    // Reset Password Modal Elements (if using modal)
    const resetModal = document.getElementById('resetModalOverlay');
    const resetModalClose = document.getElementById('resetModalClose');
    
    if (resetModalClose) {
        resetModalClose.addEventListener('click', closeResetModal);
    }
    
    if (resetModal) {
        resetModal.addEventListener('click', function(e) {
            if (e.target === resetModal) {
                closeResetModal();
            }
        });
    }
    
    // Close reset modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isResetModalOpen) {
            closeResetModal();
        }
    });
    
    // Make functions globally available
    window.openForgotModal = openForgotModal;
    window.closeForgotModal = closeForgotModal;
    window.openResetModal = openResetModal;
    window.closeResetModal = closeResetModal;
    
    console.log('Authentication modal functionality initialized successfully');
});

// Utility function to check if we're on the reset password page
function isOnResetPasswordPage() {
    return window.location.pathname.includes('reset-password.html');
}

// Auto-populate email on reset password page if coming from forgot password flow
if (isOnResetPasswordPage()) {
    document.addEventListener('DOMContentLoaded', function() {
        const storedEmail = sessionStorage.getItem('resetPasswordEmail');
        if (storedEmail) {
            // Update the welcome message to show the email
            const welcomeSubtitle = document.querySelector('.welcome-subtitle');
            if (welcomeSubtitle) {
                welcomeSubtitle.innerHTML = `
                    Enter the verification code sent to your email and create a new secure password to regain access to your account.
                    <br><br>
                    <strong>Code sent to: ${storedEmail}</strong>
                `;
            }
            
            // Clear the stored email after use
            sessionStorage.removeItem('resetPasswordEmail');
        }
    });
}

