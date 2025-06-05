import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer } from "react-konva";
import { useCanvas } from "../../hooks/useCanvas";
import { useItems } from "../../hooks/useItems";
import ItemRenderer from "../items/base/ItemRenderer";
import Grid from "./Grid";
import Toolbar from "../toolbar/Toolbar";
import StickyNoteEditor from "../items/sticky-note/StickyNoteEditor";
import { ITEM_TYPES } from "../../constants/itemTypes";
import { UI_COLORS } from "../../constants/colors";
import { fetchItems, createItem, updateItem, deleteItem } from '../api/useApi';

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
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [editingTitle, setEditingTitle] = useState("");
    const [selectedTool, setSelectedTool] = useState('select');
    const [selectedId, setSelectedId] = useState(null);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeData, setResizeData] = useState(null);
    const resizeStartPos = useRef({ x: 0, y: 0 });
    const originalSize = useRef({ width: 0, height: 0 });

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

        const newItem = {
            type: itemType,
            x: baseX,
            y: baseY,
            width: 150,
            height: 120,
            zIndex: 0,
            data: { text: "", color: "#fff59d", fontSize: 16, title: "New Note" },
        };

        try {
            const saved = await createItem({
                ...newItem,
                data: JSON.stringify(newItem.data)
            });
            setItems(prev => [...prev, {
                ...saved,
                data: typeof saved.data === 'string' ? JSON.parse(saved.data) : saved.data
            }]);
        } catch (err) {
            console.error("Failed to add item:", err);
        }
    };

    const handleSave = async () => {
    const item = items.find(i => i.id === editingId);
    if (!item) return;

    const currentData = typeof item.data === "string" ? JSON.parse(item.data) : item.data || {};

    const updatedItem = {
        ...item,
        data: {
            ...currentData,
            title: editingTitle,
            text: editingText,
        },
    };

    try {
        const updated = await updateItem({
            ...updatedItem,
            data: JSON.stringify(updatedItem.data)
        });

        // Only trust backend's data if it returns valid x/y
        setItems(prev => prev.map(i =>
            i.id === updated.id
                ? {
                    ...i,
                    ...updated,
                    x: updated.x ?? i.x,
                    y: updated.y ?? i.y,
                    data: typeof updated.data === 'string' ? JSON.parse(updated.data) : updated.data
                }
                : i
        ));

        setEditingId(null);
    } catch (err) {
        console.error("Failed to save item:", err);
    }
};

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
        if (isResizing && resizeData) {
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

    const handleDelete = async (id) => {
        try {
            await deleteItem(id);
            setItems(prev => prev.filter(i => i.id !== id));
            if (editingId === id) setEditingId(null);
        } catch (err) {
            console.error("Failed to delete item:", err);
        }
    };

    const handleDoubleClick = (item) => {
        if (item.type === ITEM_TYPES.STICKY_NOTE) {
            setEditingId(item.id);
            const data = item.data;
            setEditingText(data.text || "");
            setEditingTitle(data.title || "");
            setSelectedTool("select");
        }
    };

const handleDragEnd = async (id, x, y) => {
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


    return (
        <>
            <Toolbar
                onAddItem={handleAddItem}
                selectedTool={selectedTool}
                setSelectedTool={setSelectedTool}
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
                    canvas.handleMouseDown(e);
                    const clickedOnEmpty = e.target === canvas.stageRef.current;
                    if (clickedOnEmpty) {
                        setSelectedId(null);
                        setSelectedTool("select");
                    }
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                ref={canvas.stageRef}
                style={{ background: UI_COLORS.BACKGROUND, cursor: isResizing ? 'nw-resize' : 'default' }}
            >
                <Layer>
                    <Grid />
                </Layer>
                <Layer>
                    {items.map(item => (
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
                        />
                    ))}
                </Layer>
            </Stage>

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
        </>
    );
};

export default CanvasBoard;