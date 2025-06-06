import React from "react";
import { Group, Rect, Text } from "react-konva";

const TodoList = ({ item, isSelected, onDragEnd, onSelect, onDoubleClick, onResize, isDraggable }) => {
    const { x, y, width, height, data } = item;
    const todos = data.todos || [];

    return (
        <Group
            x={x}
            y={y}
            draggable={isDraggable}
            onClick={onSelect}
            onDblClick={onDoubleClick}
            onDragEnd={(e) => onDragEnd(item.id, e.target.x(), e.target.y())}
        >
            <Rect
                width={width}
                height={height}
                fill="#b3e5fc"
                stroke={isSelected ? "blue" : "black"}
                cornerRadius={10}
                shadowBlur={5}
            />
            <Text
                text={data.title || "Todo List"}
                fontSize={18}
                fontStyle="bold"
                padding={10}
            />
            {todos.slice(0, 5).map((todo, idx) => (
                <Text
                    key={idx}
                    text={`• ${todo}`}
                    y={30 + idx * 20}
                    fontSize={14}
                    padding={10}
                />
            ))}
        </Group>
    );
};

export default TodoList;