import React from "react";
import { ChromePicker } from "react-color";

const ColorPickerOverlay = ({
    target,
    items,
    stageScale,
    stagePos,
    onChangeComplete,
    onClose
}) => {
    if (!target) return null;

    const item = items.find((i) => i.id === target.id && i.type === target.type);
    if (!item) return null;

    const { x, y, width } = item;
    const left = x * stageScale + stagePos.x + width * stageScale + 10;
    const top = y * stageScale + stagePos.y;

    return (
        <div
            style={{
                position: "absolute",
                left,
                top,
                zIndex: 10000,
                pointerEvents: "auto",
                background: "#fff",          // Add background to avoid transparency issues
                border: "1px solid #ccc",   // Optional: subtle border for visibility
                borderRadius: 4,             // Optional: rounded corners
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",  // Optional: subtle shadow
                width: 220,                 // Fix width matching ChromePicker size
                userSelect: "none",
            }}
        >
            if(isSelected){}
            <ChromePicker
                color={item.data.color || "#fff59d"}
                onChangeComplete={(color) => {
                    onChangeComplete(item.id, item.type, color.hex);
                    onClose();
                }}
                disableAlpha
            />
        </div>
    );
};

export default ColorPickerOverlay;