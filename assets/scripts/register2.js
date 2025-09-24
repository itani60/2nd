// Register2.js - Registration Form Functionality

// Global variables
let isFormValid = false;

// Password requirements - clean implementation

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeRegistrationForm();
});

function initializeRegistrationForm() {
    // Get form elements
    const form = document.getElementById('registerForm');
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Add event listeners
    if (form) {
        form.addEventListener('submit', handleRegistration);
    }

    // Password toggle buttons
    const passwordToggle = document.getElementById('registerPasswordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');

    // Password input events
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordRequirements(this.value);
            checkPasswordMatch();
        });
    }

    // Confirm password input events
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    }

    // Password toggle events
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            togglePasswordVisibility('registerPassword', this);
        });
    }

    if (confirmPasswordToggle) {
        confirmPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility('confirmPassword', this);
        });
    }


    // Real-time validation for all inputs
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Initialize Google Sign-In
    initializeGoogleSignIn();
    
    // Add event listener for reset password modal
    const newPasswordInput = document.getElementById('newPassword');
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
    const newPasswordToggle = document.getElementById('newPasswordToggle');
    const confirmNewPasswordToggle = document.getElementById('confirmNewPasswordToggle');
    
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            checkPasswordRequirements(this.value);
            
            // Check if passwords match in reset form
            const confirmNewPassword = document.getElementById('confirmNewPassword');
            if (confirmNewPassword && confirmNewPassword.value) {
                checkResetPasswordMatch();
            }
        });
    }
    
    // Add event listener for confirm new password
    if (confirmNewPasswordInput) {
        confirmNewPasswordInput.addEventListener('input', checkResetPasswordMatch);
    }
    
    // Add event listeners for password toggle buttons in reset modal
    if (newPasswordToggle) {
        newPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility('newPassword', this);
        });
    }
    
    if (confirmNewPasswordToggle) {
        confirmNewPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility('confirmNewPassword', this);
        });
    }
    }
    
    // Check if passwords match in reset form
    function checkResetPasswordMatch() {
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;
        const matchContainer = document.getElementById('resetPasswordMatch');
    
        if (!matchContainer) return false;
    
        if (confirmPassword && password !== confirmPassword) {
            matchContainer.classList.add('show');
            matchContainer.classList.remove('valid');
            return false;
        } else if (confirmPassword && password === confirmPassword) {
            matchContainer.classList.add('show', 'valid');
            matchContainer.querySelector('i').className = 'fas fa-check';
            matchContainer.querySelector('span').textContent = 'Passwords match';
            return true;
        } else {
            matchContainer.classList.remove('show');
            return true;
        }
    }

// Clean password requirements checking
function checkPasswordRequirements(password) {
    const requirements = [
        { id: 'length', test: password.length >= 8, text: 'At least 8 characters' },
        { id: 'uppercase', test: /[A-Z]/.test(password), text: 'One uppercase letter' },
        { id: 'lowercase', test: /[a-z]/.test(password), text: 'One lowercase letter' },
        { id: 'number', test: /\d/.test(password), text: 'One number' },
        { id: 'special', test: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: 'One special character' }
    ];

    requirements.forEach(req => {
        // Update all matching requirement elements (both in registration form and reset modal)
        const elements = document.querySelectorAll(`[data-requirement="${req.id}"]`);
        elements.forEach(element => {
            const icon = element.querySelector('i');
            if (req.test) {
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
        });
    });

    return requirements.every(req => req.test);
}

// Password match checking
function checkPasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const matchContainer = document.getElementById('registerPasswordMatch');

    if (confirmPassword && password !== confirmPassword) {
        matchContainer.classList.add('show');
        matchContainer.classList.remove('valid');
        return false;
    } else if (confirmPassword && password === confirmPassword) {
        matchContainer.classList.add('show', 'valid');
        matchContainer.querySelector('i').className = 'fas fa-check';
        matchContainer.querySelector('span').textContent = 'Passwords match';
        return true;
    } else {
        matchContainer.classList.remove('show');
        return true;
    }
}

