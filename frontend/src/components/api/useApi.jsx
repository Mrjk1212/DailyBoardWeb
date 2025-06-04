const API_URL = 'http://localhost:3000/api/items';

export async function fetchItems() {
    const res = await fetch(API_URL);
    return res.json();
}

export async function createItem(item) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    });
    return res.json();
}

export async function updateItem(item) {
    const res = await fetch(`${API_URL}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    });
    return res.json();
}

export async function deleteItem(id) {
    return fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}