import React, { useEffect, useRef } from "react";
import { ITEM_TYPES } from "../../../constants/itemTypes";

const GoalNoteEditor = ({
    editingId,
    editingDescription,
    editingGoalDate,
    setEditingDescription,
    setEditingGoalDate,
    items,
    stageScale,
    stagePos,
    onSave,
}) => {

    const descriptionRef = useRef(null);
    const dateRef = useRef(null);

    useEffect(() => {
        if (editingId && descriptionRef.current) {
            descriptionRef.current.focus();
        }
    }, [editingId]);

    if (!editingId) return null;

    const item = items.find((i) => i.id === editingId);
    if (!item || item.type !== ITEM_TYPES.GOAL_NOTE) return null;

    const { x, y, width, height } = item;
    const left = x * stageScale + stagePos.x;
    const top = y * stageScale + stagePos.y;
    const scaledWidth = width * stageScale;
    const scaledHeight = height * stageScale;
    const titleHeight = 32;
    const dateInputHeight = 32;

    const handleDescriptionKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSave();
        } else if (e.key === "Escape") {
            e.preventDefault();
            onSave();
        }
    };

    const handleDateKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "Escape") {
            e.preventDefault();
            onSave();
        }
    };

    return (
        <>
            {/* Date input */}
            <input
                ref={dateRef}
                type="date"
                value={editingGoalDate || ""}
                onChange={(e) => setEditingGoalDate(e.target.value)}
                onKeyDown={handleDateKeyDown}
                style={{
                    position: "absolute",
                    top: `${top + titleHeight}px`,
                    left: `${left}px`,
                    width: `${scaledWidth}px`,
                    height: `${dateInputHeight}px`,
                    fontSize: `${item.data.fontSize * stageScale || 14}px`,
                    background: item.data.color || "#e9f2ff",
                    border: "2px solid #0056b3",
                    padding: "4px 8px",
                    boxSizing: "border-box",
                    outline: "none",
                    zIndex: 20,
                }}
            />

            {/* Description textarea */}
            <textarea
                ref={descriptionRef}
                value={editingDescription}
                onChange={(e) => setEditingDescription(e.target.value)}
                onKeyDown={handleDescriptionKeyDown}
                style={{
                    position: "absolute",
                    top: `${top + titleHeight + dateInputHeight + 4}px`,
                    left: `${left}px`,
                    width: `${scaledWidth}px`,
                    height: `${scaledHeight - titleHeight - dateInputHeight - 10}px`,
                    fontSize: `${item.data.fontSize * stageScale || 14}px`,
                    background: item.data.color || "#e9f2ff",
                    border: "2px solid #0056b3",
                    borderTop: "none",
                    padding: "8px",
                    boxSizing: "border-box",
                    outline: "none",
                    resize: "none",
                    zIndex: 10,
                }}
            />
        </>
    );
};

export default GoalNoteEditor;
