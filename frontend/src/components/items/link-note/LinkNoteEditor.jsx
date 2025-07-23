import React, { useEffect, useRef } from "react";
import { ITEM_TYPES } from "../../../constants/itemTypes";

const LinkNoteEditor = ({
    editingId,
    editingTitle,
    setEditingTitle,
    editingUrl,
    setEditingUrl,
    items,
    stageScale,
    stagePos,
    onSave,
}) => {
    const titleRef = useRef(null);
    const urlRef = useRef(null);

    useEffect(() => {
        if (editingId && titleRef.current) {
            titleRef.current.focus();
        }
    }, [editingId]);

    if (!editingId) return null;

    const item = items.find((i) => i.id === editingId);
    if (!item || item.type !== ITEM_TYPES.LINK) return null;

    const { x, y, width, height } = item;
    const left = x * stageScale + stagePos.x;
    const top = y * stageScale + stagePos.y;
    const scaledWidth = width * stageScale;
    const scaledHeight = height * stageScale;

    const inputHeight = 32;
    const spacing = 8;

    const handleKeyDown = (e) => {
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
            {/* Title Input */}
            <input
                ref={titleRef}
                type="text"
                value={editingTitle || ""}
                onChange={(e) => setEditingTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Link title"
                style={{
                    position: "absolute",
                    top: `${top}px`,
                    left: `${left}px`,
                    width: `${scaledWidth}px`,
                    height: `${inputHeight * 1.5}px`,
                    fontSize: `${item.data.fontSize * stageScale || 14}px`,
                    background: item.data.color || "#e9f2ff",
                    border: "2px solid #0056b3",
                    padding: "4px 8px",
                    boxSizing: "border-box",
                    outline: "none",
                    zIndex: 20,
                }}
            />

            {/* URL Input */}
            <input
                ref={urlRef}
                type="text"
                value={editingUrl || ""}
                onChange={(e) => setEditingUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com"
                style={{
                    position: "absolute",
                    top: `${top + inputHeight + spacing}px`,
                    left: `${left}px`,
                    width: `${scaledWidth}px`,
                    height: `${inputHeight}px`,
                    fontSize: `${item.data.fontSize * stageScale || 14}px`,
                    background: item.data.color || "#e9f2ff",
                    border: "2px solid #0056b3",
                    padding: "4px 8px",
                    boxSizing: "border-box",
                    outline: "none",
                    zIndex: 20,
                }}
            />
        </>
    );
};

export default LinkNoteEditor;
