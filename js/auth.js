/**
 * Authentication and Route Guarding Logic
 * Simulates a frontend-only authentication system using localStorage.
 */

const AUTH_KEY = 'currentUserRole';

// Simple Auth Guard - Runs immediately on page load
function authGuard() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentUserRole = localStorage.getItem(AUTH_KEY);

    // If on login page, redirect if already logged in
    if (currentPath === 'login.html') {
        if (currentUserRole === 'student') {
            window.location.href = 'index.html';
        } else if (currentUserRole === 'admin') {
            window.location.href = 'admin.html';
        }
        return; // Stop further checks on login page
    }

    // If not logged in and trying to access a protected page
    if (!currentUserRole) {
        window.location.href = 'login.html';
        return;
    }

    // Role-based route guarding
    const isAdminPage = currentPath.startsWith('admin');
    
    if (isAdminPage && currentUserRole !== 'admin') {
        alert('Access Denied: You need Administrator privileges to view this page.');
        window.location.href = 'index.html';
    } else if (!isAdminPage && currentUserRole === 'admin') {
        // Optional: prevent admin from viewing student pages directly, or just warn
        // We'll allow it but you could force redirect back to admin.html
    }
}

// Run the auth guard immediately
authGuard();

document.addEventListener('DOMContentLoaded', () => {
    
    // --- LOGIN PAGE LOGIC ---
    const studentForm = document.getElementById('student-login-form');
    const adminForm = document.getElementById('admin-login-form');

    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('student-email').value;
            const password = document.getElementById('student-password').value;

            // Mock Validation
            if (email === 'student@ku.edu' && password === 'password123') {
                localStorage.setItem(AUTH_KEY, 'student');
                window.location.href = 'index.html';
            } else {
                alert('Invalid Student Credentials. Try student@ku.edu / password123');
            }
        });
    }

    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;

            // Mock Validation
            if (email === 'admin@ku.edu' && password === 'admin123') {
                localStorage.setItem(AUTH_KEY, 'admin');
                window.location.href = 'admin.html';
            } else {
                alert('Invalid Admin Credentials. Try admin@ku.edu / admin123');
            }
        });
    }

    // --- LOGOUT LOGIC ---
    // Attach logout event to any element with id="logout-btn" or class="logout-btn"
    const logoutBtns = document.querySelectorAll('.logout-btn, #logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem(AUTH_KEY);
            window.location.href = 'login.html';
        });
    });

});
