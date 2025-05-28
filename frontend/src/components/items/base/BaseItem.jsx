import React from "react";
import { Rect } from "react-konva";
import { ITEM_COLORS } from "../../../constants/colors";

const BaseItem = ({
    item,
    isSelected,
    onDragEnd,
    onSelect,
    onDoubleClick,
    children
}) => {
    return (
        <>
            <Rect
                x={item.x}
                y={item.y}
                width={item.width}
                height={item.height}
                fill={isSelected ? ITEM_COLORS.SELECTED : item.data.color}
                shadowBlur={5}
                draggable
                onClick={onSelect}
                onDragEnd={(e) => {
                    onDragEnd(item.id, e.target.x(), e.target.y());
                }}
            />
            {children}
        </>
    );
};

export default BaseItem;