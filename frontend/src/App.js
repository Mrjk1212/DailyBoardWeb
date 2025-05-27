// Install required packages before using:
// npm install react-konva konva

import React, { useState } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";

const StickyNote = ({ note, isSelected, onDragEnd, onSelect }) => {
  return (
    <>
      <Rect
        x={note.x}
        y={note.y}
        width={note.width}
        height={note.height}
        fill={isSelected ? "#ffeb3b" : "#f5f5dc"}
        shadowBlur={5}
        draggable
        onClick={onSelect}
        onDragEnd={(e) => {
          onDragEnd(note.id, e.target.x(), e.target.y());
        }}
      />
      <Text
        x={note.x + 10}
        y={note.y + 10}
        text={note.text}
        fontSize={16}
        width={note.width - 20}
        height={note.height - 20}
        wrap="word"
        onClick={onSelect}
      />
    </>
  );
};

export default function CanvasBoard() {
  const [notes, setNotes] = useState([
    { id: 1, x: 50, y: 60, width: 150, height: 120, text: "First Note" },
    { id: 2, x: 250, y: 180, width: 150, height: 120, text: "Second Note" }
  ]);
  const [selectedId, setSelectedId] = useState(null);

  const handleDragEnd = (id, x, y) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, x, y } : note))
    );
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            isSelected={note.id === selectedId}
            onDragEnd={handleDragEnd}
            onSelect={() => setSelectedId(note.id)}
          />
        ))}
      </Layer>
    </Stage>
  );
}
