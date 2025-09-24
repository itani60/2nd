// Registration Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordToggle = document.getElementById('registerPasswordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const submitBtn = document.querySelector('.register-submit-btn');
    
    // Password validation requirements
    const passwordRequirements = {
        length: { test: (password) => password.length >= 8, element: document.querySelector('[data-requirement="length"]') },
        uppercase: { test: (password) => /[A-Z]/.test(password), element: document.querySelector('[data-requirement="uppercase"]') },
        lowercase: { test: (password) => /[a-z]/.test(password), element: document.querySelector('[data-requirement="lowercase"]') },
        number: { test: (password) => /\d/.test(password), element: document.querySelector('[data-requirement="number"]') },
        special: { test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), element: document.querySelector('[data-requirement="special"]') }
    };
    
    // Initialize form
    initializeForm();
    
    function initializeForm() {
        // Password toggle functionality
        if (passwordToggle) {
            passwordToggle.addEventListener('click', function() {
                togglePasswordVisibility(passwordInput, passwordToggle);
            });
        }
        
        if (confirmPasswordToggle) {
            confirmPasswordToggle.addEventListener('click', function() {
                togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle);
            });
        }
        
        // Real-time password validation
        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                validatePassword(this.value);
                checkPasswordMatch();
            });
        }
        
        // Real-time password confirmation
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', function() {
                checkPasswordMatch();
            });
        }
        
        // Form submission
        if (registerForm) {
            registerForm.addEventListener('submit', handleFormSubmission);
        }
        
        // Real-time validation for other fields
        const inputs = registerForm.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
    
    function togglePasswordVisibility(input, toggleBtn) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        const icon = toggleBtn.querySelector('i');
        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
    }
    
    function validatePassword(password) {
        let allValid = true;
        
        Object.keys(passwordRequirements).forEach(requirement => {
            const { test, element } = passwordRequirements[requirement];
            const isValid = test(password);
            
            if (element) {
                if (isValid) {
                    element.classList.add('valid');
                    element.classList.remove('invalid');
                } else {
                    element.classList.add('invalid');
                    element.classList.remove('valid');
                    allValid = false;
                }
            }
        });
        
        return allValid;
    }
    
    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const matchIndicator = document.getElementById('registerPasswordMatch');
        
        if (confirmPassword.length > 0) {
            if (password === confirmPassword) {
                matchIndicator.classList.add('valid');
                matchIndicator.classList.remove('show');
                matchIndicator.querySelector('span').textContent = 'Passwords match';
                return true;
            } else {
                matchIndicator.classList.remove('valid');
                matchIndicator.classList.add('show');
                matchIndicator.querySelector('span').textContent = 'Passwords do not match';
                return false;
            }
        } else {
            matchIndicator.classList.remove('show', 'valid');
            return false;
        }
    }
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error state
        clearFieldError(field);
        
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
        
        
        // Name validation
        if ((fieldName === 'firstName' || fieldName === 'lastName') && value) {
            if (value.length < 2) {
                isValid = false;
                errorMessage = `${getFieldLabel(fieldName)} must be at least 2 characters`;
            }
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
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
    
    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        
        // Create or update error message
        let errorElement = formGroup.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.cssText = 'color: #dc3545; font-size: 0.85rem; margin-top: 0.5rem; display: flex; align-items: center;';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle" style="margin-right: 0.5rem;"></i>${message}`;
    }
    
    function clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        
        const errorElement = formGroup.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function validateForm() {
        let isValid = true;
        
        // Validate all required fields
        const requiredFields = registerForm.querySelectorAll('input[required]');
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Validate password requirements
        if (!validatePassword(passwordInput.value)) {
            isValid = false;
        }
        
        // Validate password match
        if (!checkPasswordMatch()) {
            isValid = false;
        }
        
        // Validate terms agreement
        const termsCheckbox = document.getElementById('agreeTerms');
        if (!termsCheckbox.checked) {
            isValid = false;
            showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
        }
        
        return isValid;
    }
    
    function handleFormSubmission(event) {
        event.preventDefault();
        
        if (!validateForm()) {
            showNotification('Please fix the errors in the form', 'error');
            return;
        }
        
        // Show loading state
        setSubmitButtonLoading(true);
        
        // Collect form data
        const formData = new FormData(registerForm);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            password: formData.get('password'),
            subscribeNewsletter: formData.get('subscribeNewsletter') === 'on'
        };
        
        // Simulate API call (replace with actual registration logic)
        setTimeout(() => {
            try {
                // Here you would typically send the data to your backend
                console.log('Registration data:', userData);
                
                // Simulate successful registration
                showNotification('Account created successfully! Welcome to CompareHubPrices!', 'success');
                
                // Reset form
                registerForm.reset();
                clearAllValidationStates();
                
                // Redirect to login or dashboard after a delay
                setTimeout(() => {
                    // You can redirect to login page or show login modal
                    if (typeof openLoginModal === 'function') {
                        openLoginModal();
                    }
                }, 2000);
                
            } catch (error) {
                console.error('Registration error:', error);
                showNotification('Registration failed. Please try again.', 'error');
            } finally {
                setSubmitButtonLoading(false);
            }
        }, 2000);
    }
    
    function setSubmitButtonLoading(loading) {
        if (loading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
    
    function clearAllValidationStates() {
        // Clear password requirements
        Object.values(passwordRequirements).forEach(({ element }) => {
            if (element) {
                element.classList.remove('valid', 'invalid');
            }
        });
        
        // Clear password match indicator
        const matchIndicator = document.getElementById('registerPasswordMatch');
        if (matchIndicator) {
            matchIndicator.classList.remove('show', 'valid');
        }
        
        // Clear field errors
        const formGroups = registerForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error');
            const errorElement = group.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        });
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

