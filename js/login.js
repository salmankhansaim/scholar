// js/auth.js
import { supabase } from './supabase-config.js';

// Function to show message to user
function showMessage(elementId, message, type) {
    try {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.textContent = message;
        element.classList.remove('d-none', 'alert-success', 'alert-danger', 'alert-warning');
        element.classList.add(`alert-${type}`);
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                element.classList.add('d-none');
            }, 5000);
        }
    } catch (error) {
        console.log('Error showing message:', error);
    }
}

// Function to handle user SIGN UP
async function handleSignUp(event) {
    try {
        event.preventDefault();
        
        const signupMessage = document.getElementById('signupMessage');
        if (signupMessage) signupMessage.classList.add('d-none');

        // Get form values
        const userData = {
            firstName: document.getElementById('signupFirstName').value,
            lastName: document.getElementById('signupLastName').value,
            email: document.getElementById('signupEmail').value,
            phone: document.getElementById('signupPhone').value,
            password: document.getElementById('signupPassword').value
        };

        // Create user with email verification
        const { error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                data: {
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    full_name: `${userData.firstName} ${userData.lastName}`,
                    phone: userData.phone
                },
                emailRedirectTo: `${window.location.origin}/scholar/login.html`
            }
        });

        if (error) {
            throw error;
        }

        // Success message
        showMessage(
            'signupMessage',
            '🎉 Account created! Please check your email (including spam folder) for a verification link. You must verify your email before you can login.',
            'success'
        );
        
        // Clear form
        document.getElementById('signupForm').reset();

    } catch (error) {
        console.log('Sign up error:', error);
        showMessage('signupMessage', `❌ Error: ${error.message}`, 'danger');
    }
}

// Function to handle user LOGIN
async function handleLogin(event) {
    try {
        event.preventDefault();
        
        const loginMessage = document.getElementById('loginMessage');
        if (loginMessage) loginMessage.classList.add('d-none');

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            throw error;
        }

        // Check if email is verified
        if (data.user && !data.user.email_confirmed_at) {
            throw new Error('Email not verified. Please check your email for the verification link.');
        }

        // Success - redirect to homepage
        showMessage('loginMessage', '✅ Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    } catch (error) {
        console.log('Login error:', error);
        
        // User-friendly error messages
        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
            errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.message.includes('Email not verified')) {
            errorMessage = 'Email not verified. Please check your email for the verification link.';
        }
        
        showMessage('loginMessage', `❌ ${errorMessage}`, 'danger');
    }
}

// Function to check URL for verification success
function checkVerificationStatus() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const verificationStatus = urlParams.get('verification');
        
        if (verificationStatus === 'success') {
            showMessage('loginMessage', '✅ Email verified successfully! You can now login.', 'success');
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    } catch (error) {
        console.log('Error checking verification status:', error);
    }
}

// Initialize auth functionality when page loads
function initializeAuth() {
    try {
        // Check if user just verified their email
        checkVerificationStatus();
        
        // Add event listeners to forms
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
        
        if (signupForm) {
            signupForm.addEventListener('submit', handleSignUp);
        }
        
        // Check if user is already logged in
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user && user.email_confirmed_at) {
                window.location.href = 'index.html';
            }
        }).catch(error => {
            console.log('Error checking user auth state:', error);
        });
        
    } catch (error) {
        console.log('Error initializing auth:', error);
    }
}

// Start everything when page loads
document.addEventListener('DOMContentLoaded', initializeAuth);
