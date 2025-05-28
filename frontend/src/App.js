import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Rect, Text, Line } from "react-konva";

const StickyNote = ({
  note,
  isSelected,
  onDragEnd,
  onSelect,
  onDoubleClick,
  scale,
  stagePos,
}) => (
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
      onDblClick={onDoubleClick}
      listening={true}
    />
  </>
);

const CanvasBoard = () => {
  const [notes, setNotes] = useState([
    { id: 1, x: 50, y: 60, width: 150, height: 120, text: "First Note" },
    { id: 2, x: 250, y: 180, width: 150, height: 120, text: "Second Note" },
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });

  const stageRef = useRef();
  const containerRef = useRef();
  const textareaRef = useRef();

  const isPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const updateCenterPosition = () => {
    const stage = stageRef.current;
    const scale = stage.scaleX();
    const x = (window.innerWidth / 2 - stage.x()) / scale;
    const y = (window.innerHeight / 2 - stage.y()) / scale;
    setCenterPos({ x, y });
  };

  useEffect(() => {
    updateCenterPosition();
    const handleResize = () => updateCenterPosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const scaleBy = 1.05;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    newScale = Math.max(0.25, Math.min(3, newScale));

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setStageScale(newScale);
    setStagePos(newPos);
    setTimeout(updateCenterPosition, 0);
  };

  const handleMouseDown = (e) => {
    const clickedOnEmpty = e.target === stageRef.current;
    if (!clickedOnEmpty) return;
    isPanning.current = true;
    lastMousePos.current = {
      x: e.evt.clientX,
      y: e.evt.clientY,
    };
  };

  const handleMouseMove = (e) => {
    if (!isPanning.current) return;
    const dx = e.evt.clientX - lastMousePos.current.x;
    const dy = e.evt.clientY - lastMousePos.current.y;

    setStagePos((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    lastMousePos.current = {
      x: e.evt.clientX,
      y: e.evt.clientY,
    };

    setTimeout(updateCenterPosition, 0);
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };

  const handleDragEnd = (id, x, y) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, x, y } : note))
    );
    setTimeout(updateCenterPosition, 0);
  };

  const drawGrid = (spacing = 50, size = 2000) => {
    const lines = [];
    for (let i = -size; i < size * 2; i += spacing) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i, -size, i, size * 2]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
    }
    for (let j = -size; j < size * 2; j += spacing) {
      lines.push(
        <Line
          key={`h-${j}`}
          points={[-size, j, size * 2, j]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
    }
    return lines;
  };

  // Start editing note text on double click
  const handleDoubleClick = (note) => {
    setEditingId(note.id);
    setEditingText(note.text);
  };

  // Calculate textarea position and size relative to the page
  const getTextareaStyle = () => {
    if (!editingId) return { display: "none" };
    const note = notes.find((n) => n.id === editingId);
    if (!note) return { display: "none" };

    // Position and scale transformations from stage coords to screen coords
    const stage = stageRef.current;
    const scale = stageScale;
    const stagePosX = stagePos.x;
    const stagePosY = stagePos.y;

    return {
      position: "absolute",
      top: stagePosY + note.y * scale + 0 * scale,
      left: stagePosX + note.x * scale + 0 * scale,
      width: (note.width - 20) * scale,
      height: (note.height - 20) * scale,
      fontSize: 16 * scale,
      resize: "none",
      padding: 4,
      borderRadius: 4,
      border: "1px solid #666",
      boxShadow: "0 0 5px rgba(0,0,0,0.2)",
      background: "#fffb8f",
      zIndex: 10,
      outline: "none",
      overflow: "hidden",
      lineHeight: "1.2em",
      fontFamily: "Arial, sans-serif",
      display: "block",
    };
  };

  const finishEditing = () => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === editingId ? { ...note, text: editingText } : note
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          background: "#fff",
          padding: "4px 8px",
          borderRadius: 4,
          zIndex: 20,
        }}
      >
        Zoom: {stageScale.toFixed(2)} | Center: ({centerPos.x.toFixed(0)},{" "}
        {centerPos.y.toFixed(0)})
      </div>

      {/* Editable textarea */}
      <textarea
        ref={textareaRef}
        style={getTextareaStyle()}
        value={editingText}
        onChange={(e) => setEditingText(e.target.value)}
        onBlur={finishEditing}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            finishEditing();
          }
          if (e.key === "Escape") {
            setEditingId(null);
            setEditingText("");
          }
        }}
        autoFocus
      />

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={stageRef}
        style={{ background: "#fafafa" }}
      >
        <Layer>{drawGrid()}</Layer>
        <Layer>
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              note={note}
              isSelected={selectedId === note.id}
              onDragEnd={handleDragEnd}
              onSelect={() => setSelectedId(note.id)}
              onDoubleClick={() => handleDoubleClick(note)}
              scale={stageScale}
              stagePos={stagePos}
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

export default CanvasBoard;
