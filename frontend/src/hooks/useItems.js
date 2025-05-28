import { useState } from 'react';
import { createNewItem } from '../utils/itemFactory';

export const useItems = (initialItems = []) => {
    const [items, setItems] = useState(initialItems);
    const [selectedId, setSelectedId] = useState(null);

    const addItem = (type, x, y) => {
        const newItem = createNewItem(type, x, y);
        setItems(prev => [...prev, newItem]);
        setSelectedId(newItem.id);
        return newItem;
    };

    const updateItem = (id, updates) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    };

    const updateItemData = (id, dataUpdates) => {
        setItems(prev => prev.map(item =>
            item.id === id
                ? { ...item, data: { ...item.data, ...dataUpdates } }
                : item
        ));
    };

    const deleteItem = (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
        if (selectedId === id) {
            setSelectedId(null);
        }
    };

    const moveItem = (id, x, y) => {
        updateItem(id, { x, y });
    };

    const getSelectedItem = () => {
        return items.find(item => item.id === selectedId);
    };

    return {
        items,
        selectedId,
        setSelectedId,
        addItem,
        updateItem,
        updateItemData,
        deleteItem,
        moveItem,
        getSelectedItem
    };
};