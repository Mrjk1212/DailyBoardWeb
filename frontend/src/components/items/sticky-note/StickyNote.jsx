import React from "react";
import { Text, Circle } from "react-konva";
import BaseItem from "../base/BaseItem";

const StickyNote = ({ item, isSelected, onDragEnd, onSelect, onDoubleClick, onResize, isDraggable }) => {
    const handleResizeMouseDown = (e, corner) => {
        e.cancelBubble = true;
        e.evt.preventDefault();
        
        if (onResize) {
            onResize(item.id, corner, e);
        }
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
                </>
            )}
        </BaseItem>
    );
};

export default StickyNote;