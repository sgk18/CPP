/**
 * Client-side authentication using sessionStorage.
 * credentials: bds2025 / BDS@705
 */

const AUTH_KEY = 'cpp_auth_session';

const Auth = {
    /**
     * strict session-based authentication.
     * Uses sessionStorage ONLY. Authentication persists only as long as the tab/window is open.
     * Closing the browser destroys the session.
     */
    isAuthenticated: function () {
        return sessionStorage.getItem(AUTH_KEY) === 'true';
    },

    login: function (username, password) {
        if (username === 'admin@gmail.com' && password === '0123456789') {
            sessionStorage.setItem(AUTH_KEY, 'true');
            return true;
        }
        return false;
    },

    logout: function () {
        sessionStorage.removeItem(AUTH_KEY);
        window.location.href = 'login.html';
    },

    // Helper to protect dashboard pages
    requireLogin: function () {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }
};
