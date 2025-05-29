import React, { useState, useRef } from 'react';
import { Stage, Layer } from "react-konva";
import { useCanvas } from "../../hooks/useCanvas";
import { useItems } from "../../hooks/useItems";
import ItemRenderer from "../items/base/ItemRenderer";
import Grid from "./Grid";
import StickyNoteEditor from "../items/sticky-note/StickyNoteEditor";
import { ITEM_TYPES } from "../../constants/itemTypes";
import { UI_COLORS } from "../../constants/colors";
import Toolbar from "../toolbar/Toolbar";

// Sample data
const INITIAL_ITEMS = [
    {
        id: 1,
        type: ITEM_TYPES.STICKY_NOTE,
        x: 50, y: 60, width: 150, height: 120, zIndex: 0,
        data: { text: "First Note", color: "#fff59d", fontSize: 16 }
    },
    // ... other initial items
];

const CanvasBoard = () => {
    const canvas = useCanvas();
    const items = useItems(INITIAL_ITEMS);
    
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [selectedTool, setSelectedTool] = useState('select');
    
    // Resize state
    const [isResizing, setIsResizing] = useState(false);
    const [resizeData, setResizeData] = useState(null);
    const resizeStartPos = useRef({ x: 0, y: 0 });
    const originalSize = useRef({ width: 0, height: 0 });

    const handleDoubleClick = (item) => {
        if (item.type === ITEM_TYPES.STICKY_NOTE) {
            setEditingId(item.id);
            setEditingText(item.data.text);
        }
    };

    const handleSave = () => {
        const item = items.items.find(i => i.id === editingId);
        if (!item) return;

        items.updateItem(editingId, {
            ...item,
            data: {
                ...item.data,
                text: editingText
            }
        });

        setEditingId(null);
    };


    const handleAddItem = (itemType) => {
        const newItem = createNewItem(itemType);
        items.addItem(newItem);
        setSelectedTool('select');
    };

    const createNewItem = (itemType) => {
        const baseId = Date.now();
        const baseX = 100 + Math.random() * 200;
        const baseY = 100 + Math.random() * 200;

        switch (itemType) {
            case ITEM_TYPES.STICKY_NOTE:
                return {
                    id: baseId,
                    type: ITEM_TYPES.STICKY_NOTE,
                    x: baseX,
                    y: baseY,
                    width: 150,
                    height: 120,
                    zIndex: 0,
                    data: {
                        text: "New sticky note",
                        color: "#fff59d",
                        fontSize: 16
                    }
                };
            default:
                return null;
        }
    };

    const handleResizeStart = (itemId, corner, e) => {
        e.cancelBubble = true;
        
        const item = items.items.find(i => i.id === itemId);
        if (!item) return;

        const stage = canvas.stageRef.current;
        const pointer = stage.getPointerPosition();
        
        setIsResizing(true);
        setResizeData({ itemId, corner });
        resizeStartPos.current = { x: pointer.x, y: pointer.y };
        originalSize.current = { width: item.width, height: item.height };
        
        // Prevent dragging during resize
        items.setSelectedId(itemId);
    };

    const handleMouseMove = (e) => {
        if (isResizing && resizeData) {
            const stage = canvas.stageRef.current;
            const pointer = stage.getPointerPosition();
            
            const deltaX = (pointer.x - resizeStartPos.current.x) / canvas.stageScale;
            const deltaY = (pointer.y - resizeStartPos.current.y) / canvas.stageScale;
            
            const item = items.items.find(i => i.id === resizeData.itemId);
            if (!item) return;

            let newWidth = originalSize.current.width;
            let newHeight = originalSize.current.height;
            
            // Calculate new dimensions based on resize corner
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

            // Update the item with new dimensions
            items.updateItem(resizeData.itemId, {
                ...item,
                width: newWidth,
                height: newHeight
            });
        } else {
            // Call original mouse move handler
            canvas.handleMouseMove(e);
        }
    };

    const handleMouseUp = (e) => {
        if (isResizing) {
            setIsResizing(false);
            setResizeData(null);
        } else {
            canvas.handleMouseUp(e);
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
                        items.setSelectedId(null);
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
                    {items.items.map((item) => (
                        <ItemRenderer
                            key={item.id}
                            item={item}
                            isSelected={items.selectedId === item.id}
                            onDragEnd={items.moveItem}
                            onSelect={() => items.setSelectedId(item.id)}
                            onDoubleClick={() => handleDoubleClick(item)}
                            onResize={handleResizeStart}
                            isDraggable={!isResizing}
                        />
                    ))}
                </Layer>
            </Stage>

            <StickyNoteEditor
                editingId={editingId}
                editingText={editingText}
                setEditingText={setEditingText}
                items={items.items}
                stageScale={canvas.stageScale}
                stagePos={canvas.stagePos}
                onSave={handleSave}
            />
        </>
    );
};

export default CanvasBoard;