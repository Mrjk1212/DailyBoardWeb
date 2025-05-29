import React from "react";
import { Group, Rect } from "react-konva";

const BaseItem = ({ 
    item, 
    isSelected, 
    onDragEnd, 
    onSelect, 
    onDoubleClick, 
    children,
    isDraggable = true 
}) => {
    const handleDragEnd = (e) => {
        const newX = e.target.x();
        const newY = e.target.y();
        
        if (onDragEnd) {
            onDragEnd(item.id, newX, newY);
        }
        
        // Reset position to prevent Konva state issues
        e.target.position({ x: item.x, y: item.y });
    };

    return (
        <Group
            x={item.x}
            y={item.y}
            draggable={isDraggable}
            onDragEnd={handleDragEnd}
            onClick={onSelect}
            onDblClick={onDoubleClick}
        >
            {/* Background rectangle */}
            <Rect
                x={0}
                y={0}
                width={item.width}
                height={item.height}
                fill={item.data?.color || "#fff59d"}
                stroke={isSelected ? "#007bff" : "#ddd"}
                strokeWidth={isSelected ? 2 : 1}
                cornerRadius={4}
                shadowColor="rgba(0,0,0,0.2)"
                shadowBlur={isSelected ? 8 : 4}
                shadowOffset={{ x: 4, y: 4 }}
                shadowOpacity={0.4}
            />
            
            {children}
        </Group>
    );
};

export default BaseItem;