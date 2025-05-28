# File Organization Structure

## Directory Structure
```
src/
├── components/
│   ├── canvas/
│   │   ├── CanvasBoard.jsx
│   │   ├── Grid.jsx
│   │   └── index.js
│   ├── items/
│   │   ├── base/
│   │   │   ├── BaseItem.jsx
│   │   │   └── ItemRenderer.jsx
│   │   ├── sticky-note/
│   │   │   ├── StickyNote.jsx
│   │   │   └── StickyNoteEditor.jsx
│   │   ├── todo-list/
│   │   │   ├── TodoList.jsx
│   │   │   └── TodoListEditor.jsx
│   │   ├── goal-note/
│   │   │   ├── GoalNote.jsx
│   │   │   └── GoalNoteEditor.jsx
│   │   └── index.js
│   ├── toolbar/
│   │   ├── Toolbar.jsx
│   │   ├── ToolButton.jsx
│   │   └── index.js
│   ├── ui/
│   │   ├── Modal.jsx
│   │   ├── InfoPanel.jsx
│   │   └── index.js
│   └── index.js
├── hooks/
│   ├── useCanvas.js
│   ├── useItems.js
│   ├── useKeyboardShortcuts.js
│   └── index.js
├── constants/
│   ├── itemTypes.js
│   ├── colors.js
│   └── index.js
├── utils/
│   ├── itemFactory.js
│   ├── coordinates.js
│   └── index.js
└── App.jsx
```

## File Contents

### constants/itemTypes.js
```javascript
export const ITEM_TYPES = {
  STICKY_NOTE: 'sticky_note',
  TODO_LIST: 'todo_list',
  GOAL_NOTE: 'goal_note',
  DRAWING_PATH: 'drawing_path'
};

export const DEFAULT_DIMENSIONS = {
  [ITEM_TYPES.STICKY_NOTE]: { width: 150, height: 120 },
  [ITEM_TYPES.TODO_LIST]: { width: 200, height: 200 },
  [ITEM_TYPES.GOAL_NOTE]: { width: 220, height: 180 }
};
```

### constants/colors.js
```javascript
export const ITEM_COLORS = {
  STICKY_NOTE: '#fff59d',
  TODO_LIST: '#c8e6c9',
  GOAL_NOTE: '#ffcdd2',
  SELECTED: '#ffeb3b'
};

export const UI_COLORS = {
  GRID: '#ddd',
  BACKGROUND: '#fafafa',
  PANEL_BG: '#fff'
};
```

### utils/itemFactory.js
```javascript
import { ITEM_TYPES, DEFAULT_DIMENSIONS } from '../constants/itemTypes';
import { ITEM_COLORS } from '../constants/colors';

export const createNewItem = (type, x = 100, y = 100) => {
  const baseItem = {
    id: Date.now(),
    type,
    x,
    y,
    zIndex: 0,
    ...DEFAULT_DIMENSIONS[type]
  };

  switch (type) {
    case ITEM_TYPES.STICKY_NOTE:
      return {
        ...baseItem,
        data: {
          text: "New sticky note",
          color: ITEM_COLORS.STICKY_NOTE,
          fontSize: 16
        }
      };
    case ITEM_TYPES.TODO_LIST:
      return {
        ...baseItem,
        data: {
          title: "New Todo List",
          color: ITEM_COLORS.TODO_LIST,
          items: [
            { id: "new1", text: "Add your first task", completed: false }
          ]
        }
      };
    case ITEM_TYPES.GOAL_NOTE:
      return {
        ...baseItem,
        data: {
          title: "New Goal",
          description: "Describe your goal here",
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          progress: 0,
          color: ITEM_COLORS.GOAL_NOTE
        }
      };
    default:
      return baseItem;
  }
};
```

### hooks/useCanvas.js
```javascript
import { useState, useRef, useEffect } from 'react';

export const useCanvas = () => {
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });
  
  const stageRef = useRef();
  const isPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const updateCenterPosition = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const scale = stage.scaleX();
    const x = (window.innerWidth / 2 - stage.x()) / scale;
    const y = (window.innerHeight / 2 - stage.y()) / scale;
    setCenterPos({ x, y });
  };

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

  useEffect(() => {
    updateCenterPosition();
    const handleResize = () => updateCenterPosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    stageScale,
    stagePos,
    centerPos,
    stageRef,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    updateCenterPosition
  };
};
```

### hooks/useItems.js
```javascript
import { useState } from 'react';
import { createNewItem } from '../utils/itemFactory';

export const useItems = (initialItems = []) => {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(null);

  const addItem = (type, x, y) => {
    const newItem = createNewItem(type, x, y);
    setItems(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
    return newItem;
  };

  const updateItem = (id, updates) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const updateItemData = (id, dataUpdates) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, data: { ...item.data, ...dataUpdates } }
        : item
    ));
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const moveItem = (id, x, y) => {
    updateItem(id, { x, y });
  };

  const getSelectedItem = () => {
    return items.find(item => item.id === selectedId);
  };

  return {
    items,
    selectedId,
    setSelectedId,
    addItem,
    updateItem,
    updateItemData,
    deleteItem,
    moveItem,
    getSelectedItem
  };
};
```

