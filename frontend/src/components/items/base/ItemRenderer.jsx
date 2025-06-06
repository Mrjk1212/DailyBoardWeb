import React from "react";
import { ITEM_TYPES } from "../../../constants/itemTypes";
import StickyNote from "../sticky-note/StickyNote";
import TodoList from "../todo-list/TodoList";
//import GoalNote from "../goal-note/GoalNote";

const ItemRenderer = ({ item, isSelected, onDragEnd, onSelect, onDoubleClick, onResize, isDraggable = true, onDelete }) => {
    const commonProps = {
        item,
        isSelected,
        onDragEnd,
        onSelect,
        onDoubleClick,
        onResize,
        isDraggable,
        onDelete
    };

    switch (item.type) {
        case ITEM_TYPES.STICKY_NOTE:
            return <StickyNote {...commonProps} />;
        case ITEM_TYPES.TODO_LIST:
            return <TodoList {...commonProps}/>
        default:
            return null;
    }
};

export default ItemRenderer;