import React from "react";
import StickyNote from "../sticky-note/StickyNote";
import TodoList from "../todo-list/TodoList";
import { ITEM_TYPES } from "../../../constants/itemTypes";

const ItemRenderer = ({ item, isSelected, onDragEnd, onSelect, onDoubleClick, onResize, isDraggable, onDelete, onUpdate }) => {
    const commonProps = {
        item,
        isSelected,
        onDragEnd,
        onSelect,
        onDoubleClick,
        onResize,
        isDraggable,
        onDelete,
        onUpdate,
    };

    switch (item.type) {
        case ITEM_TYPES.STICKY_NOTE:
            return <StickyNote {...commonProps} />;
        case ITEM_TYPES.TODO_LIST:
            return <TodoList {...commonProps} />;
        default:
            return null;
    }
};

export default ItemRenderer;