import React from "react";
import { Rect, Text, Image } from "react-konva";
import BaseItem from "../base/BaseItem";
import { Circle } from "react-konva";
import useImage from 'use-image';
import colorWheelImage from "../../../resources/colorWheelImage.png";

const Calendar = ({
    item,
    isSelected,
    onDragEnd,
    onSelect,
    onResize,
    onDoubleClick,
    isDraggable,
    onOpenColorPicker
}) => {

    const [image] = useImage(colorWheelImage);

    //Need to sort of buffer this bc useImage is async and leads to nothing on the first render...
    if (!image) {
        return <Text text="Loading..." />;
    }

    const scaledX = image.width * 0.1;
    const scaledY = image.height * 0.1;

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
        fill="#8d8c86ff"
        stroke={item.data.color || "#BBBBBBBB"}
        strokeWidth={30}
        cornerRadius={10}
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
                x={item.width + 5}
                y={item.height + 5}
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
                y={item.height + 10}
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
                x={item.width + 10}
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

            {/* Coler Picker "button" */}
            <Image
                image={image}
                scaleX={0.1}
                scaleY={0.1}
                x={(item.width)}//x={(item.width) - scaledX}
                y={scaledY - scaledY}//y={-20}
                strokeWidth={1}
                onClick={() => onOpenColorPicker?.(item.id, item.type)}
                draggable={false}
                listening={true}
                style={{ cursor: 'pointer' }}
                
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
