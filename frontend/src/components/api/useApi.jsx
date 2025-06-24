// Updated api.js
function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

const API_URL = 'http://localhost:8080/api/items'; // Updated to Spring Boot port

export async function fetchItems() {
    const res = await fetch(API_URL, {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
    });
    const items = await res.json();
    return items.map(item => ({
        ...item,
        data: typeof item.data === 'string' ? JSON.parse(item.data) : item.data,
    }));
}

export async function createItem(item) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(item),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to create item: ${res.status} - ${text}`);
    }

    return res.json();
}

export const updateItem = async (item) => {
    const response = await fetch(`${API_URL}/${item.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(item),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to update item: ${response.status} - ${text}`);
    }
    return response.json();
};

export async function deleteItem(id) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
    });
    if (!res.ok) throw new Error('Failed to soft delete item');
}

export async function undeleteItem(id) {
    const res = await fetch(`${API_URL}/${id}/undelete`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
    });
    if (!res.ok) throw new Error('Failed to undelete item');
}

// Add user info fetch
export async function fetchUserInfo() {
    const res = await fetch('http://localhost:8080/auth/user', {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch user info');
    }

    return res.json();
}