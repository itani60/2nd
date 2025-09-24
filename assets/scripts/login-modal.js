// Login Modal Functionality
let isLoginModalOpen = false;
let isForgotModalOpen = false;

// Toggle login state
function toggleLoginState() {
    const mobileLoginBtn = document.querySelector('.login-btn');
    const desktopLoginBtn = document.querySelector('.header-link[onclick*="toggleLoginState"]');
    
    // Check if any login button is in logged-in state
    const isLoggedIn = (mobileLoginBtn && mobileLoginBtn.classList.contains('logged-in')) || 
                      (desktopLoginBtn && desktopLoginBtn.classList.contains('logged-in'));
    
    if (isLoggedIn) {
        // Currently logged in, show logout option
        if (confirm('Are you sure you want to logout?')) {
            updateLoginState(false);
            showInfo('You have been logged out successfully!', 'Logged Out');
        }
    } else {
        // Not logged in, open modal
        openLoginModal();
    }
}

// Open login modal
function openLoginModal() {
    const modalOverlay = document.getElementById('loginModalOverlay');
    const modal = document.getElementById('loginModal');
    
    if (modalOverlay && modal) {
        isLoginModalOpen = true;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        setTimeout(() => {
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.focus();
            }
        }, 300);
        
        console.log('Login modal opened');
    }
}

// Close login modal
function closeLoginModal() {
    const modalOverlay = document.getElementById('loginModalOverlay');
    const modal = document.getElementById('loginModal');
    
    if (modalOverlay && modal) {
        isLoginModalOpen = false;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear form
        const form = document.getElementById('loginForm');
        if (form) {
            form.reset();
        }
        
        console.log('Login modal closed');
    }
}

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('passwordToggle');
    const icon = toggleButton.querySelector('i');
    
    if (passwordInput && toggleButton && icon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// Handle form submission
function handleLoginFormSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Basic validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Simulate login process
    const submitBtn = document.querySelector('.login-submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showLoginSuccess(email);
        
        // Close modal
        closeLoginModal();
        
        // Update UI to show logged in state
        updateLoginState(true, email);
        
    }, 2000);
}

// Update login state in UI
function updateLoginState(isLoggedIn, userEmail = '') {
    const mobileLoginBtn = document.querySelector('.login-btn');
    const desktopLoginBtn = document.querySelector('.header-link[onclick*="toggleLoginState"]');
    
    // Update mobile login button
    if (mobileLoginBtn) {
        if (isLoggedIn) {
            mobileLoginBtn.innerHTML = '<i class="fas fa-user"></i> My Account';
            mobileLoginBtn.classList.add('logged-in');
            mobileLoginBtn.href = '#account';
        } else {
            mobileLoginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i>Login';
            mobileLoginBtn.classList.remove('logged-in');
            mobileLoginBtn.href = '#';
        }
    }
    
    // Update desktop login button
    if (desktopLoginBtn) {
        if (isLoggedIn) {
            desktopLoginBtn.textContent = 'My Account';
            desktopLoginBtn.classList.add('logged-in');
        } else {
            desktopLoginBtn.textContent = 'Login';
            desktopLoginBtn.classList.remove('logged-in');
        }
    }
}

// Handle social login
function handleSocialLogin(provider) {
    console.log(`Social login with ${provider}`);
    showInfo(`Redirecting to ${provider} login...`, 'Social Login');
    
    // Here you would typically redirect to OAuth provider
    // window.location.href = `/auth/${provider}`;
}

// Forgot Password Modal Functions
function openForgotModal() {
    const forgotModal = document.getElementById('forgotModalOverlay');
    if (forgotModal) {
        forgotModal.classList.add('active');
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
        forgotModal.classList.remove('active');
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

// Initialize login modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Modal close button
    const closeButton = document.getElementById('modalClose');
    if (closeButton) {
        closeButton.addEventListener('click', closeLoginModal);
    }
    
    // Close modal when clicking overlay
    const modalOverlay = document.getElementById('loginModalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeLoginModal();
            }
        });
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isLoginModalOpen) {
            closeLoginModal();
        }
        if (e.key === 'Escape' && isForgotModalOpen) {
            closeForgotModal();
        }
    });
    
    // Password toggle
    const passwordToggle = document.getElementById('passwordToggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', togglePasswordVisibility);
    }
    
    // Form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginFormSubmit);
    }
    
    // Social login buttons
    const googleBtn = document.querySelector('.gsi-material-button');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', () => handleSocialLogin('Google'));
    }
    
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
    
    // Form submission
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPasswordSubmit);
    }
    
    // Email input validation
    if (emailInput) {
        emailInput.addEventListener('input', handleEmailInputChange);
        emailInput.addEventListener('blur', handleEmailInputChange);
    }
    
    // Make functions globally available
    window.openLoginModal = openLoginModal;
    window.closeLoginModal = closeLoginModal;
    window.toggleLoginState = toggleLoginState;
    window.openForgotModal = openForgotModal;
    window.closeForgotModal = closeForgotModal;
    
    console.log('Login modal functionality initialized');
});
