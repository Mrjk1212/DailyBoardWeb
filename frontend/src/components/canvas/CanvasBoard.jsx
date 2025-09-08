import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Stage, Layer } from "react-konva";
import { useCanvas } from "../../hooks/useCanvas";
import { useItems } from "../../hooks/useItems";
import ItemRenderer from "../items/base/ItemRenderer";
import Grid from "./Grid";
import Toolbar from "../toolbar/Toolbar";
import StickyNoteEditor from "../items/sticky-note/StickyNoteEditor";
import { ITEM_TYPES } from "../../constants/itemTypes";
import { ITEM_COLORS, UI_COLORS } from "../../constants/colors";
import CalendarEditor from '../items/calendar/CalendarEditor';
import GoalNoteEditor from '../items/goal-note/GoalNoteEditor';
import { Line } from 'react-konva';
import { fetchItems, createItem, updateItem, deleteItem, undeleteItem } from '../api/useApi';
import LinkNoteEditor from '../items/link-note/LinkNoteEditor';
import ColorPickerOverlay from '../color-picker-overlay/ColorPickerOverlay';

console.log('=== DEBUG IMPORTS ===');
console.log('React:', React);
console.log('Stage:', Stage);
console.log('Layer:', Layer);
console.log('useCanvas:', useCanvas);
console.log('useItems:', useItems);
console.log('ItemRenderer:', ItemRenderer);
console.log('Grid:', Grid);
console.log('Toolbar:', Toolbar);
console.log('StickyNoteEditor:', StickyNoteEditor);
console.log('ITEM_TYPES:', ITEM_TYPES);
console.log('UI_COLORS:', UI_COLORS);
console.log('=== END DEBUG ===');