// Toggle password visibility
function togglePasswordVisibility(inputId, toggleButton) {
    const input = document.getElementById(inputId);
    const icon = toggleButton.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error state
    const formGroup = field.closest('.form-group') || field.closest('.form-options');
    if (formGroup) {
        formGroup.classList.remove('error', 'success');
    }
    hideFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} is required`;
    }

    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Password validation
    if (fieldName === 'password' || fieldName === 'newPassword') {
        if (value && !checkPasswordRequirements(value)) {
            isValid = false;
            errorMessage = 'Password does not meet requirements';
        }
    }

    // Confirm password validation
    if (fieldName === 'confirmPassword' && value) {
        const password = document.getElementById('registerPassword').value;
        if (value !== password) {
            isValid = false;
            errorMessage = 'Passwords do not match';
        }
    }
    
    // Confirm new password validation (for reset modal)
    if (fieldName === 'confirmNewPassword' && value) {
        const password = document.getElementById('newPassword').value;
        if (value !== password) {
            isValid = false;
            errorMessage = 'Passwords do not match';
        }
    }

    // Name validation
    if ((fieldName === 'firstName' || fieldName === 'lastName') && value) {
        if (value.length < 2) {
            isValid = false;
            errorMessage = `${getFieldLabel(fieldName)} must be at least 2 characters`;
        }
    }

    // Update field state
    if (formGroup) {
        if (isValid) {
            formGroup.classList.add('success');
        } else {
            formGroup.classList.add('error');
            showFieldError(field, errorMessage);
        }
    }

    return isValid;
}

// Get field label
function getFieldLabel(fieldName) {
    const labels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        password: 'Password',
        confirmPassword: 'Confirm Password'
    };
    return labels[fieldName] || fieldName;
}

// Show field error
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group') || field.closest('.form-options');
    if (!formGroup) return;
    
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Hide field error
function hideFieldError(field) {
    const formGroup = field.closest('.form-group') || field.closest('.form-options');
    if (!formGroup) return;
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Set submit button loading state
function setSubmitButtonLoading(loading) {
    const submitBtn = document.querySelector('.register-submit-btn');
    if (submitBtn) {
        if (loading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Register';
        }
    }
}

// Handle form submission
function handleRegistration(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    // Check password match
    if (!checkPasswordMatch()) {
        isFormValid = false;
    }
    
    // Check terms agreement
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms.checked) {
        isFormValid = false;
        showFieldError(agreeTerms, 'You must agree to the Terms of Service and Privacy Policy');
    }
    
    if (!isFormValid) {
        console.log('Form validation failed');
        return;
    }
    
    // Set loading state
    setSubmitButtonLoading(true);
    
    // Collect user data
    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
        agreeTerms: document.getElementById('agreeTerms').checked
    };
    
    console.log('Registration data:', userData);
    
    // Simulate API call
    setTimeout(() => {
        setSubmitButtonLoading(false);
        
        // Hide registration form and show OTP verification
        showOTPVerification(userData.email);
        
    }, 2000);
}

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    // Check if Google Identity Services is loaded
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual client ID
            callback: handleGoogleSignIn
        });
        
        google.accounts.id.renderButton(
            document.querySelector('.gsi-material-button'),
            {
                theme: 'outline',
                size: 'large',
                width: '100%'
            }
        );
    }
}

// Handle Google Sign-In
function handleGoogleSignIn(response) {
    console.log('Google Sign-In response:', response);
    
    // Decode the JWT token (you'll need a JWT library for production)
    try {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        console.log('Google user data:', payload);
        
        // Handle successful Google sign-in
        alert('Google Sign-In successful! Welcome to CompareHubPrices!');
        
    } catch (error) {
        console.error('Error processing Google Sign-In:', error);
        alert('Error processing Google Sign-In. Please try again.');
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// OTP Verification Functions
let otpTimer = null;
let otpTimerCount = 60;
let currentOTP = '';

// Show OTP verification section
function showOTPVerification(email) {
    // Hide registration form
    const registerForm = document.getElementById('registerForm');
    const otpSection = document.getElementById('otpVerificationSection');
    
    if (registerForm && otpSection) {
        registerForm.style.display = 'none';
        otpSection.style.display = 'block';
        
        // Display email
        const emailDisplay = document.getElementById('otpEmailDisplay');
        if (emailDisplay) {
            emailDisplay.textContent = email;
        }
        
        // Generate and send OTP (simulated)
        generateAndSendOTP(email);
        
        // Initialize OTP inputs
        initializeOTPInputs();
        
        // Start resend timer
        startResendTimer();
    }
}

// Generate and send OTP (simulated)
function generateAndSendOTP(email) {
    // Generate 6-digit OTP
    currentOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('OTP sent to', email, ':', currentOTP); // For testing purposes
    
    // Show OTP in a temporary alert for testing
    setTimeout(() => {
        alert(`For testing purposes, your OTP is: ${currentOTP}`);
    }, 1000);
    
    // In a real application, you would send this OTP to the user's email
    // For demo purposes, we'll show it in console and alert
}

// Initialize OTP input functionality
function initializeOTPInputs() {
    const otpInputs = document.querySelectorAll('.otp-input');
    const otpForm = document.getElementById('otpForm');
    const verifyBtn = document.getElementById('verifyOtpBtn');
    const resendBtn = document.getElementById('resendOtpBtn');
    
    // Add event listeners to OTP inputs
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // Only allow numbers
            if (!/^\d$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            // Add filled class
            e.target.classList.add('filled');
            e.target.classList.remove('error');
            
            // Move to next input
            if (value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
            
            // Check if all inputs are filled
            checkOTPCompletion();
        });
        
        input.addEventListener('keydown', function(e) {
            // Handle backspace
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
            
            // Handle paste
            if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleOTPPaste(e);
            }
        });
        
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            handleOTPPaste(e);
        });
    });
    
    // Add form submit listener
    if (otpForm) {
        otpForm.addEventListener('submit', handleOTPVerification);
    }
    
    // Add resend button listener
    if (resendBtn) {
        resendBtn.addEventListener('click', function() {
            if (!resendBtn.disabled) {
                resendOTP();
            }
        });
    }
}

// Handle OTP paste
function handleOTPPaste(e) {
    const pasteData = e.clipboardData.getData('text');
    const otpInputs = document.querySelectorAll('.otp-input');
    
    if (/^\d{6}$/.test(pasteData)) {
        for (let i = 0; i < 6; i++) {
            otpInputs[i].value = pasteData[i];
            otpInputs[i].classList.add('filled');
        }
        checkOTPCompletion();
    }
}

// Check if OTP is complete
function checkOTPCompletion() {
    // Only check OTP inputs within the current OTP form
    const otpForm = document.getElementById('otpForm');
    const otpInputs = otpForm ? otpForm.querySelectorAll('.otp-input') : [];
    const verifyBtn = document.getElementById('verifyOtpBtn');
    
    const allFilled = Array.from(otpInputs).every(input => input.value && input.value.length === 1);
    
    if (verifyBtn) {
        verifyBtn.disabled = !allFilled;
    }
}

// Handle OTP verification
function handleOTPVerification(event) {
    event.preventDefault();
    
    const otpForm = document.getElementById('otpForm');
    const otpInputs = otpForm ? otpForm.querySelectorAll('.otp-input') : [];
    const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');
    const verifyBtn = document.getElementById('verifyOtpBtn');
    const errorDiv = document.getElementById('otpError');
    
    // Clear previous errors
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
    
    // Remove error classes
    otpInputs.forEach(input => input.classList.remove('error'));
    
    // Set loading state
    if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = 'Verifying...';
    }
    
    // Simulate verification delay
    setTimeout(() => {
        if (enteredOTP === currentOTP) {
            // OTP is correct
            showOTPSuccess();
        } else {
            // OTP is incorrect
            showOTPError('Invalid verification code. Please try again.');
            
            // Add error styling
            otpInputs.forEach(input => {
                input.classList.add('error');
                input.value = '';
                input.classList.remove('filled');
            });
            
            // Focus first input
            otpInputs[0].focus();
        }
        
        // Reset button
        if (verifyBtn) {
            verifyBtn.disabled = false;
            verifyBtn.innerHTML = 'Verify';
        }
    }, 1500);
}

// Show OTP error
function showOTPError(message) {
    const errorDiv = document.getElementById('otpError');
    const errorMessage = document.getElementById('otpErrorMessage');
    
    if (errorDiv && errorMessage) {
        errorMessage.textContent = message;
        errorDiv.style.display = 'flex';
    }
}

// Show OTP success
function showOTPSuccess() {
    const otpForm = document.getElementById('otpForm');
    const successDiv = document.getElementById('otpSuccess');
    
    if (otpForm && successDiv) {
        otpForm.style.display = 'none';
        successDiv.style.display = 'block';
        
        // Clear timer
        if (otpTimer) {
            clearInterval(otpTimer);
        }
    }
}

// Resend OTP
function resendOTP() {
    const emailDisplay = document.getElementById('otpEmailDisplay');
    const resendBtn = document.getElementById('resendOtpBtn');
    const timerSpan = document.getElementById('resendTimer');
    
    if (emailDisplay && resendBtn) {
        // Generate new OTP
        generateAndSendOTP(emailDisplay.textContent);
        
        // Clear all inputs
        const otpInputs = document.querySelectorAll('.otp-input');
        otpInputs.forEach(input => {
            input.value = '';
            input.classList.remove('filled', 'error');
        });
        
        // Focus first input
        otpInputs[0].focus();
        
        // Start timer again
        startResendTimer();
        
        // Show success message
        showOTPError('New verification code sent to your email.');
        setTimeout(() => {
            const errorDiv = document.getElementById('otpError');
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
        }, 3000);
    }
}

// Start resend timer
function startResendTimer() {
    const resendBtn = document.getElementById('resendOtpBtn');
    const timerSpan = document.getElementById('resendTimer');
    const timerCount = document.getElementById('timerCount');
    
    if (resendBtn && timerSpan && timerCount) {
        resendBtn.style.display = 'none';
        timerSpan.style.display = 'inline';
        otpTimerCount = 60;
        
        otpTimer = setInterval(() => {
            otpTimerCount--;
            timerCount.textContent = otpTimerCount;
            
            if (otpTimerCount <= 0) {
                clearInterval(otpTimer);
                resendBtn.style.display = 'inline-flex';
                timerSpan.style.display = 'none';
            }
        }, 1000);
    }
}

// Export functions for external use
window.register2Functions = {
    validateField,
    checkPasswordRequirements,
    checkPasswordMatch,
    handleRegistration,
    showOTPVerification,
    handleOTPVerification,
    resendOTP
};
