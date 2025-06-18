import React from "react";
import StickyNote from "../sticky-note/StickyNote";
import TodoList from "../todo-list/TodoList";
import { ITEM_TYPES } from "../../../constants/itemTypes";
import Calendar from "../calendar/Calendar";
import GoalNote from "../goal-note/GoalNote";
import LinkNote from "../link-note/LinkNote";

const ItemRenderer = React.memo(({ 
    item, 
    isSelected, 
    onDragEnd, 
    onSelect, 
    onDoubleClick, 
    onResize, 
    isDraggable, 
    onDelete, 
    onUpdate 
}) => {
    // Don't recreate commonProps object - pass props directly (somehow this creates new stuff for every re-render and is slow AF)
    switch (item.type) {
        case ITEM_TYPES.STICKY_NOTE:
            return (
                <StickyNote
                    item={item}
                    isSelected={isSelected}
                    onDragEnd={onDragEnd}
                    onSelect={onSelect}
                    onDoubleClick={onDoubleClick}
                    onResize={onResize}
                    isDraggable={isDraggable}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            );
        case ITEM_TYPES.TODO_LIST:
            return (
                <TodoList
                    item={item}
                    isSelected={isSelected}
                    onDragEnd={onDragEnd}
                    onSelect={onSelect}
                    onDoubleClick={onDoubleClick}
                    onResize={onResize}
                    isDraggable={isDraggable}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            );

        case ITEM_TYPES.CALENDAR:
            return (
                <Calendar
                    item={item}
                    isSelected={isSelected}
                    onDragEnd={onDragEnd}
                    onSelect={onSelect}
                    onDoubleClick={onDoubleClick}
                    onResize={onResize}
                    isDraggable={isDraggable}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            );
        case ITEM_TYPES.GOAL_NOTE:
        return (
            <GoalNote
                item={item}
                isSelected={isSelected}
                onDragEnd={onDragEnd}
                onSelect={onSelect}
                onDoubleClick={onDoubleClick}
                onResize={onResize}
                isDraggable={isDraggable}
                onDelete={onDelete}
                onUpdate={onUpdate}
            />
        );
        case ITEM_TYPES.LINK:
        return (
            <LinkNote
                item={item}
                isSelected={isSelected}
                onDragEnd={onDragEnd}
                onSelect={onSelect}
                onDoubleClick={onDoubleClick}
                onResize={onResize}
                isDraggable={isDraggable}
                onDelete={onDelete}
                onUpdate={onUpdate}
            />
        );
        default:
            return null;
    }
});

ItemRenderer.displayName = 'ItemRenderer';

export default ItemRenderer;