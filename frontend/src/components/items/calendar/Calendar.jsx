import React from "react";
import { Rect, Text } from "react-konva";
import BaseItem from "../base/BaseItem";
import { Circle } from "react-konva";

const Calendar = ({
    item,
    isSelected,
    onDragEnd,
    onSelect,
    onResize,
    onDoubleClick,
    isDraggable
}) => {
    return (
        <BaseItem
            item={item}
            isSelected={isSelected}
            onDragEnd={onDragEnd}
            onSelect={onSelect}
            onResize={onResize}
            onDoubleClick={onDoubleClick}
            isDraggable={isDraggable}
        >
            <>
    <Rect
        width={item.width}
        height={item.height}
        fill="#fffde7"
        stroke="#fbc02d"
        strokeWidth={20}
        cornerRadius={6}
        onClick={onSelect}
    />
    <Text
        text="📅 Calendar"
        fontSize={16}
        x={10}
        y={6}
        fill="#333"
        fontStyle="bold"
    />

    {isSelected && (
        <>
            {/* Bottom-right */}
            <Circle
                x={item.width}
                y={item.height}
                radius={6}
                fill="#007bff"
                stroke="#0056b3"
                strokeWidth={1}
                onMouseDown={(e) => {
                    e.cancelBubble = true;
                    e.evt.preventDefault();
                    onResize(item.id, 'bottom-right', e);
                }}
                style={{ cursor: 'nwse-resize' }}
            />

            {/* Bottom */}
            <Circle
                x={item.width / 2}
                y={item.height}
                radius={6}
                fill="#007bff"
                stroke="#0056b3"
                strokeWidth={1}
                onMouseDown={(e) => {
                    e.cancelBubble = true;
                    e.evt.preventDefault();
                    onResize(item.id, 'bottom', e);
                }}
                style={{ cursor: 'ns-resize' }}
            />

            {/* Right */}
            <Circle
                x={item.width}
                y={item.height / 2}
                radius={6}
                fill="#007bff"
                stroke="#0056b3"
                strokeWidth={1}
                onMouseDown={(e) => {
                    e.cancelBubble = true;
                    e.evt.preventDefault();
                    onResize(item.id, 'right', e);
                }}
                style={{ cursor: 'ew-resize' }}
            />
        </>
    )}
</>
            <Text
                text="📅 Calendar"
                fontSize={16}
                x={10}
                y={6}
                fill="#333"
                fontStyle="bold"
            />
        </BaseItem>
    );
};

export default Calendar;
