// Reset Password JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize OTP inputs
    initializeOtpInputs();
    
    // Initialize password toggles
    initializePasswordToggles();
    
    // Initialize password validation
    initializePasswordValidation();
    
    // Initialize form submission
    initializeFormSubmission();
    
    // Initialize resend code functionality
    initializeResendCode();
    
    // Initialize email display
    initializeEmailDisplay();
});

// OTP Input Functionality
function initializeOtpInputs() {
    const otpInputs = document.querySelectorAll('.otp-input');
    
    otpInputs.forEach((input, index) => {
        // Handle input
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // Only allow numbers
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            // Move to next input if value is entered
            if (value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
            
            // Update filled state
            updateOtpFilledState();
            checkFormValidity();
        });
        
        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
        
        // Handle paste
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
            
            pastedData.split('').forEach((digit, i) => {
                if (otpInputs[i]) {
                    otpInputs[i].value = digit;
                }
            });
            
            // Focus the next empty input or the last one
            const nextEmptyIndex = pastedData.length < 6 ? pastedData.length : 5;
            if (otpInputs[nextEmptyIndex]) {
                otpInputs[nextEmptyIndex].focus();
            }
            
            updateOtpFilledState();
            checkFormValidity();
        });
        
        // Handle focus
        input.addEventListener('focus', function() {
            input.select();
        });
    });
}

function updateOtpFilledState() {
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach(input => {
        if (input.value) {
            input.classList.add('filled');
        } else {
            input.classList.remove('filled');
        }
    });
}

// Password Toggle Functionality
function initializePasswordToggles() {
    const newPasswordToggle = document.getElementById('newPasswordToggle');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordToggle = document.getElementById('confirmNewPasswordToggle');
    const confirmPasswordInput = document.getElementById('confirmNewPassword');
    
    if (newPasswordToggle && newPasswordInput) {
        newPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility(newPasswordInput, newPasswordToggle);
        });
    }
    
    if (confirmPasswordToggle && confirmPasswordInput) {
        confirmPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle);
        });
    }
}

function togglePasswordVisibility(input, toggle) {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    
    const icon = toggle.querySelector('i');
    if (icon) {
        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
    }
}

// Password Validation
function initializePasswordValidation() {
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmNewPassword');
    
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            checkPasswordRequirements(this.value);
            checkPasswordMatch();
            checkFormValidity();
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            checkPasswordMatch();
            checkFormValidity();
        });
    }
}

function checkPasswordRequirements(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    Object.keys(requirements).forEach(requirement => {
        const element = document.querySelector(`[data-requirement="${requirement}"]`);
        if (element) {
            const icon = element.querySelector('i');
            if (requirements[requirement]) {
                element.classList.add('valid');
                element.classList.remove('invalid');
                if (icon) {
                    icon.className = 'fas fa-check';
                }
            } else {
                element.classList.add('invalid');
                element.classList.remove('valid');
                if (icon) {
                    icon.className = 'fas fa-times';
                }
            }
        }
    });
}

function checkPasswordMatch() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    const matchElement = document.getElementById('resetPasswordMatch');
    
    if (confirmPassword) {
        if (newPassword === confirmPassword) {
            matchElement.classList.add('show', 'valid');
            matchElement.querySelector('i').className = 'fas fa-check';
            matchElement.querySelector('span').textContent = 'Passwords match';
        } else {
            matchElement.classList.add('show', 'invalid');
            matchElement.classList.remove('valid');
            matchElement.querySelector('i').className = 'fas fa-times';
            matchElement.querySelector('span').textContent = 'Passwords do not match';
        }
    } else {
        matchElement.classList.remove('show');
    }
}

function checkFormValidity() {
    const otpInputs = document.querySelectorAll('.otp-input');
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    const resetButton = document.getElementById('resetPasswordBtn');
    
    // Check if all OTP inputs are filled
    const allOtpFilled = Array.from(otpInputs).every(input => input.value.length === 1);
    
    // Check if passwords match and meet requirements
    const passwordsValid = newPassword && confirmPassword && newPassword === confirmPassword;
    
    // Check password requirements
    const requirements = {
        length: newPassword.length >= 8,
        uppercase: /[A-Z]/.test(newPassword),
        lowercase: /[a-z]/.test(newPassword),
        number: /\d/.test(newPassword),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    };
    
    const allRequirementsMet = Object.values(requirements).every(requirement => requirement);
    
    // Enable button if all conditions are met
    if (allOtpFilled && passwordsValid && allRequirementsMet) {
        resetButton.disabled = false;
        resetButton.classList.remove('loading');
    } else {
        resetButton.disabled = true;
    }
}

// Form Submission
function initializeFormSubmission() {
    const resetForm = document.getElementById('resetForm');
    const resetButton = document.getElementById('resetPasswordBtn');
    
    if (resetForm) {
        resetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleResetPassword();
        });
    }
}

function handleResetPassword() {
    const resetButton = document.getElementById('resetPasswordBtn');
    const otpInputs = document.querySelectorAll('.otp-input');
    
    // Get OTP code
    const otpCode = Array.from(otpInputs).map(input => input.value).join('');
    
    // Get password data
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    // Set loading state
    setResetButtonLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        // Simulate success
        console.log('Reset password data:', {
            otp: otpCode,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        });
        
        // Show success message
        showResetSuccess();
        
        // Reset loading state
        setResetButtonLoading(false);
    }, 2000);
}

