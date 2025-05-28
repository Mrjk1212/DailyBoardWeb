// src/components/items/sticky-note/StickyNoteEditor.jsx

import React, { useEffect, useRef } from "react";

const StickyNoteEditor = ({
    editingId,
    editingText,
    setEditingText,
    items,
    stageScale,
    stagePos,
    onSave
}) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (editingId && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [editingId]);

    if (!editingId) return null;

    const item = items.find((i) => i.id === editingId);
    if (!item) return null;

    const { x, y, width, height } = item;

    // Adjust for canvas scale and pan
    const left = x * stageScale + stagePos.x;
    const top = y * stageScale + stagePos.y;
    const scaledWidth = width * stageScale;
    const scaledHeight = height * stageScale;

    return (
        <div>
        <textarea
            ref={textareaRef}
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onBlur={onSave}
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSave();
                } else if (e.key === "Escape") {
                    e.preventDefault();
                    onSave();
                }
            }}
            style={{
                position: "absolute",
                top: `${top}px`,
                left: `${left}px`,
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                resize: "none",
                fontSize: `${item.data.fontSize * stageScale}px`,
                background: item.data.color || "#fff59d",
                border: "2px solid #333",
                padding: "8px",
                boxSizing: "border-box",
                outline: "none",
                zIndex: 10,
                fontFamily: "sans-serif",
            }}
        />
        </div>
        
    );
};

export default StickyNoteEditor;
