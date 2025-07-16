import React from "react";
import { Text, Circle } from "react-konva";
import BaseItem from "../base/BaseItem";

const GoalNote = ({
    item,
    isSelected,
    onDragEnd,
    onSelect,
    onDoubleClick,
    onResize,
    isDraggable,
    onOpenColorPicker
}) => {
    const handleResizeMouseDown = (e, corner) => {
        e.cancelBubble = true;
        e.evt.preventDefault();

        if (onResize) {
            onResize(item.id, corner, e);
        }
    };

    // Calculate countdown days left
    const today = new Date();
    const goalDate = item.data.goalDate ? new Date(item.data.goalDate) : null;
    const daysLeft =
        goalDate && goalDate >= today
            ? Math.ceil((goalDate - today) / (1000 * 60 * 60 * 24))
            : 0;

    return (
        <BaseItem
            item={item}
            isSelected={isSelected}
            onDragEnd={onDragEnd}
            onSelect={onSelect}
            onDoubleClick={onDoubleClick}
            isDraggable={isDraggable}
        >
            {/* Title */}
            <Text
                x={10}
                y={6}
                text={item.data.title || "Example Title"}
                fontSize={item.data.fontSize + 2 || 16}
                fontStyle="bold"
                width={item.width - 20}
                height={24}
                fill="#333"
                onClick={onSelect}
                onDblClick={onDoubleClick}
            />

            {/* Days Left */}
            <Text
                x={10}
                y={34}
                text={`Days left: ${daysLeft}`}
                fontSize={item.data.fontSize}
                fill={daysLeft > 0 ? "#2e7d32" : "#d32f2f"}
                width={item.width - 20}
                height={20}
                onClick={onSelect}
                onDblClick={onDoubleClick}
            />

            {/* Description */}
            <Text
                x={10}
                y={60} // Placed below "Days left" which ends at y=54 + some padding
                text={item.data.description || "Describe your goal here..."}
                fontSize={item.data.fontSize}
                width={item.width - 20}
                height={item.height - 70} // 60 for offset + 10px bottom margin
                wrap="word"
                onClick={onSelect}
                onDblClick={onDoubleClick}
                listening={true}
            />

            {/* Resize handles when selected */}
            {isSelected && (
                <>
                    <Circle
                        x={item.width}
                        y={item.height}
                        radius={6}
                        fill="#007bff"
                        stroke="#0056b3"
                        strokeWidth={1}
                        onMouseDown={(e) => handleResizeMouseDown(e, "bottom-right")}
                        draggable={false}
                        listening={true}
                        style={{ cursor: "nw-resize" }}
                    />
                    <Circle
                        x={item.width / 2}
                        y={item.height}
                        radius={6}
                        fill="#007bff"
                        stroke="#0056b3"
                        strokeWidth={1}
                        onMouseDown={(e) => handleResizeMouseDown(e, "bottom")}
                        draggable={false}
                        listening={true}
                        style={{ cursor: "n-resize" }}
                    />
                    <Circle
                        x={item.width}
                        y={item.height / 2}
                        radius={6}
                        fill="#007bff"
                        stroke="#0056b3"
                        strokeWidth={1}
                        onMouseDown={(e) => handleResizeMouseDown(e, "right")}
                        draggable={false}
                        listening={true}
                        style={{ cursor: "e-resize" }}
                    />

                    {/* Coler Picker "button" */}
                        <Circle
                            x={item.width / 2}
                            y={item.height / item.height}
                            radius={8}
                            fill="#ff69b4"
                            stroke="#b3006b"
                            strokeWidth={1}
                            onClick={() => onOpenColorPicker?.(item.id, item.type)}
                            draggable={false}
                            listening={true}
                            style={{ cursor: 'pointer' }}
                        />
                </>
            )}
        </BaseItem>
    );
};

export default GoalNote;
