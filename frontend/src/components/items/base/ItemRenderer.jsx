import React from "react";
import { ITEM_TYPES } from "../../../constants/itemTypes";
import StickyNote from "../sticky-note/StickyNote";
import TodoList from "../todo-list/TodoList";
import GoalNote from "../goal-note/GoalNote";

const ItemRenderer = ({
    item,
    isSelected,
    onDragEnd,
    onSelect,
    onDoubleClick
}) => {
    const commonProps = {
        item,
        isSelected,
        onDragEnd,
        onSelect,
        onDoubleClick
    };

    switch (item.type) {
        case ITEM_TYPES.STICKY_NOTE:
            return <StickyNote {...commonProps} />;
        case ITEM_TYPES.TODO_LIST:
            return <TodoList {...commonProps} />;
        case ITEM_TYPES.GOAL_NOTE:
            return <GoalNote {...commonProps} />;
        default:
            return null;
    }
};

export default ItemRenderer;