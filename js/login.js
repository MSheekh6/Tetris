import { Validator } from './validation.js';

class LoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        const emailInput = document.getElementById('email');
        emailInput.addEventListener('blur', () => this.validateEmail());
        emailInput.addEventListener('input', () => this.clearError(emailInput));

        const passwordInput = document.getElementById('password');
        passwordInput.addEventListener('input', () => this.clearError(passwordInput));
    }

    validateEmail() {
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();
        
        if (!email) {
            return false;
        }

        const emailError = Validator.validateEmail(email);
        if (emailError) {
            this.showError('email', emailError);
            return false;
        }

        return true;
    }

    showError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        const inputElement = document.getElementById(fieldName);

        if (errorElement) {
            errorElement.textContent = message;
        }

        if (inputElement) {
            inputElement.classList.add('error');
        }
    }

    clearError(field) {
        const fieldName = field.id;
        const errorElement = document.getElementById(`${fieldName}Error`);
        const inputElement = document.getElementById(fieldName);

        if (errorElement) {
            errorElement.textContent = '';
        }

        if (inputElement) {
            inputElement.classList.remove('error');
        }
    }

    showMessage(message, isError = false) {
        const successElement = document.getElementById('successMessage');
        const errorElement = document.getElementById('errorMessage');

        if (isError) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
            successElement.classList.add('hidden');
        } else {
            successElement.textContent = message;
            successElement.classList.remove('hidden');
            errorElement.classList.add('hidden');
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        const emailError = Validator.validateEmail(email);
        if (emailError) {
            this.showError('email', emailError);
            this.showMessage('Please enter a valid email', true);
            return;
        }

        if (!password) {
            this.showError('password', 'Password is required');
            this.showMessage('Please enter your password', true);
            return;
        }

        const users = JSON.parse(localStorage.getItem('tetrisUsers')) || [];

        const user = users.find(u => u.email === email);

        if (!user) {
            this.showError('email', 'Email not found');
            this.showMessage('No account found with this email', true);
            return;
        }

        if (user.password !== password) {
            this.showError('password', 'Incorrect password');
            this.showMessage('Incorrect password. Please try again', true);
            return;
        }

        localStorage.setItem('currentUser', JSON.stringify({
            email: user.email,
            username: user.username,
            displayName: user.displayName
        }));

        this.showMessage('Login successful! Starting game...', false);

        setTimeout(() => {
            window.location.href = 'game.html';
        }, 1500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoginForm();
});