### components/items/base/BaseItem.jsx
```javascript
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
```

### components/items/base/ItemRenderer.jsx
```javascript
import React from "react";
import { ITEM_TYPES } from "../../../constants/itemTypes";
import StickyNote from "../sticky-note/StickyNote";
import TodoList from "../todo-list/TodoList";
import GoalNote from "../goal-note/GoalNote";

const ItemRenderer = ({ 
  item, 
  isSelected, 
  onDragEnd, 
  onSelect, 
  onDoubleClick 
}) => {
  const commonProps = {
    item,
    isSelected,
    onDragEnd,
    onSelect,
    onDoubleClick
  };

  switch (item.type) {
    case ITEM_TYPES.STICKY_NOTE:
      return <StickyNote {...commonProps} />;
    case ITEM_TYPES.TODO_LIST:
      return <TodoList {...commonProps} />;
    case ITEM_TYPES.GOAL_NOTE:
      return <GoalNote {...commonProps} />;
    default:
      return null;
  }
};

export default ItemRenderer;
```

### components/items/sticky-note/StickyNote.jsx
```javascript
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
```

### components/canvas/CanvasBoard.jsx
```javascript
import React from "react";
import { Stage, Layer } from "react-konva";
import { useCanvas } from "../../hooks/useCanvas";
import { useItems } from "../../hooks/useItems";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import ItemRenderer from "../items/base/ItemRenderer";
import Grid from "./Grid";
import Toolbar from "../toolbar/Toolbar";
import InfoPanel from "../ui/InfoPanel";
import StickyNoteEditor from "../items/sticky-note/StickyNoteEditor";
import { ITEM_TYPES } from "../../constants/itemTypes";
import { UI_COLORS } from "../../constants/colors";

// Sample data
const INITIAL_ITEMS = [
  {
    id: 1,
    type: ITEM_TYPES.STICKY_NOTE,
    x: 50, y: 60, width: 150, height: 120, zIndex: 0,
    data: { text: "First Note", color: "#fff59d", fontSize: 16 }
  },
  // ... other initial items
];

const CanvasBoard = () => {
  const canvas = useCanvas();
  const items = useItems(INITIAL_ITEMS);
  
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useKeyboardShortcuts({
    onDelete: () => {
      if (items.selectedId) {
        items.deleteItem(items.selectedId);
      }
    }
  });

  const handleDoubleClick = (item) => {
    if (item.type === ITEM_TYPES.STICKY_NOTE) {
      setEditingId(item.id);
      setEditingText(item.data.text);
    }
  };

  const handleAddItem = (type) => {
    items.addItem(type, canvas.centerPos.x - 100, canvas.centerPos.y - 60);
  };

  return (
    <>
      <InfoPanel 
        zoom={canvas.stageScale}
        itemCount={items.items.length}
        selectedId={items.selectedId}
      />
      
      <Toolbar onAddItem={handleAddItem} />
      
      <StickyNoteEditor
        editingId={editingId}
        editingText={editingText}
        setEditingText={setEditingText}
        items={items.items}
        stageScale={canvas.stageScale}
        stagePos={canvas.stagePos}
        onFinishEditing={() => {
          items.updateItemData(editingId, { text: editingText });
          setEditingId(null);
          setEditingText("");
        }}
        onCancel={() => {
          setEditingId(null);
          setEditingText("");
        }}
      />

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        scaleX={canvas.stageScale}
        scaleY={canvas.stageScale}
        x={canvas.stagePos.x}
        y={canvas.stagePos.y}
        onWheel={canvas.handleWheel}
        onMouseDown={(e) => {
          canvas.handleMouseDown(e);
          const clickedOnEmpty = e.target === canvas.stageRef.current;
          if (clickedOnEmpty) {
            items.setSelectedId(null);
          }
        }}
        onMouseMove={canvas.handleMouseMove}
        onMouseUp={canvas.handleMouseUp}
        ref={canvas.stageRef}
        style={{ background: UI_COLORS.BACKGROUND }}
      >
        <Layer>
          <Grid />
        </Layer>
        <Layer>
          {items.items.map((item) => (
            <ItemRenderer
              key={item.id}
              item={item}
              isSelected={items.selectedId === item.id}
              onDragEnd={items.moveItem}
              onSelect={() => items.setSelectedId(item.id)}
              onDoubleClick={() => handleDoubleClick(item)}
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

export default CanvasBoard;
```

## Benefits of This Organization

### 1. **Separation of Concerns**
- Each component has a single responsibility
- Business logic separated from UI components
- Hooks contain reusable stateful logic

### 2. **Scalability**
- Easy to add new item types
- Components are small and focused
- Clear dependency structure

### 3. **Maintainability**
- Easy to find and modify specific functionality
- Changes to one item type don't affect others
- Clear import/export structure

### 4. **Testability**
- Each component can be tested in isolation
- Hooks can be tested separately
- Utils functions are pure and testable

### 5. **Reusability**
- Hooks can be reused across components
- Base components can be extended
- Utils can be used anywhere

This structure makes your codebase professional, scalable, and much easier to work with as your project grows!