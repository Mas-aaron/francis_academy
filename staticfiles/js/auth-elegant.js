/**
 * ELEGANT AUTH PAGES INTERACTIONS
 * Password visibility, strength checker, form validation
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== Password Toggle =====
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = this.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        this.classList.add('active');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        this.classList.remove('active');
      }
    });
  });
  
  // ===== Password Strength Checker =====
  const password1 = document.getElementById('password1');
  const passwordStrength = document.getElementById('passwordStrength');
  
  if (password1 && passwordStrength) {
    password1.addEventListener('input', function() {
      const password = this.value;
      
      if (password.length === 0) {
        passwordStrength.classList.remove('active', 'strength-weak', 'strength-medium', 'strength-strong');
        return;
      }
      
      const strength = calculatePasswordStrength(password);
      
      passwordStrength.classList.add('active');
      passwordStrength.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
      passwordStrength.classList.add(`strength-${strength}`);
    });
  }
  
  function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength++;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength++;
    
    // Contains numbers
    if (/[0-9]/.test(password)) strength++;
    
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  }
  
  // ===== Form Validation =====
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      let isValid = true;
      
      // Clear previous errors
      document.querySelectorAll('.form-error').forEach(error => {
        if (!error.classList.contains('server-error')) {
          error.remove();
        }
      });
      
      // Username validation
      const username = document.getElementById('username');
      if (username && username.value.length < 3) {
        showError(username, 'Username must be at least 3 characters');
        isValid = false;
      }
      
      // Email validation
      const email = document.getElementById('email');
      if (email && !isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      }
      
      // Password match validation
      const password1 = document.getElementById('password1');
      const password2 = document.getElementById('password2');
      
      if (password1 && password2 && password1.value !== password2.value) {
        showError(password2, 'Passwords do not match');
        isValid = false;
      }
      
      // Password strength validation
      if (password1 && password1.value.length < 8) {
        showError(password1, 'Password must be at least 8 characters');
        isValid = false;
      }
      
      // Terms checkbox
      const terms = document.querySelector('input[name="terms"]');
      if (terms && !terms.checked) {
        showError(terms, 'You must agree to the terms and conditions');
        isValid = false;
      }
      
      if (!isValid) {
        e.preventDefault();
        return false;
      }
      
      // Show loading state
      showLoading(this);
    });
  }
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      const username = document.getElementById('username');
      const password = document.getElementById('password');
      
      let isValid = true;
      
      if (!username.value.trim()) {
        showError(username, 'Please enter your username or email');
        isValid = false;
      }
      
      if (!password.value) {
        showError(password, 'Please enter your password');
        isValid = false;
      }
      
      if (!isValid) {
        e.preventDefault();
        return false;
      }
      
      // Show loading state
      showLoading(this);
    });
  }
  
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    // Remove existing error
    const existingError = formGroup.querySelector('.form-error');
    if (existingError && !existingError.classList.contains('server-error')) {
      existingError.remove();
    }
    
    // Add new error
    const error = document.createElement('span');
    error.className = 'form-error';
    error.textContent = message;
    formGroup.appendChild(error);
    
    // Add error styling to input
    input.style.borderColor = '#ef4444';
    
    // Remove error on input
    input.addEventListener('input', function() {
      this.style.borderColor = '';
      error.remove();
    }, { once: true });
  }
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  function showLoading(form) {
    const submitBtn = form.querySelector('.btn-auth-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    submitBtn.disabled = true;
  }
  
  // ===== Social Auth (Placeholder) =====
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const platform = this.classList.contains('social-google') ? 'Google' : 'GitHub';
      alert(`${platform} authentication coming soon!`);
    });
  });
  
  // ===== Real-time Username Check (Optional) =====
  const usernameInput = document.getElementById('username');
  if (usernameInput && signupForm) {
    let usernameTimeout;
    
    usernameInput.addEventListener('input', function() {
      clearTimeout(usernameTimeout);
      const username = this.value.trim();
      
      if (username.length < 3) return;
      
      usernameTimeout = setTimeout(() => {
        // TODO: Check username availability with AJAX
        // For now, just validate format
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
          showError(this, 'Username can only contain letters, numbers, and underscores');
        }
      }, 500);
    });
  }
  
  // ===== Auto-focus First Input =====
  const firstInput = document.querySelector('.auth-form input:not([type="hidden"])');
  if (firstInput && !firstInput.hasAttribute('autofocus')) {
    firstInput.focus();
  }
  
  // ===== Keyboard Shortcuts =====
  document.addEventListener('keydown', function(e) {
    // ESC to clear form
    if (e.key === 'Escape') {
      const activeInput = document.activeElement;
      if (activeInput && activeInput.tagName === 'INPUT') {
        activeInput.blur();
      }
    }
  });
  
  // ===== Animations =====
  const formWrapper = document.querySelector('.auth-form-wrapper');
  if (formWrapper) {
    formWrapper.style.opacity = '0';
    formWrapper.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      formWrapper.style.transition = 'all 0.6s ease';
      formWrapper.style.opacity = '1';
      formWrapper.style.transform = 'translateY(0)';
    }, 100);
  }
  
  // ===== Console Message =====
  console.log('%c Auth Pages Enhanced! ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 14px; padding: 6px 12px; border-radius: 4px;');
});
