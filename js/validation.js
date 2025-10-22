export class Validator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return 'Email is required';
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address with @';
        }
        return null;
    }

    static validatePassword(password) {
        if (!password) {
            return 'Password is required';
        }
        if (password.length < 8) {
            return 'Password must be at least 8 characters';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one number';
        }
        return null;
    }

    static validateUsername(username) {
        if (!username) {
            return 'Username is required';
        }
        if (username.length < 3) {
            return 'Username must be at least 3 characters';
        }
        if (username.length > 20) {
            return 'Username must be less than 20 characters';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return 'Username can only contain letters, numbers, and underscores';
        }
        return null;
    }

    static validateDisplayName(displayName) {
        if (!displayName) {
            return 'Display name is required';
        }
        if (displayName.length < 2) {
            return 'Display name must be at least 2 characters';
        }
        if (displayName.length > 30) {
            return 'Display name must be less than 30 characters';
        }
        return null;
    }

    static validateRequired(value, fieldName) {
        if (!value) {
            return `${fieldName} is required`;
        }
        return null;
    }
}
