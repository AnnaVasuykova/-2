const API_URL = 'http://localhost:3000/api';

export async function loginUser(login, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            return { success: true, user: data.user };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        return { success: false, error: 'Ошибка системы' };
    }
}

export async function registerUser(login, password, name, email) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password, name, email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            return { success: true, user: data.user };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        return { success: false, error: 'Ошибка системы' };
    }
}

export function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

export function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'registr.html';
}

export function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

export function updateUserHeader() {
    const user = getCurrentUser();
    const userInfoElement = document.getElementById('userInfo');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminBtn = document.getElementById('adminBtn');
    const authBtn = document.getElementById('authBtn');
    
    if (userInfoElement) {
        userInfoElement.textContent = user ? `Привет, ${user.name}!` : '';
    }
    
    if (logoutBtn) {
        logoutBtn.style.display = user ? 'block' : 'none';
    }
    
    if (authBtn) {
        authBtn.style.display = user ? 'none' : 'block';
    }
    
    if (adminBtn) {
        adminBtn.style.display = isAdmin() ? 'block' : 'none';
    }
}
