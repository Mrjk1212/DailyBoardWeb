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

export const updateItem = async (item) => {
    console.log("Sending update payload:", item); // 👈 ADD THIS
    const response = await fetch(`/api/items/${item.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
    });

    if (!response.ok) {
        const text = await response.text(); // 👈 for debugging
        throw new Error(`Failed to update item: ${response.status} - ${text}`);
    }

    return response.json();
};

export async function deleteItem(id) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        throw new Error('Failed to delete item');
    }

    return;
}