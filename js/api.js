import { uploadImageToSupabase } from './supabase-rest.js'

const API_URL = 'http://localhost:3000/api';

function getNextGoodId(goods) {
    if (goods.length === 0) return 1;
    const maxId = Math.max(...goods.map(p => p.id));
    return maxId + 1;
}


function getNextUserId(users) {
    if (users.length === 0) return 1;
    const maxId = Math.max(...users.map(u => u.id));
    return maxId + 1;
}


export async function getGoods() {
    try {
        const response = await fetch(`${API_URL}/goods`);
        const data = await response.json();
        return data.goods || [];
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        return [];
    }
}


async function saveGoods(goods) {
    try {
        return true;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        return false;
    }
}


export async function getUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        const data = await response.json();
        return data.users || [];
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
        return [];
    }
}


async function saveUsers(users) {
    try {
        return true;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        return false;
    }
}


export async function addGood(product, imageFile = null) {
    try {
        console.log('➕ Добавляем товар...', product);
        
        let imageUrl = product.image;
        
        
        if (imageFile) {
            try {
                console.log('🖼️ Загружаем изображение в Supabase...');
                imageUrl = await uploadImageToSupabase(imageFile);
                console.log('✅ Изображение загружено:', imageUrl);
            } catch (error) {
                console.error('❌ Ошибка загрузки изображения:', error);
                imageUrl = URL.createObjectURL(imageFile);
            }
        }
        
        const newProduct = {
            ...product,
            image: imageUrl
        };
        
        const response = await fetch(`${API_URL}/goods`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct)
        });
        
        const data = await response.json();
        console.log('✅ Товар добавлен:', data.product);
        return data.product;
        
    } catch (error) {
        console.error('❌ Ошибка добавления товара:', error);
        throw error;
    }
}


export async function updateGood(id, updatedProduct, imageFile = null) {
    try {
        console.log('🔄 Обновляем товар...', id);
        
        let imageUrl = updatedProduct.image;
        
        if (imageFile) {
            try {
                imageUrl = await uploadImageToSupabase(imageFile);
            } catch (error) {
                console.error('Ошибка загрузки изображения:', error);
                imageUrl = URL.createObjectURL(imageFile);
            }
        }
        
        const productToUpdate = {
            ...updatedProduct,
            image: imageUrl
        };
        
        const response = await fetch(`${API_URL}/goods/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productToUpdate)
        });
        
        const data = await response.json();
        return data.product;
        
    } catch (error) {
        console.error('❌ Ошибка обновления товара:', error);
        throw error;
    }
}



export async function deleteGood(id) {
    try {
        const response = await fetch(`${API_URL}/goods/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Товар не найден');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Ошибка удаления товара:', error);
        throw error;
    }
}

export async function addUser(user) {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...user,
                role: user.role || 'user'
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка добавления пользователя');
        }
        
        return data.user;
    } catch (error) {
        console.error('❌ Ошибка добавления пользователя:', error);
        throw error;
    }
}

export async function updateUser(id, updatedUser) {
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка обновления пользователя');
        }
        
        return data.user;
    } catch (error) {
        console.error('❌ Ошибка обновления пользователя:', error);
        throw error;
    }
}

export async function deleteUser(id) {
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка удаления пользователя');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Ошибка удаления пользователя:', error);
        throw error;
    }
}