const CanvasBoard = () => {
    const canvas = useCanvas();

    const [items, setItems] = useState([]);
    const [history, setHistory] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [editingTitle, setEditingTitle] = useState("");
    const [selectedTool, setSelectedTool] = useState('select');
    const [selectedId, setSelectedId] = useState(null);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeData, setResizeData] = useState(null);
    const resizeStartPos = useRef({ x: 0, y: 0 });
    const originalSize = useRef({ width: 0, height: 0 });
    const [drawing, setDrawing] = useState(false);
    const [lines, setLines] = useState([]);
    const [editingDescription, setEditingDescription] = useState("");
    const [editingGoalDate, setEditingGoalDate] = useState("");
    const [editingUrl, setEditingUrl] = useState("");
    const [editingColorTarget, setEditingColorTarget] = useState(null);


    useEffect(() => {
        fetchItems()
            .then(itemsFromBackend => {
                const parsedItems = itemsFromBackend.map(item => ({
                    ...item,
                    data: typeof item.data === 'string' ? JSON.parse(item.data) : item.data
                }));
                setItems(parsedItems);
            })
            .catch(console.error);
    }, []);

    const handleAddItem = async (itemType) => {
        const baseX = 100 + Math.random() * 200;
        const baseY = 100 + Math.random() * 200;

        let width = 180;
        let height = 160;
        let data = {};

        if (itemType === ITEM_TYPES.TODO_LIST) {
            width = 220;
            height = 200;
            data = { title: "Todo List", todos: ["Task 1", "Task 2"], color: ITEM_COLORS.TODO_LIST };
        }
        else if (itemType === ITEM_TYPES.GOAL_NOTE) {
            width = 220;
            height = 150;
            data = { title: "Goal", description: "", goalDate: "", color: ITEM_COLORS.GOAL_NOTE };
        } else if (itemType === ITEM_TYPES.STICKY_NOTE) {
            width = 180;
            height = 140;
            data = { text: "", color: ITEM_COLORS.STICKY_NOTE, fontSize: 16, title: "New Note" };
        }
        else if (itemType === ITEM_TYPES.LINK) {
            width = 180;
            height = 75;
            data = { text: "", color: ITEM_COLORS.STICKY_NOTE, fontSize: 16, title: "New Link" };
        }
        else {
            width = 180;
            height = 140;
            data = { text: "", color: "#fff59d", fontSize: 16, title: "New Note" };
        }

        const newItem = {
            type: itemType,
            x: baseX,
            y: baseY,
            width,
            height,
            zIndex: 0,
            data,
        };

        try {
            const saved = await createItem({
                ...newItem,
                data: JSON.stringify(data),
            });

            setItems(prev => [
                ...prev,
                {
                    ...saved,
                    data: typeof saved.data === 'string' ? JSON.parse(saved.data) : saved.data,
                },
            ]);

            pushToHistory('add', saved);
        } catch (err) {
            console.error("Failed to add item:", err);
        }
    };
    const handleSave = async () => {
        const item = items.find(i => i.id === editingId);
        if (!item) return;
        pushToHistory('update', item);
        const currentData = typeof item.data === "string" ? JSON.parse(item.data) : item.data || {};

        let updatedData = { ...currentData };

        if (item.type === ITEM_TYPES.GOAL_NOTE) {
            updatedData.title = editingTitle;
            updatedData.description = editingDescription;
            updatedData.goalDate = editingGoalDate;
        } else if (item.type === ITEM_TYPES.STICKY_NOTE) {
            updatedData.title = editingTitle;
            updatedData.text = editingText;
        } else if (item.type === ITEM_TYPES.LINK) {
            updatedData.title = editingTitle;
            updatedData.url = editingUrl;
        }

        const updatedItem = {
            ...item,
            data: updatedData,
        };

        try {
            const updated = await updateItem({
                ...updatedItem,
                data: JSON.stringify(updatedData),
            });

            setItems(prev => prev.map(i =>
                i.id === updated.id
                    ? {
                        ...i,
                        ...updated,
                        data: typeof updated.data === 'string' ? JSON.parse(updated.data) : updated.data,
                    }
                    : i
            ));



            setEditingId(null);
        } catch (err) {
            console.error("Failed to save item:", err);
        }
    };

    const pushToHistory = useCallback((type, item) => {
        setHistory(prev => [...prev, { type, item }]);
    }, []);

    const handleUndo = useCallback(() => {
        setHistory(prev => {
            if (prev.length === 0) return prev;

            const lastAction = prev[prev.length - 1];

            if (lastAction.type === 'delete') {
                undeleteItem(lastAction.item.id)
                    .then(() => {
                        const restoredItem = {
                            ...lastAction.item,
                            deleted: false,
                            deletedAt: null,
                        };

                        setItems(prevItems => {
                            const exists = prevItems.some(i => i.id === restoredItem.id);
                            if (exists) {
                                return prevItems.map(i => i.id === restoredItem.id ? restoredItem : i);
                            } else {
                                return [...prevItems, restoredItem];
                            }
                        });
                    })
                    .catch(console.error);
            } else if (lastAction.type === 'add') {
                deleteItem(lastAction.item.id).then(() => {
                    setItems(prevItems => prevItems.filter(i => i.id !== lastAction.item.id));
                }).catch(console.error);
            } else if (lastAction.type === 'update') {
                updateItem({
                    ...lastAction.item,
                    data: JSON.stringify(lastAction.item.data),
                }).then(updated => {
                    const parsedUpdated = {
                        ...updated,
                        data: typeof updated.data === 'string' ? JSON.parse(updated.data) : updated.data,
                    };

                    setItems(prevItems =>
                        prevItems.map(i => i.id === parsedUpdated.id ? parsedUpdated : i)
                    );
                }).catch(console.error);
            } else {
                console.log("Unknown Undo Action");
            }

            return prev.slice(0, -1);
        });
    }, []);


    useEffect(() => {
        const handleKeyDown = (e) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

            if (ctrlOrCmd && e.key === 'z') {
                e.preventDefault();
                handleUndo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo]);

    const handleResizeStart = (itemId, corner, e) => {
        e.cancelBubble = true;

        const item = items.find(i => i.id === itemId);
        if (!item) return;

        const stage = canvas.stageRef.current;
        const pointer = stage.getPointerPosition();

        setIsResizing(true);
        setResizeData({ itemId, corner });
        resizeStartPos.current = { x: pointer.x, y: pointer.y };
        originalSize.current = { width: item.width, height: item.height };
        setSelectedTool("select");

        setSelectedId(itemId);
    };

    const handleMouseMove = (e) => {
        if (selectedTool === "draw" && drawing) {
            setDrawing(false);
        }
        else if (isResizing && resizeData) {
            const stage = canvas.stageRef.current;
            const pointer = stage.getPointerPosition();

            const deltaX = (pointer.x - resizeStartPos.current.x) / canvas.stageScale;
            const deltaY = (pointer.y - resizeStartPos.current.y) / canvas.stageScale;

            const item = items.find(i => i.id === resizeData.itemId);
            if (!item) return;

            let newWidth = originalSize.current.width;
            let newHeight = originalSize.current.height;

            switch (resizeData.corner) {
                case 'bottom-right':
                    newWidth = Math.max(50, originalSize.current.width + deltaX);
                    newHeight = Math.max(30, originalSize.current.height + deltaY);
                    break;
                case 'right':
                    newWidth = Math.max(50, originalSize.current.width + deltaX);
                    break;
                case 'bottom':
                    newHeight = Math.max(30, originalSize.current.height + deltaY);
                    break;
                default:
                    console.log("default case for resize...");
                    break;
            }

            setItems(prev => prev.map(i =>
                i.id === resizeData.itemId ? { ...i, width: newWidth, height: newHeight } : i
            ));
        } else {
            canvas.handleMouseMove(e);
        }
    };

    const handleMouseUp = async (e) => {
        if (isResizing && resizeData) {
            setIsResizing(false);

            const item = items.find(i => i.id === resizeData.itemId);
            if (item) {
                pushToHistory('update', item);
                try {
                    const updated = await updateItem({
                        ...item,
                        data: JSON.stringify(item.data)
                    });
                    setItems(prev => prev.map(i =>
                        i.id === updated.id
                            ? { ...updated, data: typeof updated.data === 'string' ? JSON.parse(updated.data) : updated.data }
                            : i
                    ));
                } catch (err) {
                    console.error("Failed to update resized item:", err);
                }
            }

            setResizeData(null);
        } else {
            canvas.handleMouseUp(e);
        }
    };

    const handleDelete = useCallback((id) => {

        const itemToDelete = items.find(i => i.id === id);
        if (!itemToDelete) return;

        pushToHistory('delete', itemToDelete);

        try {
            deleteItem(id); // <- backend sets deleted=true
            setItems(prev => prev.filter(i => i.id !== id)); // <- frontend removes it from UI
        } catch (err) {
            console.error("Failed to delete item:", err);
        }
    }, [items, pushToHistory]);


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Delete') {
                e.preventDefault();
                if (selectedId) {
                    handleDelete(selectedId);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleDelete, selectedId]);


    const handleUpdate = async (updatedItem) => {
        const oldItem = items.find(i => i.id === updatedItem.id);
        if (oldItem) {
            pushToHistory('update', oldItem);
        }
        try {
            const updated = await updateItem({
                ...updatedItem,
                data: JSON.stringify(updatedItem.data),
            });
            setItems((prev) =>
                prev.map((item) => (item.id === updated.id ? { ...updated, data: updatedItem.data } : item))
            );
        } catch (err) {
            console.error("Failed to update item:", err);
        }
    };

    const handleColorChangeComplete = (id, type, newColor) => {
        const item = items.find(i => i.id === id && i.type === type);
        if (!item) return;

        const updatedItem = {
            ...item,
            data: {
                ...item.data,
                color: newColor,
            },
        };

        handleUpdate(updatedItem);
    };

    const handleDoubleClick = (item) => {
        if (item.type === ITEM_TYPES.STICKY_NOTE) {
            setEditingId(item.id);
            const data = item.data;
            setEditingText(data.text || "");
            setEditingTitle(data.title || "");
            setSelectedTool("select");
        }
        else if (item.type === ITEM_TYPES.GOAL_NOTE) {
            setEditingId(item.id);

            // Ensure we correctly parse the item.data which may be a string or object
            const data = typeof item.data === 'string' ? JSON.parse(item.data) : item.data || {};

            setEditingTitle(data.title || "");
            setEditingDescription(data.description || "");
            setEditingGoalDate(data.goalDate || "");
            setSelectedTool("select");
        }
        else if (item.type === ITEM_TYPES.LINK) {
            setEditingId(item.id);
            setEditingTitle(item.data.title || "");
            setEditingUrl(item.data.url || "");
            setSelectedTool("select");
        }
    };

    const handleDragEnd = async (id, x, y) => {
        const oldItem = items.find(i => i.id === id);
        if (oldItem) {
            pushToHistory('update', oldItem);
        }

        const item = items.find(i => i.id === id);
        if (!item) return;

        const updatedItem = { ...item, x, y };

        setItems(prev => prev.map(i =>
            i.id === updatedItem.id
                ? { ...updatedItem, data: typeof updatedItem.data === 'string' ? JSON.parse(updatedItem.data) : updatedItem.data }
                : i
        ));

        try {
            await updateItem({
                ...updatedItem,
                data: JSON.stringify(updatedItem.data)
            });
        } catch (err) {
            console.error("Failed to update dragged item:", err);
        }
    };


    const handleUpdateEvents = (id, newEvents) => {
        setItems(prev =>
            prev.map(i =>
                i.id === id
                    ? {
                        ...i,
                        data: {
                            ...i.data,
                            events: newEvents,
                        },
                    }
                    : i
            )
        );
    };


    return (
        <>
            <Toolbar
                onAddItem={handleAddItem}
                selectedTool={selectedTool}
                setSelectedTool={setSelectedTool}
                onDelete={() => handleDelete(selectedId)}
                onUndo={handleUndo}
            />

            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                scaleX={canvas.stageScale}
                scaleY={canvas.stageScale}
                x={canvas.stagePos.x}
                y={canvas.stagePos.y}
                onWheel={canvas.handleWheel}
                onMouseDown={(e) => {
                    const stage = canvas.stageRef.current;
                    const transform = stage.getAbsoluteTransform().copy();
                    transform.invert();
                    const point = transform.point(stage.getPointerPosition());

                    if (selectedTool === "free_draw") {
                        setDrawing(true);
                        setLines(prevLines => [
                            ...prevLines,
                            {
                                points: [point.x, point.y],
                            }
                        ]);
                    } else {
                        canvas.handleMouseDown(e);
                        const clickedOnEmpty = e.target === canvas.stageRef.current;
                        if (clickedOnEmpty) {
                            setSelectedId(null);
                            setSelectedTool("select");
                        }
                    }
                }}
                onMouseMove={(e) => {
                    if (selectedTool === "free_draw" && drawing) {
                        const stage = canvas.stageRef.current;
                        const transform = stage.getAbsoluteTransform().copy();
                        transform.invert();
                        const point = transform.point(stage.getPointerPosition());
                        setLines(prevLines => {
                            const lastLine = prevLines[prevLines.length - 1];
                            if (!lastLine) return prevLines;

                            const updatedLine = {
                                ...lastLine,
                                points: lastLine.points.concat([point.x, point.y]),
                            };

                            return [...prevLines.slice(0, -1), updatedLine];
                        });
                    } else {
                        handleMouseMove(e);
                    }
                }}
                onMouseUp={(e) => {
                    if (selectedTool === "free_draw" && drawing) {
                        setDrawing(false);
                    } else {
                        handleMouseUp(e);
                    }
                }}
                ref={canvas.stageRef}
                style={{
                    background: UI_COLORS.BACKGROUND,
                    cursor: isResizing ? 'nw-resize' : selectedTool === 'free_draw' ? 'crosshair' : 'default',
                }}
            >
                <Layer>
                    <Grid />
                </Layer>
                <Layer>
                    {items
                        .filter(item => !item.deleted)
                        .map(item => (
                            <ItemRenderer
                                key={item.id}
                                item={item}
                                isSelected={selectedId === item.id}
                                onDragEnd={(id, x, y) => handleDragEnd(id, x, y)}
                                onSelect={() => setSelectedId(item.id)}
                                onDoubleClick={() => handleDoubleClick(item)}
                                onResize={handleResizeStart}
                                isDraggable={!isResizing}
                                onDelete={() => handleDelete(item.id)}
                                onUpdate={handleUpdate}
                                onOpenColorPicker={(id, type) => setEditingColorTarget({ id, type })}
                            />
                        ))}
                </Layer>
                <Layer>
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke={line.color}
                            strokeWidth={line.size}
                            tension={0.5}
                            lineCap="round"
                            globalCompositeOperation={line.eraser ? "destination-out" : "source-over"}
                        />
                    ))}
                </Layer>
            </Stage>

            <ColorPickerOverlay
                target={editingColorTarget}
                items={items}
                stageScale={canvas.stageScale}
                stagePos={canvas.stagePos}
                onChangeComplete={handleColorChangeComplete}
                onClose={() => setEditingColorTarget(null)}
            />

            <StickyNoteEditor
                editingId={editingId}
                editingTitle={editingTitle}
                setEditingTitle={setEditingTitle}
                editingText={editingText}
                setEditingText={setEditingText}
                items={items}
                stageScale={canvas.stageScale}
                stagePos={canvas.stagePos}
                onSave={handleSave}
            />

            <LinkNoteEditor
                editingId={editingId}
                editingTitle={editingTitle}
                setEditingTitle={setEditingTitle}
                editingUrl={editingUrl}
                setEditingUrl={setEditingUrl}
                items={items}
                stageScale={canvas.stageScale}
                stagePos={canvas.stagePos}
                onSave={handleSave}
            />

            <GoalNoteEditor
                editingId={editingId}
                editingTitle={editingTitle}
                setEditingTitle={setEditingTitle}
                editingDescription={editingDescription}
                setEditingDescription={setEditingDescription}
                editingGoalDate={editingGoalDate}
                setEditingGoalDate={setEditingGoalDate}
                items={items}
                stageScale={canvas.stageScale}
                stagePos={canvas.stagePos}
                onSave={handleSave}
            />

            {items
                .filter(item => item.type === "calendar" && !item.deleted)
                .map(item => (
                    <CalendarEditor
                        key={item.id}
                        item={item}
                        stageScale={canvas.stageScale}
                        stagePos={canvas.stagePos}
                        setEvents={(newEvents) => handleUpdateEvents(item.id, newEvents)}
                    />
                ))}
        </>
    );
};

export default CanvasBoard;