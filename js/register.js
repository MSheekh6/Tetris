import { Validator } from './validation.js';

class RegistrationForm {
    constructor() {
        this.form = document.getElementById('registerForm');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        const inputs = this.form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });

        const avatarInputs = this.form.querySelectorAll('input[name="avatar"]');
        avatarInputs.forEach(input => {
            input.addEventListener('change', () => this.clearError(input));
        });
    }

    validateField(field) {
        const fieldName = field.id;
        const value = field.value.trim();
        let error = null;

        switch (fieldName) {
            case 'username':
                error = Validator.validateUsername(value);
                break;
            case 'email':
                error = Validator.validateEmail(value);
                break;
            case 'password':
                error = Validator.validatePassword(value);
                break;
            case 'confirmPassword':
                const password = document.getElementById('password').value;
                if (!value) {
                    error = 'Please confirm your password';
                } else if (value !== password) {
                    error = 'Passwords do not match';
                }
                break;
            case 'displayName':
                error = Validator.validateDisplayName(value);
                break;
            case 'favoriteColor':
                error = Validator.validateRequired(value, 'Favorite color');
                break;
        }

        if (error) {
            this.showError(fieldName, error);
            return false;
        }

        return true;
    }

    validateAvatar() {
        const avatar = this.form.querySelector('input[name="avatar"]:checked');
        if (!avatar) {
            this.showError('avatar', 'Please select an avatar');
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
        const fieldName = field.id || field.name;
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

        let isValid = true;

        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const displayName = document.getElementById('displayName');
        const favoriteColor = document.getElementById('favoriteColor');

        if (!this.validateField(username)) isValid = false;
        if (!this.validateField(email)) isValid = false;
        if (!this.validateField(password)) isValid = false;
        if (!this.validateField(confirmPassword)) isValid = false;
        if (!this.validateField(displayName)) isValid = false;
        if (!this.validateField(favoriteColor)) isValid = false;
        if (!this.validateAvatar()) isValid = false;

        if (!isValid) {
            this.showMessage('Please fix the errors above', true);
            return;
        }

        const users = JSON.parse(localStorage.getItem('tetrisUsers')) || [];

        if (users.some(u => u.email === email.value.trim())) {
            this.showMessage('Email already registered', true);
            this.showError('email', 'This email is already registered');
            return;
        }

        if (users.some(u => u.username === username.value.trim())) {
            this.showMessage('Username already taken', true);
            this.showError('username', 'This username is already taken');
            return;
        }

        const avatar = this.form.querySelector('input[name="avatar"]:checked');

        const newUser = {
            username: username.value.trim(),
            email: email.value.trim(),
            password: password.value,
            displayName: displayName.value.trim(),
            favoriteColor: favoriteColor.value,
            avatar: avatar.value,
            highScore: 0,
            level: 0,
            lines: 0,
            registeredAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('tetrisUsers', JSON.stringify(users));

        this.showMessage('Account created successfully! Redirecting to login...', false);

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RegistrationForm();
});
