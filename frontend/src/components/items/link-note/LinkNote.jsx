import React, { useRef } from "react";
import { Text, Circle } from "react-konva";
import BaseItem from "../base/BaseItem";

const LinkNote = ({
    item,
    isSelected,
    onDragEnd,
    onSelect,
    onDoubleClick,
    onResize,
    isDraggable,
}) => {
    const clickTimer = useRef(null);

    const handleSingleClick = () => {
        if (!isSelected) {
            onSelect();
        } else {
            window.open(item.data.url || "https://example.com", "_blank");
        }
    };

    const handleClick = (e) => {
        e.cancelBubble = true;

        // Clear existing timer if any (important for multiple clicks)
        if (clickTimer.current) {
            clearTimeout(clickTimer.current);
            clickTimer.current = null;
        }

        // Set a timer for single click to fire after 250ms
        clickTimer.current = setTimeout(() => {
            handleSingleClick();
            clickTimer.current = null;
        }, 250);
    };

    const handleDoubleClick = (e) => {
        e.cancelBubble = true;

        // Cancel the pending single click action
        if (clickTimer.current) {
            clearTimeout(clickTimer.current);
            clickTimer.current = null;
        }

        onDoubleClick(); // open editor
    };

    return (
        <BaseItem
            item={item}
            isSelected={isSelected}
            onDragEnd={onDragEnd}
            onSelect={onSelect}
            onDoubleClick={onDoubleClick}
            isDraggable={isDraggable}
        >
            <Text
                x={10}
                y={10}
                text={item.data.title || "Link"}
                fontSize={item.data.fontSize + 2 || 16}
                fontStyle="bold"
                fill="#333"
                width={item.width - 20}
                height={24}
                onClick={onSelect}  // Optional: select on title click immediately
                onDblClick={onDoubleClick}
            />

            <Text
                x={10}
                y={40}
                text={item.data.url || "https://example.com"}
                fontSize={item.data.fontSize || 14}
                fill="#1a73e8"
                width={item.width - 20}
                height={item.height - 50}
                wrap="word"
                onClick={handleClick}
                onDblClick={handleDoubleClick}
                listening={true}
            />

            {isSelected && (
                <Circle
                    x={item.width}
                    y={item.height}
                    radius={6}
                    fill="#007bff"
                    stroke="#0056b3"
                    strokeWidth={1}
                    onMouseDown={(e) => {
                        e.cancelBubble = true;
                        onResize?.(item.id, "bottom-right", e);
                    }}
                    draggable={false}
                    listening={true}
                    style={{ cursor: "nw-resize" }}
                />
            )}
        </BaseItem>
    );
};

export default LinkNote;