function setResetButtonLoading(loading) {
    const resetButton = document.getElementById('resetPasswordBtn');
    
    if (loading) {
        resetButton.disabled = true;
        resetButton.classList.add('loading');
        resetButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
    } else {
        resetButton.disabled = false;
        resetButton.classList.remove('loading');
        resetButton.innerHTML = 'Reset Password';
    }
}

function showResetSuccess() {
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'reset-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3 class="success-title">Password Reset Successful!</h3>
            <p class="success-message">Your password has been successfully reset. You can now log in with your new password.</p>
            <button class="login-redirect-btn" onclick="redirectToLogin(); return false;">
                Go to Login
            </button>
        </div>
    `;
    
    // Add success styles
    const successStyles = `
        <style>
        .reset-success {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        }
        
        .success-content {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            max-width: 400px;
            margin: 1rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: slideInUp 0.4s ease-out;
        }
        
        .success-icon {
            color: #28a745;
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .success-title {
            color: #2c3e50;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .success-message {
            color: #6c757d;
            margin-bottom: 1.5rem;
            line-height: 1.5;
        }
        
        .login-redirect-btn {
            background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
            color: white;
            border: none;
            padding: 0.875rem 2rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .login-redirect-btn:hover {
            background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
            transform: translateY(-2px);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        </style>
    `;
    
    // Add styles to head
    document.head.insertAdjacentHTML('beforeend', successStyles);
    
    // Add success message to body
    document.body.appendChild(successMessage);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.parentNode.removeChild(successMessage);
        }
    }, 5000);
}

// Resend Code Functionality
function initializeResendCode() {
    const resendBtn = document.getElementById('resendOtpBtn');
    const resendTimer = document.getElementById('resendTimer');
    const timerCount = document.getElementById('timerCount');
    
    if (resendBtn && resendTimer && timerCount) {
        // Start initial timer
        startResendTimer();
        
        // Add click event listener
        resendBtn.addEventListener('click', function() {
            handleResendCode();
        });
    }
}

function startResendTimer() {
    const resendBtn = document.getElementById('resendOtpBtn');
    const resendTimer = document.getElementById('resendTimer');
    const timerCount = document.getElementById('timerCount');
    
    let timeLeft = 60;
    
    // Disable resend button and show timer
    resendBtn.disabled = true;
    resendTimer.style.display = 'flex';
    resendTimer.classList.add('show');
    
    // Update timer display
    timerCount.textContent = timeLeft;
    
    // Start countdown
    const timer = setInterval(() => {
        timeLeft--;
        timerCount.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            // Enable resend button and hide timer
            resendBtn.disabled = false;
            resendTimer.style.display = 'none';
            resendTimer.classList.remove('show');
        }
    }, 1000);
}

function handleResendCode() {
    const resendBtn = document.getElementById('resendOtpBtn');
    
    // Set loading state
    resendBtn.disabled = true;
    resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Simulate API call
    setTimeout(() => {
        console.log('Resending OTP code...');
        
        // Show success message
        showResendSuccess();
        
        // Reset button state
        resendBtn.innerHTML = '<i class="fas fa-redo"></i> Resend Code';
        
        // Clear OTP inputs
        clearOtpInputs();
        
        // Start new timer
        startResendTimer();
    }, 1500);
}

function clearOtpInputs() {
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled');
    });
    
    // Focus first input
    if (otpInputs[0]) {
        otpInputs[0].focus();
    }
    
    // Update form validity
    checkFormValidity();
}

function showResendSuccess() {
    // Create temporary success message
    const successMessage = document.createElement('div');
    successMessage.className = 'resend-success-message';
    successMessage.innerHTML = `
        <div class="resend-success-content">
            <i class="fas fa-check-circle"></i>
            <span>New verification code sent!</span>
        </div>
    `;
    
    // Add styles
    const successStyles = `
        <style>
        .resend-success-message {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        }
        
        .resend-success-content {
            background: #28a745;
            color: white;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        
        .resend-success-content i {
            font-size: 1rem;
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @media (max-width: 768px) {
            .resend-success-message {
                top: 10px;
                right: 10px;
                left: 10px;
            }
            
            .resend-success-content {
                justify-content: center;
                padding: 1rem;
                font-size: 1rem;
            }
        }
        </style>
    `;
    
    // Add styles to head if not already added
    if (!document.querySelector('#resend-success-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'resend-success-styles';
        styleElement.textContent = successStyles.replace(/<style>|<\/style>/g, '');
        document.head.appendChild(styleElement);
    }
    
    // Add message to body
    document.body.appendChild(successMessage);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (successMessage.parentNode) {
                    successMessage.parentNode.removeChild(successMessage);
                }
            }, 300);
        }
    }, 3000);
}

// Email Display Functionality
function initializeEmailDisplay() {
    const storedEmail = sessionStorage.getItem('resetPasswordEmail');
    if (storedEmail) {
        updateWelcomeMessage(storedEmail);
        // Clear the stored email after use
        sessionStorage.removeItem('resetPasswordEmail');
    }
}

function updateWelcomeMessage(email) {
    const welcomeSubtitle = document.getElementById('welcomeSubtitle');
    if (welcomeSubtitle) {
        welcomeSubtitle.innerHTML = `
            Enter the verification code sent to your email and create a new secure password to regain access to your account.
            <br><br>
            <strong style="color: white; background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 6px; display: inline-block; margin-top: 0.5rem;">
                📧 Code sent to: ${email}
            </strong>
        `;
    }
}

// Redirect to login (handled by login-modal.js)
function redirectToLogin() {
    // Simply redirect to main page - login-modal.js will handle the modal
    window.location.href = 'index.html';
}
