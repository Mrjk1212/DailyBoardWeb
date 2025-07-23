import React, { useState } from "react";
import { Text, Circle, Image } from "react-konva";
import BaseItem from "../base/BaseItem";
import {ChromePicker} from 'react-color';
import { Html } from "react-konva-utils";
import useImage from 'use-image';
import colorWheelImage from "../../../resources/colorWheelImage.png";

const StickyNote = ({ item, isSelected, onDragEnd, onSelect, onDoubleClick, onResize, isDraggable, onOpenColorPicker }) => {

    const handleResizeMouseDown = (e, corner) => {
        e.cancelBubble = true;
        e.evt.preventDefault();
        
        if (onResize) {
            onResize(item.id, corner, e);
        }
    };

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
            onDoubleClick={onDoubleClick}
            isDraggable={isDraggable}
        >
            <Text
            x={10}
            y={6}
            text={item.data.title || "Example Title"}
            fontSize={item.data.fontSize + 2}
            fontStyle="bold"
            width={item.width - 20}
            height={24}
            fill="#333"
            onClick={onSelect}
            onDblClick={onDoubleClick}
            />
            <Text
                x={10}
                y={32}
                text={item.data.text}
                fontSize={item.data.fontSize || 16}
                width={item.width - 20}
                height={item.height - 20}
                wrap="word"
                onClick={onSelect}
                onDblClick={onDoubleClick}
                listening={true}
            />
            
            {/* Resize handles - only show when selected */}
            {isSelected && (
                <>
                    {/* Bottom-right resize handle */}
                    <Circle
                        x={item.width}
                        y={item.height}
                        radius={6}
                        fill="#007bff"
                        stroke="#0056b3"
                        strokeWidth={1}
                        onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
                        draggable={false}
                        listening={true}
                        style={{ cursor: 'nw-resize' }}
                    />
                    
                    {/* Bottom resize handle */}
                    <Circle
                        x={item.width / 2}
                        y={item.height}
                        radius={6}
                        fill="#007bff"
                        stroke="#0056b3"
                        strokeWidth={1}
                        onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')}
                        draggable={false}
                        listening={true}
                        style={{ cursor: 'n-resize' }}
                    />
                    
                    {/* Right resize handle */}
                    <Circle
                        x={item.width}
                        y={item.height / 2}
                        radius={6}
                        fill="#007bff"
                        stroke="#0056b3"
                        strokeWidth={1}
                        onMouseDown={(e) => handleResizeMouseDown(e, 'right')}
                        draggable={false}
                        listening={true}
                        style={{ cursor: 'e-resize' }}
                    />

                    {/* Coler Picker "button" */}
                    <Image
                        image={image}
                        scaleX={0.1}
                        scaleY={0.1}
                        x={(item.width) - scaledX}
                        y={scaledY - scaledY}
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

export default StickyNote;