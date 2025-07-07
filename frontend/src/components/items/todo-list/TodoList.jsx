import React, { useState, useRef } from "react";
import { Group, Rect, Text, Circle } from "react-konva";
import { Html } from "react-konva-utils";

const TodoList = ({
    item,
    isSelected,
    onDragEnd,
    onSelect,
    onDoubleClick,
    onResize,
    isDraggable,
    onUpdate,
    onOpenColorPicker
}) => {
    const shapeRef = useRef();
    const { x, y, width, height, data } = item;
    const [todos, setTodos] = useState(
        (data.todos || []).map((task) =>
            typeof task === "string" ? { id: Date.now() + Math.random(), text: task } : task
        )
    );
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(data.title || "Todo List");
    const [newTask, setNewTask] = useState("");

    const handleAddTask = () => {
        if (newTask.trim()) {
            const newTodo = { id: Date.now() + Math.random(), text: newTask.trim() };
            const updated = [...todos, newTodo];
            setTodos(updated);
            setNewTask("");
            onUpdate({ ...item, data: { ...data, todos: updated, title } });
        }
    };

    const handleTaskDelete = (id) => {
        const updated = todos.filter((t) => t.id !== id);
        setTodos(updated);
        onUpdate({ ...item, data: { ...data, todos: updated, title } });
    };

    const handleTitleBlur = () => {
        setIsEditingTitle(false);
        onUpdate({ ...item, data: { ...data, todos, title } });
    };

    const handleResizeMouseDown = (e, corner) => {
        e.cancelBubble = true;
        e.evt.preventDefault();
        if (onResize) {
            onResize(item.id, corner, e);
        }
    };

    return (
        <>
            <Group
                x={x}
                y={y}
                draggable={isDraggable}
                onClick={onSelect}
                onDragEnd={(e) => onDragEnd(item.id, e.target.x(), e.target.y())}
            >
                <Rect
                    ref={shapeRef}
                    width={width}
                    height={height}
                    fill={item.data.color || "#BBBBBBBB"}
                    stroke={isSelected ? "blue" : "black"}
                    cornerRadius={10}
                    shadowBlur={5}
                />

                {/* Clipping group to limit children inside bounds */}
                <Group
                    clipFunc={(ctx) => {
                        ctx.beginPath();
                        ctx.rect(0, 0, width, height);
                    }}
                >
                    {/* Title Section */}
                    {isEditingTitle ? (
                        <Html groupProps={{ x: 5, y: 5 }} divProps={{ style: { width: width - 10 } }}>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={handleTitleBlur}
                                autoFocus
                                style={{ width: "100%", fontSize: 16, padding: "2px 4px" }}
                            />
                        </Html>
                    ) : (
                        <Text
                            text={title}
                            fontSize={18}
                            fontStyle="bold"
                            padding={10}
                            onDblClick={() => setIsEditingTitle(true)}
                        />
                    )}

                    {/* Task List */}
                    {todos.slice(0, Math.floor((height - 90) / 25)).map((todo, idx) => (
                        <Html
                            key={todo.id}
                            groupProps={{ x: 5, y: 35 + idx * 25 }}
                            divProps={{ style: { width: width - 10, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } }}
                        >
                            <label
                                style={{ display: "flex", alignItems: "center", fontSize: 14, cursor: "pointer" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <input
                                    type="checkbox"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTaskDelete(todo.id);
                                    }}
                                    style={{ marginRight: 6 }}
                                />
                                {todo.text}
                            </label>
                        </Html>
                    ))}

                    {/* Add Task Section */}
                    <Html groupProps={{ x: 5, y: height - 35 }} divProps={{ style: { width: width - 10 } }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <input
                                type="text"
                                value={newTask}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter'){
                                        handleAddTask();
                                    }
                                }}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="New task"
                                style={{
                                    flex: 1,
                                    fontSize: 14,
                                    padding: "2px 6px",
                                    borderRadius: 4,
                                    border: "1px solid #ccc",
                                }}
                            />
                            <button
                                onClick={handleAddTask}
                                style={{
                                    padding: "4px 8px",
                                    fontSize: 12,
                                    border: "none",
                                    borderRadius: 4,
                                    backgroundColor: "#0288d1",
                                    color: "white",
                                    cursor: "pointer",
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </Html>
                </Group>

                {/* Resize handles - only show when selected */}
                {isSelected && (
                    <>
                        {/* Bottom-right resize handle */}
                        <Circle
                            x={width}
                            y={height}
                            radius={6}
                            fill="#007bff"
                            stroke="#0056b3"
                            strokeWidth={1}
                            onMouseDown={(e) => handleResizeMouseDown(e, "bottom-right")}
                            draggable={false}
                            listening={true}
                            style={{ cursor: "nw-resize" }}
                        />

                        {/* Bottom resize handle */}
                        <Circle
                            x={width / 2}
                            y={height}
                            radius={6}
                            fill="#007bff"
                            stroke="#0056b3"
                            strokeWidth={1}
                            onMouseDown={(e) => handleResizeMouseDown(e, "bottom")}
                            draggable={false}
                            listening={true}
                            style={{ cursor: "n-resize" }}
                        />

                        {/* Right resize handle */}
                        <Circle
                            x={width}
                            y={height / 2}
                            radius={6}
                            fill="#007bff"
                            stroke="#0056b3"
                            strokeWidth={1}
                            onMouseDown={(e) => handleResizeMouseDown(e, "right")}
                            draggable={false}
                            listening={true}
                            style={{ cursor: "e-resize" }}
                        />

                        {/* Coler Picker "button" */}
                            <Circle
                                x={item.width / 2}
                                y={item.height / item.height}
                                radius={8}
                                fill="#ff69b4"
                                stroke="#b3006b"
                                strokeWidth={1}
                                onClick={() => onOpenColorPicker?.(item.id, item.type)}
                                draggable={false}
                                listening={true}
                                style={{ cursor: 'pointer' }}
                            />
                    </>
                )}
            </Group>
        </>
    );
};

export default TodoList;
