// js/navigation.js
import { supabase } from './supabase-config.js';

// Function to handle logout
async function handleLogout() {
    try {
        console.log('Logout clicked');
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw error;
        }
        console.log('Logout successful');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
    }
}

// Function to update navigation based on login status
async function updateNavigation() {
    try {
        const authNav = document.getElementById('authNav');
        if (!authNav) return;

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            // User is logged in - Show ONLY Logout button
            authNav.innerHTML = `
                <a class="nav-link" href="#" id="logoutBtn">Logout (${user.user_metadata?.full_name || user.email})</a>
            `;
            
            // Add logout functionality - IMPORTANT: Wait for DOM update
            setTimeout(() => {
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        handleLogout();
                    });
                }
            }, 100);
            
        } else {
            // User is not logged in - Show login/signup buttons
            authNav.innerHTML = `
                <a class="nav-link" href="login.html">Login</a>
                <a class="nav-link" href="login.html">Sign Up</a>
            `;
        }
    } catch (error) {
        console.log('Navigation update error:', error);
    }
}

// Initialize navigation when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    
    // Update navigation when auth state changes
    supabase.auth.onAuthStateChange((event) => {
        console.log('Auth state changed:', event);
        updateNavigation();
    });
});

// Make functions available globally for debugging
window.updateNavigation = updateNavigation;
window.handleLogout = handleLogout;