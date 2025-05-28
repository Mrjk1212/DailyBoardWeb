import React, { useState } from 'react';
import { Stage, Layer } from "react-konva";
import { useCanvas } from "../../hooks/useCanvas";
import { useItems } from "../../hooks/useItems";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import ItemRenderer from "../items/base/ItemRenderer";
import Grid from "./Grid";
import Toolbar from "../toolbar/Toolbar";
import InfoPanel from "../ui/InfoPanel";
import StickyNoteEditor from "../items/sticky-note/StickyNoteEditor";
import { ITEM_TYPES } from "../../constants/itemTypes";
import { UI_COLORS } from "../../constants/colors";

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

    useKeyboardShortcuts({
        onDelete: () => {
            if (items.selectedId) {
                items.deleteItem(items.selectedId);
            }
        }
    });

    const handleDoubleClick = (item) => {
        if (item.type === ITEM_TYPES.STICKY_NOTE) {
            setEditingId(item.id);
            setEditingText(item.data.text);
        }
    };

    const handleAddItem = (type) => {
        items.addItem(type, canvas.centerPos.x - 100, canvas.centerPos.y - 60);
    };

    return (
        <>
            <InfoPanel
                zoom={canvas.stageScale}
                itemCount={items.items.length}
                selectedId={items.selectedId}
            />

            <Toolbar onAddItem={handleAddItem} />

            <StickyNoteEditor
                editingId={editingId}
                editingText={editingText}
                setEditingText={setEditingText}
                items={items.items}
                stageScale={canvas.stageScale}
                stagePos={canvas.stagePos}
                onFinishEditing={() => {
                    items.updateItemData(editingId, { text: editingText });
                    setEditingId(null);
                    setEditingText("");
                }}
                onCancel={() => {
                    setEditingId(null);
                    setEditingText("");
                }}
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
                onMouseMove={canvas.handleMouseMove}
                onMouseUp={canvas.handleMouseUp}
                ref={canvas.stageRef}
                style={{ background: UI_COLORS.BACKGROUND }}
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
                        />
                    ))}
                </Layer>
            </Stage>
        </>
    );
};

export default CanvasBoard;