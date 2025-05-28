import React from "react";
import { Text } from "react-konva";
import BaseItem from "../base/BaseItem";

const StickyNote = ({ item, isSelected, onDragEnd, onSelect, onDoubleClick }) => (
    <BaseItem
        item={item}
        isSelected={isSelected}
        onDragEnd={onDragEnd}
        onSelect={onSelect}
        onDoubleClick={onDoubleClick}
    >
        <Text
            x={item.x + 10}
            y={item.y + 10}
            text={item.data.text}
            fontSize={item.data.fontSize || 16}
            width={item.width - 20}
            height={item.height - 20}
            wrap="word"
            onClick={onSelect}
            onDblClick={onDoubleClick}
            listening={true}
        />
    </BaseItem>
);

export default StickyNote;