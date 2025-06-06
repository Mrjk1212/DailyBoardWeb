import React, { useState } from "react";
import { Group, Rect, Text } from "react-konva";
import { Html } from "react-konva-utils";

const TodoList = ({ item, isSelected, onDragEnd, onSelect, onDoubleClick, onResize, isDraggable, onUpdate }) => {
    const { x, y, width, height, data } = item;
    const todos = data.todos || [];
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(todos.join("\n"));

    const handleEdit = () => {
        setIsEditing(true);
        setEditValue(todos.join("\n"));
    };

    const handleBlur = () => {
        const updatedTodos = editValue.split("\n").map(t => t.trim()).filter(Boolean);
        onUpdate({ ...item, data: { ...data, todos: updatedTodos } });
        setIsEditing(false);
    };

    return (
        <Group
            x={x}
            y={y}
            draggable={isDraggable}
            onClick={onSelect}
            onDblClick={handleEdit}
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
            {!isEditing && todos.slice(0, 5).map((todo, idx) => (
                <Text
                    key={idx}
                    text={`\u2022 ${todo}`}
                    y={30 + idx * 20}
                    fontSize={14}
                    padding={10}
                />
            ))}
            {isEditing && (
                <Html groupProps={{ x: 5, y: 30 }} divProps={{ style: { width: width - 10 } }}>
                    <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleBlur}
                        autoFocus
                        rows={5}
                        style={{ width: "100%", fontSize: 14 }}
                    />
                </Html>
            )}
        </Group>
    );
};

export default TodoList;