const USERS_KEY = 'cinemax_users';
const SESSION_KEY = 'cinemax_session';

export const authService = {
    // Register a new user
    register: (userData) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const existingUser = users.find(u => u.email === userData.email);

        if (existingUser) {
            return { success: false, message: 'Bu e-posta adresi zaten kayıtlı.' };
        }

        const newUser = { ...userData, id: Date.now() };
        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        // Auto login after register
        localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
        return { success: true, user: newUser };
    },

    // Login existing user
    login: (email, password) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Mock Location & Device for History
            const historyItem = {
                date: new Date().toISOString(),
                location: "Istanbul, TR", // Mocked
                device: "Chrome (Windows)" // Mocked
            };

            // Update user history
            const newHistory = [historyItem, ...(user.history || [])].slice(0, 5); // Keep last 5
            user.history = newHistory;

            // Update in DB
            const index = users.findIndex(u => u.email === email);
            users[index] = user;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));

            // Create session
            const session = { ...user, isLoggedIn: true };
            delete session.password; // Don't store password in session
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
            return { success: true, user: session };
        }

        return { success: false, message: 'Invalid credentials' };
    },

    changePassword: (email, currentPassword, newPassword) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const index = users.findIndex(u => u.email === email && u.password === currentPassword);

        if (index !== -1) {
            users[index].password = newPassword;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            return { success: true };
        }
        return { success: false, message: 'Incorrect current password' };
    },

    updateUser: (updatedUser) => {
        // Update active session
        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));

        // Update in users database
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const index = users.findIndex(u => u.email === updatedUser.email);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedUser };
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
    },

    // Get current session
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    },

    // Logout
    logout: () => {
        localStorage.removeItem(SESSION_KEY);
    }
};
