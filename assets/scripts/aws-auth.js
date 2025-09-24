
/**
 * AWS Authentication Frontend Integration
 * CompareHubPrices Authentication System
 * 
 * This file provides the frontend integration for AWS Lambda authentication
 * API Gateway Endpoint: https://da84s1s15g.execute-api.af-south-1.amazonaws.com
 * 
 * Integrates with all authentication modals:
 * - Login Modal
 * - Register Modal  
 * - Forgot Password Modal
 * - Reset Password Modal
 * - OTP Verification Modal
 */

class AWSAuth {
    constructor() {
        this.baseURL = 'https://da84s1s15g.execute-api.af-south-1.amazonaws.com';
        this.accessToken = localStorage.getItem('accessToken') || null;
        this.refreshToken = localStorage.getItem('refreshToken') || null;
        this.userEmail = localStorage.getItem('userEmail') || null;
        this.captchaEnabled = true; // Keep CAPTCHA enabled for real testing
        
        // Modal integration
        this.currentModal = null;
        this.pendingEmail = null;
        this.pendingResetEmail = null;

        console.log('AWS Auth initialized with base URL:', this.baseURL);
        this.initializeModalIntegration();
    }

    /**
     * Initialize modal integration and event listeners
     */
    initializeModalIntegration() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupModalEventListeners());
        } else {
            this.setupModalEventListeners();
        }
    }

    /**
     * Setup event listeners for all authentication modals
     */
    setupModalEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLoginFormSubmit(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegisterFormSubmit(e));
        }

        // Forgot password form
        const forgotForm = document.getElementById('forgotForm');
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => this.handleForgotPasswordFormSubmit(e));
        }

        // Reset password form (for modal)
        const resetForm = document.getElementById('resetForm');
        if (resetForm) {
            resetForm.addEventListener('submit', (e) => this.handleResetPasswordFormSubmit(e));
        }

        // Reset password form (for password-reset-form.html page)
        const newPasswordForm = document.getElementById('newPasswordForm');
        if (newPasswordForm) {
            newPasswordForm.addEventListener('submit', (e) => this.handleNewPasswordFormSubmit(e));
        }

        // Verification form (for password-reset-form.html page)
        const verificationForm = document.getElementById('verificationForm');
        if (verificationForm) {
            verificationForm.addEventListener('submit', (e) => this.handleVerificationFormSubmit(e));
        }

        // OTP verification form
        const otpForm = document.getElementById('otpForm');
        if (otpForm) {
            otpForm.addEventListener('submit', (e) => this.handleOtpFormSubmit(e));
        }

        // Resend verification link
        const resendLink = document.getElementById('resendLink');
        if (resendLink) {
            resendLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleResendVerification();
            });
        }

        // Resend forgot code link
        const resendForgotLink = document.getElementById('resendForgotLink');
        if (resendForgotLink) {
            resendForgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleResendForgotCode();
            });
        }

        // Resend verification link for password-reset-form.html page
        const resendVerificationLink = document.getElementById('resendVerificationLink');
        if (resendVerificationLink) {
            resendVerificationLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleResendVerificationForPage();
            });
        }

        // Password toggle buttons
        this.setupPasswordToggles();
        
        // OTP input handling
        this.setupOtpInputs();
        
        // Password requirements
        this.setupPasswordRequirements();
    }

    /**
     * Setup password toggle functionality
     */
    setupPasswordToggles() {
        const toggleButtons = [
            { button: 'passwordToggle', input: 'password' },
            { button: 'registerPasswordToggle', input: 'registerPassword' },
            { button: 'confirmPasswordToggle', input: 'confirmPassword' },
            { button: 'newPasswordToggle', input: 'newPassword' },
            { button: 'confirmNewPasswordToggle', input: 'confirmNewPassword' }
        ];

        toggleButtons.forEach(({ button, input }) => {
            const toggleBtn = document.getElementById(button);
            const inputField = document.getElementById(input);
            
            if (toggleBtn && inputField) {
                toggleBtn.addEventListener('click', () => {
                    const icon = toggleBtn.querySelector('i');
                    if (inputField.type === 'password') {
                        inputField.type = 'text';
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                    } else {
                        inputField.type = 'password';
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                    }
                });
            }
        });
    }

    /**
     * Setup OTP input handling
     */
    setupOtpInputs() {
        const otpInputs = document.querySelectorAll('.otp-input');
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                if (value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });
    }

    /**
     * Setup password requirements validation
     */
    setupPasswordRequirements() {
        const passwordInputs = ['registerPassword', 'newPassword'];
        
        passwordInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.updatePasswordRequirements(input.value, inputId);
                });
            }
        });

        // Password match validation
        const confirmInputs = ['confirmPassword', 'confirmNewPassword'];
        confirmInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.checkPasswordMatch(inputId);
                });
            }
        });
    }

    /**
     * Update password requirements display
     */
    updatePasswordRequirements(password, inputId) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const containerId = inputId === 'registerPassword' ? 'passwordRequirements' : 'resetPasswordRequirements';
        const container = document.getElementById(containerId);
        
        if (container) {
            Object.keys(requirements).forEach(requirement => {
                const element = container.querySelector(`[data-requirement="${requirement}"]`);
                const icon = element?.querySelector('i');
                
                if (element && icon) {
                    if (requirements[requirement]) {
                        element.classList.add('valid');
                        icon.className = 'fas fa-check';
                    } else {
                        element.classList.remove('valid');
                        icon.className = 'fas fa-times';
                    }
                }
            });
        }

        return Object.values(requirements).every(req => req);
    }

    /**
     * Check password match
     */
    checkPasswordMatch(confirmInputId) {
        const passwordInputId = confirmInputId === 'confirmPassword' ? 'registerPassword' : 'newPassword';
        const password = document.getElementById(passwordInputId)?.value;
        const confirmPassword = document.getElementById(confirmInputId)?.value;
        
        const matchElementId = confirmInputId === 'confirmPassword' ? 'passwordMatch' : 'resetPasswordMatch';
        const matchElement = document.getElementById(matchElementId);
        
        if (matchElement) {
            if (confirmPassword && password !== confirmPassword) {
                matchElement.classList.add('show');
                return false;
            } else {
                matchElement.classList.remove('show');
                return true;
            }
        }
        return true;
    }

    /**
     * Show error message in modal
     */
    showModalError(message, modalId = null) {
        this.removeModalMessages(modalId);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const targetModal = modalId ? document.getElementById(modalId) : this.getCurrentActiveModal();
        if (targetModal) {
            const modalBody = targetModal.querySelector('.modal-body');
            if (modalBody) {
                modalBody.insertBefore(errorDiv, modalBody.firstChild);
            }
        }
    }

    /**
     * Show success message in modal
     */
    showModalSuccess(message, modalId = null) {
        this.removeModalMessages(modalId);
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        const targetModal = modalId ? document.getElementById(modalId) : this.getCurrentActiveModal();
        if (targetModal) {
            const modalBody = targetModal.querySelector('.modal-body');
            if (modalBody) {
                modalBody.insertBefore(successDiv, modalBody.firstChild);
            }
        }
    }

    /**
     * Remove existing error/success messages
     */
    removeModalMessages(modalId = null) {
        const targetModal = modalId ? document.getElementById(modalId) : this.getCurrentActiveModal();
        if (targetModal) {
            const existingError = targetModal.querySelector('.error-message');
            const existingSuccess = targetModal.querySelector('.success-message');
            
            if (existingError) existingError.remove();
            if (existingSuccess) existingSuccess.remove();
        }
    }

    /**
     * Get currently active modal
     */
    getCurrentActiveModal() {
        const modals = ['loginModal', 'registerModal', 'otpModal', 'forgotModal', 'resetModal'];
        for (const modalId of modals) {
            const modal = document.getElementById(modalId);
            if (modal && modal.closest('.modal-overlay.active')) {
                return modal;
            }
        }
        return null;
    }

    /**
     * Make HTTP request to AWS API Gateway
     */
    async makeRequest(endpoint, method = 'GET', data = null, requiresAuth = false) {
        const url = `${this.baseURL}${endpoint}`;
        
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // Add authorization header if required
        if (requiresAuth && this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        const config = {
            method: method,
            headers: headers,
            mode: 'cors'
        };

        // Add body for POST/PUT requests
        if (data && (method === 'POST' || method === 'PUT')) {
            config.body = JSON.stringify(data);
        }

        console.log(`Making ${method} request to:`, url);
        console.log('Request config:', config);

        try {
            const response = await fetch(url, config);
            const responseData = await response.json();

            console.log('Response status:', response.status);
            console.log('Response data:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return responseData;
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    }

    // ========================================
    // MODAL FORM HANDLERS
    // ========================================

    /**
     * Handle login form submission
     */
    async handleLoginFormSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;
        const rememberMe = document.getElementById('rememberMe')?.checked;
        
        if (!email || !password) {
            this.showModalError('Please fill in all fields');
            return;
        }
        
        const submitBtn = document.querySelector('.login-submit-btn');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
            submitBtn.disabled = true;
            
            const result = await this.loginUser({ email, password, rememberMe });
            
            if (result.success) {
                this.showModalSuccess('Login successful! Welcome back.');
                
                // Update login state and close modal
                setTimeout(() => {
                    this.updateLoginState(true, email);
                    this.closeModal('loginModal');
                    this.showUserSidebar();
                }, 1500);
            } else {
                this.showModalError(result.message || 'Login failed. Please try again.');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            this.showModalError('Login failed. Please check your credentials and try again.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    /**
     * Handle register form submission
     */
    async handleRegisterFormSubmit(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName')?.value;
        const lastName = document.getElementById('lastName')?.value;
        const email = document.getElementById('registerEmail')?.value;
        const password = document.getElementById('registerPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        const agreeTerms = document.getElementById('agreeTerms')?.checked;
        
        // Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            this.showModalError('Please fill in all fields');
            return;
        }
        
        if (!agreeTerms) {
            this.showModalError('Please agree to the Terms of Service and Privacy Policy');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showModalError('Passwords do not match');
            return;
        }
        
        const passwordValid = this.updatePasswordRequirements(password, 'registerPassword');
        if (!passwordValid) {
            this.showModalError('Password does not meet all requirements');
            return;
        }
        
        const submitBtn = document.querySelector('.register-submit-btn');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            submitBtn.disabled = true;
            
            const userData = { firstName, lastName, email, password, confirmPassword };
            const result = await this.registerUser(userData);
            
            if (result.success) {
                this.showModalSuccess('Registration successful! Please check your email for verification code.');
                this.pendingEmail = email;
                
                // Close register modal and open OTP modal
                setTimeout(() => {
                    this.closeModal('registerModal');
                    this.openOtpModal(email);
                }, 2000);
            } else {
                this.showModalError(result.message || 'Registration failed. Please try again.');
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showModalError('Registration failed. Please try again.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    /**
     * Handle forgot password form submission
     */
    async handleForgotPasswordFormSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('forgotEmail')?.value;
        
        if (!email) {
            this.showModalError('Please enter your email address');
            return;
        }
        
        const submitBtn = document.querySelector('.send-code-btn');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Code...';
            submitBtn.disabled = true;
            
            const result = await this.forgotPassword(email);
            
            if (result.success) {
                this.showModalSuccess('Verification code sent! Please check your email.');
                this.pendingResetEmail = email;
                
                // Store email in localStorage for password-reset-form.html page
                localStorage.setItem('resetEmail', email);
                
                // Close forgot modal and redirect to password reset page
                setTimeout(() => {
                    this.closeModal('forgotModal');
                    // Redirect to password reset page with email parameter
                    window.location.href = `password-reset-form.html?email=${encodeURIComponent(email)}`;
                }, 2000);
            } else {
                this.showModalError(result.message || 'Failed to send verification code. Please try again.');
            }
            
        } catch (error) {
            console.error('Forgot password error:', error);
            this.showModalError('Failed to send verification code. Please try again.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    /**
     * Handle reset password form submission
     */
    async handleResetPasswordFormSubmit(e) {
        e.preventDefault();
        
        const otpInputs = document.querySelectorAll('#resetForm .otp-input');
        const otp = Array.from(otpInputs).map(input => input.value).join('');
        const newPassword = document.getElementById('newPassword')?.value;
        const confirmNewPassword = document.getElementById('confirmNewPassword')?.value;
        
        if (!otp || otp.length !== 6) {
            this.showModalError('Please enter the complete 6-digit verification code');
            return;
        }
        
        if (!newPassword || !confirmNewPassword) {
            this.showModalError('Please fill in all password fields');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            this.showModalError('Passwords do not match');
            return;
        }
        
        const passwordValid = this.updatePasswordRequirements(newPassword, 'newPassword');
        if (!passwordValid) {
            this.showModalError('Password does not meet all requirements');
            return;
        }
        
        const submitBtn = document.querySelector('.reset-password-btn');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting Password...';
            submitBtn.disabled = true;
            
            const result = await this.resetPassword({
                email: this.pendingResetEmail,
                otp,
                newPassword,
                confirmNewPassword
            });
            
            if (result.success) {
                this.showModalSuccess('Password reset successful! You can now login with your new password.');
                
                // Close reset modal and open login modal
                setTimeout(() => {
                    this.closeModal('resetModal');
                    this.openModal('loginModal');
                }, 2000);
            } else {
                this.showModalError(result.message || 'Password reset failed. Please try again.');
            }
            
        } catch (error) {
            console.error('Reset password error:', error);
            this.showModalError('Password reset failed. Please try again.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    /**
     * Handle resend verification code for email verification
     */
    async handleResendVerification() {
        if (!this.pendingEmail) {
            this.showModalError('No email address found for resend');
            return;
        }

        try {
            const result = await this.resendVerification(this.pendingEmail);
            
            if (result.success) {
                this.showModalSuccess('New verification code sent! Please check your email.');
                this.startResendCountdown('otpModal');
            } else {
                this.showModalError(result.message || 'Failed to resend verification code');
            }
        } catch (error) {
            console.error('Resend verification error:', error);
            this.showModalError('Failed to resend verification code. Please try again.');
        }
    }

    /**
     * Handle resend forgot password code
     */
    async handleResendForgotCode() {
        if (!this.pendingResetEmail) {
            this.showModalError('No email address found for resend');
            return;
        }

        try {
            const result = await this.resendForgotCode(this.pendingResetEmail);
            
            if (result.success) {
                this.showModalSuccess('New password reset code sent! Please check your email.');
                this.startResendCountdown('resetModal');
            } else {
                this.showModalError(result.message || 'Failed to resend password reset code');
            }
        } catch (error) {
            console.error('Resend forgot code error:', error);
            this.showModalError('Failed to resend password reset code. Please try again.');
        }
    }

    /**
     * Start resend countdown timer
     */
    startResendCountdown(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const resendLink = modal.querySelector('.resend-link');
        const countdown = modal.querySelector('.countdown');
        const countdownTimer = modal.querySelector('#countdownTimer');

        if (resendLink && countdown && countdownTimer) {
            // Disable resend link
            resendLink.style.pointerEvents = 'none';
            resendLink.style.opacity = '0.5';
            
            // Show countdown
            countdown.style.display = 'block';
            
            let timeLeft = 60;
            countdownTimer.textContent = timeLeft;
            
            const timer = setInterval(() => {
                timeLeft--;
                countdownTimer.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    resendLink.style.pointerEvents = 'auto';
                    resendLink.style.opacity = '1';
                    countdown.style.display = 'none';
                }
            }, 1000);
        }
    }

    /**
     * Handle verification form submission (for password-reset-form.html page)
     */
    async handleVerificationFormSubmit(e) {
        e.preventDefault();
        
        const otpInputs = document.querySelectorAll('#verificationForm .otp-input');
        const otp = Array.from(otpInputs).map(input => input.value).join('');
        
        if (!otp || otp.length !== 6) {
            this.showNotification('Please enter the complete 6-digit verification code', 'error');
            return;
        }

        const submitBtn = document.querySelector('.btn-verify-code');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
            submitBtn.disabled = true;
            
            // Get email from URL params or localStorage
            const urlParams = new URLSearchParams(window.location.search);
            const email = urlParams.get('email') || localStorage.getItem('resetEmail');
            
            if (!email) {
                throw new Error('No email address found');
            }
            
            // Verify the code (this will be handled by the reset password flow)
            // For now, we'll just show the new password section
            this.showNewPasswordSection();
            this.showNotification('Code verified successfully', 'success');
            
        } catch (error) {
            console.error('Verification error:', error);
            this.showNotification('Invalid verification code', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    /**
     * Handle new password form submission (for password-reset-form.html page)
     */
    async handleNewPasswordFormSubmit(e) {
        e.preventDefault();
        
        const newPassword = document.getElementById('newPassword')?.value;
        const confirmNewPassword = document.getElementById('confirmNewPassword')?.value;
        
        if (!newPassword || !confirmNewPassword) {
            this.showNotification('Please fill in all password fields', 'error');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }
        
        const passwordValid = this.updatePasswordRequirements(newPassword, 'newPassword');
        if (!passwordValid) {
            this.showNotification('Password does not meet all requirements', 'error');
            return;
        }

        const submitBtn = document.querySelector('.btn-reset-password');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
            submitBtn.disabled = true;
            
            // Get email and OTP from the verification step
            const urlParams = new URLSearchParams(window.location.search);
            const email = urlParams.get('email') || localStorage.getItem('resetEmail');
            
            if (!email) {
                throw new Error('No email address found');
            }
            
            // Get OTP from verification form
            const otpInputs = document.querySelectorAll('#verificationForm .otp-input');
            const otp = Array.from(otpInputs).map(input => input.value).join('');
            
            const result = await this.resetPassword({
                email: email,
                otp: otp,
                newPassword: newPassword,
                confirmNewPassword: confirmNewPassword
            });
            
            if (result.success) {
                this.showSuccessSection();
                this.showNotification('Password reset successfully', 'success');
            } else {
                this.showNotification(result.message || 'Password reset failed', 'error');
            }
            
        } catch (error) {
            console.error('Password reset error:', error);
            this.showNotification('Password reset failed. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    /**
     * Show new password section (for password-reset-form.html page)
     */
    showNewPasswordSection() {
        const verificationSection = document.getElementById('verificationSection');
        const newPasswordSection = document.getElementById('newPasswordSection');
        const stepIndicator = document.getElementById('stepIndicator');
        
        if (verificationSection) verificationSection.style.display = 'none';
        if (newPasswordSection) newPasswordSection.style.display = 'block';
        if (stepIndicator) {
            stepIndicator.innerHTML = `
                <i class="fas fa-info-circle me-2"></i>
                <strong>Step 2 of 2:</strong> Create your new password.
            `;
        }
    }

    /**
     * Show success section (for password-reset-form.html page)
     */
    showSuccessSection() {
        const newPasswordSection = document.getElementById('newPasswordSection');
        const successSection = document.getElementById('successSection');
        
        if (newPasswordSection) newPasswordSection.style.display = 'none';
        if (successSection) successSection.style.display = 'block';
    }

    /**
     * Show notification (for password-reset-form.html page)
     */
    showNotification(message, type = 'info') {
        // Use the existing notification system if available
        if (typeof showNotificationToast === 'function') {
            showNotificationToast(message, type);
        } else {
            // Fallback to console and simple alert
            console.log(`${type.toUpperCase()}: ${message}`);
            
            // Create a simple styled notification as fallback
            const notificationContainer = document.getElementById('notificationContainer');
            if (notificationContainer) {
                const notification = document.createElement('div');
                notification.className = `notification notification-${type}`;
                notification.innerHTML = `
                    <div class="notification-content">
                        <span class="notification-message">${message}</span>
                        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
                    </div>
                `;
                
                notificationContainer.appendChild(notification);
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 5000);
            }
        }
    }

    /**
     * Handle resend verification for password-reset-form.html page
     */
    async handleResendVerificationForPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email') || localStorage.getItem('resetEmail');
        
        if (!email) {
            this.showNotification('No email address found. Please start the password reset process again.', 'error');
            return;
        }

        try {
            const result = await this.resendForgotCode(email);
            
            if (result.success) {
                this.showNotification('New verification code sent! Please check your email.', 'success');
                this.startPageCountdown('verificationCountdown', 'verificationCountdownTimer', 60);
            } else {
                this.showNotification(result.message || 'Failed to resend verification code', 'error');
            }
        } catch (error) {
            console.error('Resend verification error:', error);
            this.showNotification('Failed to resend verification code. Please try again.', 'error');
        }
    }

    /**
     * Start countdown timer for password-reset-form.html page
     */
    startPageCountdown(containerId, timerId, seconds) {
        const container = document.getElementById(containerId);
        const timer = document.getElementById(timerId);
        const resendLink = document.getElementById('resendVerificationLink');
        
        if (!container || !timer || !resendLink) return;
        
        container.style.display = 'block';
        resendLink.style.display = 'none';
        
        let timeLeft = seconds;
        
        const countdown = setInterval(() => {
            timer.textContent = timeLeft;
            timeLeft--;
            
            if (timeLeft < 0) {
                clearInterval(countdown);
                container.style.display = 'none';
                resendLink.style.display = 'inline';
            }
        }, 1000);
    }

    /**
     * Handle OTP form submission
     */
    async handleOtpFormSubmit(e) {
        e.preventDefault();
        
        const otpInputs = document.querySelectorAll('#otpForm .otp-input');
        const otp = Array.from(otpInputs).map(input => input.value).join('');
        
        if (!otp || otp.length !== 6) {
            this.showModalError('Please enter the complete 6-digit verification code');
            return;
        }
        
        const submitBtn = document.querySelector('.verify-btn');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
            submitBtn.disabled = true;
            
            const result = await this.verifyEmail(this.pendingEmail, otp);
            
            if (result.success) {
                this.showModalSuccess('Email verified successfully! You can now login.');
                
                // Close OTP modal and open login modal
                setTimeout(() => {
                    this.closeModal('otpModal');
                    this.openModal('loginModal');
                }, 2000);
            } else {
                this.showModalError(result.message || 'Verification failed. Please try again.');
            }
            
        } catch (error) {
            console.error('OTP verification error:', error);
            this.showModalError('Verification failed. Please try again.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    // ========================================
    // MODAL CONTROL FUNCTIONS
    // ========================================

    /**
     * Open modal
     */
    openModal(modalId) {
        const modalOverlay = document.getElementById(`${modalId}Overlay`);
        if (modalOverlay) {
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.currentModal = modalId;
        }
    }

    /**
     * Close modal
     */
    closeModal(modalId) {
        const modalOverlay = document.getElementById(`${modalId}Overlay`);
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            this.currentModal = null;
            
            // Clear form
            const form = document.getElementById(modalId.replace('Modal', 'Form'));
            if (form) {
                form.reset();
            }
            
            // Remove messages
            this.removeModalMessages(modalId);
        }
    }

    /**
     * Open OTP modal with email
     */
    openOtpModal(email) {
        const userEmailElement = document.getElementById('userEmail');
        if (userEmailElement) {
            userEmailElement.textContent = email;
        }
        this.openModal('otpModal');
    }

    /**
     * Open reset modal with email
     */
    openResetModal(email) {
        const resetUserEmailElement = document.getElementById('resetUserEmail');
        if (resetUserEmailElement) {
            resetUserEmailElement.textContent = email;
        }
        this.openModal('resetModal');
    }

    /**
     * Update login state and UI
     */
    updateLoginState(isLoggedIn, email = null) {
        if (isLoggedIn && email) {
            this.userEmail = email;
            localStorage.setItem('userEmail', email);
            
            // Update desktop login button
            if (typeof updateDesktopLoginButton === 'function') {
                updateDesktopLoginButton(true, email);
            }
            
            // Update mobile login buttons
            const mobileLoginButtons = document.querySelectorAll('.login-btn');
            mobileLoginButtons.forEach(btn => {
                btn.classList.add('logged-in');
                btn.innerHTML = `<i class="fas fa-user"></i> ${email.split('@')[0]}`;
            });
            
            // Update user sidebar info
            if (typeof updateUserSidebarInfo === 'function') {
                updateUserSidebarInfo(email);
            }
            
            // Update mobile sidebar user info and state
            if (typeof updateMobileSidebarUserInfo === 'function') {
                updateMobileSidebarUserInfo(email);
            }
            
            // Switch mobile sidebar to logged-in state
            const loggedOutState = document.getElementById('loggedOutState');
            const loggedInState = document.getElementById('loggedInState');
            if (loggedOutState && loggedInState) {
                loggedOutState.style.display = 'none';
                loggedInState.style.display = 'block';
            }
        } else {
            // Logout
            this.userEmail = null;
            this.accessToken = null;
            this.refreshToken = null;
            localStorage.removeItem('userEmail');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            
            // Update desktop login button
            if (typeof updateDesktopLoginButton === 'function') {
                updateDesktopLoginButton(false);
            }
            
            // Update mobile login buttons
            const mobileLoginButtons = document.querySelectorAll('.login-btn');
            mobileLoginButtons.forEach(btn => {
                btn.classList.remove('logged-in');
                btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            });
            
            // Switch mobile sidebar to logged-out state
            const loggedOutState = document.getElementById('loggedOutState');
            const loggedInState = document.getElementById('loggedInState');
            if (loggedOutState && loggedInState) {
                loggedOutState.style.display = 'block';
                loggedInState.style.display = 'none';
            }
        }
    }

    /**
     * Show user sidebar
     */
    showUserSidebar() {
        if (typeof showUserSidebar === 'function') {
            showUserSidebar();
        }
    }

    /**
     * Register a new user
     */
    async registerUser(userData) {
        console.log('Registering user:', userData);
        
        const registrationData = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.password, // Assuming they match from frontend validation
            captchaToken: userData.captchaToken || await this.getCaptchaToken() // Use provided token or get one
        };

        try {
            const response = await this.makeRequest('/auth/register', 'POST', registrationData);
            
            if (response.success) {
                console.log('Registration successful:', response);
                return response;
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    /**
     * Verify email with OTP code
     */
    async verifyEmail(email, otpCode) {
        console.log('Verifying email:', email, 'with OTP:', otpCode);
        
        const verificationData = {
            email: email,
            otpCode: otpCode
        };

        try {
            const response = await this.makeRequest('/auth/verify-email', 'POST', verificationData);
            
            if (response.success) {
                console.log('Email verification successful:', response);
                return response;
            } else {
                throw new Error(response.message || 'Email verification failed');
            }
        } catch (error) {
            console.error('Email verification error:', error);
            throw error;
        }
    }

    /**
     * Resend verification code
     */
    async resendVerification(email) {
        console.log('Resending verification for:', email);
        
        const resendData = {
            email: email
        };

        try {
            const response = await this.makeRequest('/auth/resend-verification', 'POST', resendData);
            
            if (response.success) {
                console.log('Resend verification successful:', response);
                return response;
            } else {
                throw new Error(response.message || 'Failed to resend verification code');
            }
        } catch (error) {
            console.error('Resend verification error:', error);
            throw error;
        }
    }

    /**
     * Resend password reset code
     */
    async resendForgotCode(email) {
        console.log('Resending forgot password code for:', email);
        
        const resendData = {
            email: email
        };

        try {
            const response = await this.makeRequest('/auth/resend-forgot-code', 'POST', resendData);
            
            if (response.success) {
                console.log('Resend forgot code successful:', response);
                return response;
            } else {
                throw new Error(response.message || 'Failed to resend password reset code');
            }
        } catch (error) {
            console.error('Resend forgot code error:', error);
            throw error;
        }
    }

    /**
     * Login user
     */
    async loginUser(credentials) {
        console.log('Logging in user:', credentials.email);
        
        const loginData = {
            email: credentials.email,
            password: credentials.password,
            captchaToken: credentials.captchaToken || await this.getCaptchaToken() // Use provided token or get one
        };

        try {
            const response = await this.makeRequest('/auth/login', 'POST', loginData);
            
            if (response.success && response.data) {
                console.log('Login successful:', response);
                
                // Store tokens and user data
                if (response.data.tokens) {
                    this.accessToken = response.data.tokens.accessToken;
                    this.refreshToken = response.data.tokens.refreshToken;
                    
                    localStorage.setItem('accessToken', this.accessToken);
                    localStorage.setItem('refreshToken', this.refreshToken);
                }
                
                if (response.data.user) {
                    this.userEmail = response.data.user.email;
                    localStorage.setItem('userEmail', this.userEmail);
                }
                
                return response;
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Logout user
     */
    async logoutUser() {
        console.log('Logging out user');
        
        try {
            const response = await this.makeRequest('/auth/logout', 'POST', {}, true);
            
            // Clear stored tokens and user data regardless of response
            this.clearAuthData();
            
            if (response.success) {
                console.log('Logout successful:', response);
            }
            
            return response;
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local data even if logout request fails
            this.clearAuthData();
            throw error;
        }
    }

    /**
     * Get user information
     */
    async getUserInfo() {
        console.log('Getting user info');
        
        try {
            const response = await this.makeRequest('/auth/user', 'GET', null, true);
            
            if (response.success) {
                console.log('Get user info successful:', response);
                return response;
            } else {
                throw new Error(response.message || 'Failed to get user information');
            }
        } catch (error) {
            console.error('Get user info error:', error);
            throw error;
        }
    }

    /**
     * Forgot password
     */
    async forgotPassword(email) {
        console.log('Sending forgot password request for:', email);
        
        const forgotData = {
            email: email,
            captchaToken: await this.getCaptchaToken() // Get CAPTCHA token
        };

        try {
            const response = await this.makeRequest('/auth/forgot-password', 'POST', forgotData);
            
            if (response.success) {
                console.log('Forgot password successful:', response);
                return response;
            } else {
                throw new Error(response.message || 'Failed to send password reset email');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        }
    }

    /**
     * Reset password
     */
    async resetPassword(resetData) {
        console.log('Resetting password for:', resetData.email);
        
        const requestData = {
            email: resetData.email,
            otpCode: resetData.otp,
            newPassword: resetData.newPassword,
            confirmPassword: resetData.confirmNewPassword
        };

        try {
            const response = await this.makeRequest('/auth/reset-password', 'POST', requestData);
            
            if (response.success) {
                console.log('Password reset successful:', response);
                return response;
            } else {
                throw new Error(response.message || 'Password reset failed');
            }
        } catch (error) {
            console.error('Password reset error:', error);
            throw error;
        }
    }

    /**
     * Change password
     */
    async changePassword(currentPassword, newPassword) {
        console.log('Changing password');
        
        const changeData = {
            currentPassword: currentPassword,
            newPassword: newPassword,
            confirmPassword: newPassword
        };

        try {
            const response = await this.makeRequest('/auth/change-password', 'POST', changeData, true);
            
            if (response.success) {
                console.log('Password change successful:', response);
                return response;
            } else {
                throw new Error(response.message || 'Password change failed');
            }
        } catch (error) {
            console.error('Password change error:', error);
            throw error;
        }
    }

    /**
     * Google OAuth authentication
     */
    async googleAuth(googleData) {
        console.log('Google authentication:', googleData);
        
        const authData = {
            code: googleData.idToken, // Using idToken as code for testing
            redirectUri: window.location.origin + '/auth/callback'
        };

        try {
            const response = await this.makeRequest('/auth/google', 'POST', authData);
            
            if (response.success && response.data) {
                console.log('Google authentication successful:', response);
                
                // Store tokens and user data
                if (response.data.tokens) {
                    this.accessToken = response.data.tokens.accessToken;
                    this.refreshToken = response.data.tokens.refreshToken;
                    
                    localStorage.setItem('accessToken', this.accessToken);
                    localStorage.setItem('refreshToken', this.refreshToken);
                }
                
                if (response.data.user) {
                    this.userEmail = response.data.user.email;
                    localStorage.setItem('userEmail', this.userEmail);
                }
                
                return response;
            } else {
                throw new Error(response.message || 'Google authentication failed');
            }
        } catch (error) {
            console.error('Google authentication error:', error);
            throw error;
        }
    }

    /**
     * Update user information
     */
    async updateUser(userData) {
        console.log('Updating user:', userData);
        
        try {
            const response = await this.makeRequest('/auth/user', 'PUT', userData, true);
            
            if (response.success) {
                console.log('User update successful:', response);
                return response;
            } else {
                throw new Error(response.message || 'User update failed');
            }
        } catch (error) {
            console.error('User update error:', error);
            throw error;
        }
    }

    /**
     * Delete user account
     */
    async deleteAccount(password, confirmationText, reason = 'User requested deletion') {
        console.log('Deleting user account');
        
        const deleteData = {
            password: password,
            confirmationText: confirmationText,
            reason: reason,
            deleteAllData: true
        };

        try {
            const response = await this.makeRequest('/auth/user', 'DELETE', deleteData, true);
            
            // Clear auth data regardless of response
            this.clearAuthData();
            
            if (response.success) {
                console.log('Account deletion successful:', response);
            }
            
            return response;
        } catch (error) {
            console.error('Account deletion error:', error);
            throw error;
        }
    }

    /**
     * Clear authentication data
     */
    clearAuthData() {
        console.log('Clearing authentication data');
        
        this.accessToken = null;
        this.refreshToken = null;
        this.userEmail = null;
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userEmail');
        sessionStorage.removeItem('userEmail');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!(this.accessToken && this.userEmail);
    }

    /**
     * Get current user email
     */
    getCurrentUserEmail() {
        return this.userEmail;
    }

    /**
     * Get access token
     */
    getAccessToken() {
        return this.accessToken;
    }

    /**
     * Test API connectivity
     */
    async testConnection() {
        console.log('Testing API connection...');
        
        try {
            // Try to make a simple request to test connectivity
            const response = await fetch(`${this.baseURL}/auth/register`, {
                method: 'OPTIONS',
                mode: 'cors'
            });
            
            console.log('API connection test result:', response.status);
            return response.ok;
        } catch (error) {
            console.error('API connection test failed:', error);
            return false;
        }
    }

    /**
     * Health check
     */
    async healthCheck() {
        console.log('Performing health check...');
        
        try {
            const response = await this.makeRequest('/health', 'GET');
            console.log('Health check result:', response);
            return response;
        } catch (error) {
            console.error('Health check failed:', error);
            throw error;
        }
    }

    /**
     * Get CAPTCHA token
     */
    async getCaptchaToken() {
        if (!this.captchaEnabled) {
            console.log('CAPTCHA disabled for testing');
            return 'test_token';
        }

        try {
            // Check if Google reCAPTCHA is available
            if (typeof grecaptcha !== 'undefined') {
                return new Promise((resolve, reject) => {
                    grecaptcha.ready(function() {
                        grecaptcha.execute('6LdEZtArAAAAABY0urfvtfqD0BVI9H6rDSv-Irba', {action: 'submit'}).then(function(token) {
                            console.log('CAPTCHA token generated:', token);
                            resolve(token);
                        }).catch(function(error) {
                            console.error('CAPTCHA token generation failed:', error);
                            reject(error);
                        });
                    });
                });
            } else {
                console.warn('Google reCAPTCHA not available, using test token');
                return 'test_token';
            }
        } catch (error) {
            console.error('CAPTCHA token generation error:', error);
            return 'test_token';
        }
    }

    /**
     * Disable CAPTCHA for testing
     */
    disableCaptcha() {
        this.captchaEnabled = false;
        console.log('CAPTCHA disabled for testing');
    }

    /**
     * Enable CAPTCHA
     */
    enableCaptcha() {
        this.captchaEnabled = true;
        console.log('CAPTCHA enabled');
    }

    /**
     * Clear authentication data
     */
    clearAuthData() {
        this.accessToken = null;
        this.refreshToken = null;
        this.userEmail = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userEmail');
        console.log('Authentication data cleared');
    }

    /**
     * Test API connection
     */
    async testConnection() {
        try {
            const response = await this.makeRequest('/health', 'GET');
            return response && response.status === 'ok';
        } catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return !!(this.accessToken && this.userEmail);
    }

    /**
     * Get current user email
     */
    getCurrentUserEmail() {
        return this.userEmail;
    }

    /**
     * Initialize login state on page load
     */
    initializeLoginState() {
        if (this.isLoggedIn()) {
            this.updateLoginState(true, this.userEmail);
        }
    }
}

// Create global instance
const awsAuth = new AWSAuth();

// Make it globally available
window.awsAuth = awsAuth;

// Global functions for HTML integration
window.openLoginModal = function() {
    awsAuth.openModal('loginModal');
};

window.closeLoginModal = function() {
    awsAuth.closeModal('loginModal');
};

window.openRegisterModal = function() {
    awsAuth.openModal('registerModal');
};

window.closeRegisterModal = function() {
    awsAuth.closeModal('registerModal');
};

window.openForgotModal = function() {
    awsAuth.openModal('forgotModal');
};

window.closeForgotModal = function() {
    awsAuth.closeModal('forgotModal');
};

window.openOtpModal = function(email) {
    awsAuth.openOtpModal(email);
};

window.closeOtpModal = function() {
    awsAuth.closeModal('otpModal');
};

window.verifyCode = function() {
    const otpInputs = document.querySelectorAll('.otp-input');
    const code = Array.from(otpInputs).map(input => input.value).join('');
    
    if (code.length === 6) {
        awsAuth.handleOtpFormSubmit({ preventDefault: () => {} });
    } else {
        awsAuth.showModalError('Please enter all 6 digits');
    }
};

window.handleResend = function() {
    awsAuth.handleResendVerification();
};

window.showLogin = function() {
    awsAuth.openModal('loginModal');
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing AWS Auth...');
    
    // Initialize login state
    awsAuth.initializeLoginState();
    
    // Test API connection
    console.log('Testing AWS API connection...');
    awsAuth.testConnection().then(isConnected => {
        if (isConnected) {
            console.log('✅ AWS API connection successful');
        } else {
            console.log('❌ AWS API connection failed');
        }
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AWSAuth;
}
