import React, { useEffect, useRef } from "react";

const StickyNoteEditor = ({
    editingId,
    editingTitle,
    editingText,
    setEditingTitle,
    setEditingText,
    items,
    stageScale,
    stagePos,
    onSave
}) => {
    const titleRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        if (editingId && titleRef.current) {
            titleRef.current.focus();
        }
    }, [editingId]);

    if (!editingId) return null;

    const item = items.find((i) => i.id === editingId);
    if (!item) return null;

    const { x, y, width, height } = item;
    const left = x * stageScale + stagePos.x;
    const top = y * stageScale + stagePos.y;
    const scaledWidth = width * stageScale;
    const scaledHeight = height * stageScale;
    const titleHeight = 32;

    const handleTitleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            textRef.current?.focus();
        } else if (e.key === "Escape") {
            e.preventDefault();
            onSave();
        }
    };

    const handleTextKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSave();
        } else if (e.key === "Escape") {
            e.preventDefault();
            onSave();
        }
    };

    return (
        <>
            <input
                ref={titleRef}
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                style={{
                    position: "absolute",
                    top: `${top}px`,
                    left: `${left}px`,
                    width: `${scaledWidth}px`,
                    height: `${titleHeight}px`,
                    fontSize: `${item.data.fontSize * stageScale + 2}px`,
                    background: item.data.color || "#fff59d",
                    fontWeight: "bold",
                    border: "2px solid #333",
                    padding: "4px 8px",
                    boxSizing: "border-box",
                    outline: "none",
                    zIndex: 20
                }}
            />
            <textarea
                ref={textRef}
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onKeyDown={handleTextKeyDown}
                style={{
                    position: "absolute",
                    top: `${top + titleHeight}px`,
                    left: `${left}px`,
                    width: `${scaledWidth}px`,
                    height: `${scaledHeight - titleHeight}px`,
                    fontSize: `${item.data.fontSize * stageScale}px`,
                    background: item.data.color || "#fff59d",
                    border: "2px solid #333",
                    borderTop: "none",
                    padding: "8px",
                    boxSizing: "border-box",
                    outline: "none",
                    resize: "none",
                    zIndex: 10
                }}
            />
        </>
    );
};

export default StickyNoteEditor;
