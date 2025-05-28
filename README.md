# DailyBoardWeb

# Visual Canvas Application Architecture

## Frontend Architecture (React)

### Component Structure
```
src/
├── components/
│   ├── canvas/
│   │   ├── CanvasBoard.jsx (main canvas container)
│   │   ├── CanvasControls.jsx (zoom, pan, mode controls)
│   │   └── Grid.jsx (grid rendering)
│   ├── items/
│   │   ├── base/
│   │   │   ├── BaseItem.jsx (shared item logic)
│   │   │   └── ItemTypes.js (constants)
│   │   ├── StickyNote.jsx
│   │   ├── TodoList.jsx
│   │   ├── GoalNote.jsx
│   │   └── DrawingPath.jsx
│   ├── editors/
│   │   ├── TextEditor.jsx
│   │   ├── TodoEditor.jsx
│   │   └── GoalEditor.jsx
│   ├── toolbar/
│   │   ├── ToolBar.jsx
│   │   ├── ItemSelector.jsx
│   │   └── DrawingTools.jsx
│   └── ui/
│       ├── Modal.jsx
│       ├── DatePicker.jsx
│       └── ColorPicker.jsx
├── hooks/
│   ├── useCanvas.js (canvas state management)
│   ├── useItems.js (item CRUD operations)
│   ├── useDrawing.js (drawing functionality)
│   └── useAutoSave.js (auto-save functionality)
├── services/
│   ├── api.js (backend communication)
│   ├── canvasService.js (canvas operations)
│   └── storage.js (local storage fallback)
├── utils/
│   ├── coordinates.js (coordinate transformations)
│   ├── serialization.js (data serialization)
│   └── validation.js (data validation)
└── types/
    ├── canvas.js
    ├── items.js
    └── api.js
```

## Data Models

### Canvas Item Base Structure
```javascript
{
  id: string,
  type: 'sticky_note' | 'todo_list' | 'goal_note' | 'drawing_path',
  x: number,
  y: number,
  width: number,
  height: number,
  zIndex: number,
  createdAt: timestamp,
  updatedAt: timestamp,
  canvasId: string,
  // Type-specific data in 'data' field
  data: object
}
```

### Specific Item Types
```javascript
// Sticky Note
{
  type: 'sticky_note',
  data: {
    text: string,
    color: string,
    fontSize: number
  }
}

// Todo List
{
  type: 'todo_list',
  data: {
    title: string,
    items: [
      {
        id: string,
        text: string,
        completed: boolean,
        dueDate: timestamp | null,
        priority: 'low' | 'medium' | 'high'
      }
    ],
    color: string
  }
}

// Goal Note
{
  type: 'goal_note',
  data: {
    title: string,
    description: string,
    targetDate: timestamp,
    status: 'not_started' | 'in_progress' | 'completed' | 'paused',
    progress: number, // 0-100
    milestones: [
      {
        id: string,
        text: string,
        completed: boolean,
        dueDate: timestamp
      }
    ],
    color: string
  }
}

// Drawing Path
{
  type: 'drawing_path',
  data: {
    points: [number], // [x1, y1, x2, y2, ...]
    strokeColor: string,
    strokeWidth: number,
    tool: 'pen' | 'highlighter' | 'eraser'
  }
}
```

## Backend Architecture (Spring Boot)

### Package Structure
```
com.yourapp.canvas/
├── controller/
│   ├── CanvasController.java
│   ├── ItemController.java
│   └── UserController.java
├── service/
│   ├── CanvasService.java
│   ├── ItemService.java
│   └── UserService.java
├── repository/
│   ├── CanvasRepository.java
│   ├── ItemRepository.java
│   └── UserRepository.java
├── model/
│   ├── Canvas.java
│   ├── Item.java
│   ├── User.java
│   └── dto/
│       ├── CanvasDto.java
│       ├── ItemDto.java
│       └── CreateItemRequest.java
├── config/
│   ├── WebConfig.java
│   └── DatabaseConfig.java
└── util/
    ├── JsonUtils.java
    └── ValidationUtils.java
```

### Database Schema (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Canvases table
CREATE TABLE canvases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    settings JSONB DEFAULT '{}', -- zoom, position, grid settings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items table (polymorphic for all item types)
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canvas_id UUID NOT NULL REFERENCES canvases(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- 'sticky_note', 'todo_list', etc.
    x DECIMAL(10,2) NOT NULL,
    y DECIMAL(10,2) NOT NULL,
    width DECIMAL(10,2) NOT NULL,
    height DECIMAL(10,2) NOT NULL,
    z_index INTEGER DEFAULT 0,
    data JSONB NOT NULL, -- type-specific data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_items_canvas_id ON items(canvas_id);
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_canvases_user_id ON canvases(user_id);
```

## API Endpoints

### Canvas Management
```
GET    /api/canvases              - List user's canvases
POST   /api/canvases              - Create new canvas
GET    /api/canvases/{id}         - Get canvas with items
PUT    /api/canvases/{id}         - Update canvas settings
DELETE /api/canvases/{id}         - Delete canvas
```

### Item Management
```
GET    /api/canvases/{id}/items   - Get all items for canvas
POST   /api/canvases/{id}/items   - Create new item
PUT    /api/items/{id}            - Update item
DELETE /api/items/{id}            - Delete item
POST   /api/items/batch          - Batch operations (move, delete multiple)
```

## Implementation Strategy

### Phase 1: Foundation
1. **Extend current sticky note system**
   - Add item type system
   - Implement BaseItem component
   - Add basic item creation/deletion

2. **Backend basics**
   - Set up Spring Boot project
   - Create database schema
   - Implement basic CRUD operations

### Phase 2: Core Features
1. **Todo List Component**
   - Create TodoList item type
   - Add todo item management
   - Implement due dates and priorities

2. **Goal Note Component**
   - Create GoalNote item type
   - Add progress tracking
   - Implement milestone system

### Phase 3: Drawing System
1. **Drawing infrastructure**
   - Add drawing mode to canvas
   - Implement path creation and storage
   - Add drawing tools (pen, highlighter, eraser)

### Phase 4: Polish & Optimization
1. **Real-time collaboration** (WebSocket)
2. **Advanced features** (templates, search, export)
3. **Performance optimization** (virtualization, caching)

## Key Technical Considerations

### Frontend State Management
- Use React Context + useReducer for global canvas state
- Implement optimistic updates for better UX
- Add undo/redo functionality

### Performance Optimization
- Implement item virtualization for large canvases
- Use React.memo for item components
- Debounce auto-save operations
- Implement efficient hit detection for drawing

### Data Synchronization
- Implement conflict resolution for concurrent edits
- Use version numbers for optimistic locking
- Add real-time sync with WebSocket connections

### Security
- Implement JWT authentication
- Add rate limiting for API endpoints
- Validate all user inputs on backend
- Implement proper CORS configuration

This architecture provides a solid foundation that can scale as you add more features while keeping the codebase organized and maintainable.








------------------------------------------------------------------------------------------------------
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Rect, Text, Line, Circle } from "react-konva";

// Item Types Constants
const ITEM_TYPES = {
  STICKY_NOTE: 'sticky_note',
  TODO_LIST: 'todo_list',
  GOAL_NOTE: 'goal_note',
  DRAWING_PATH: 'drawing_path'
};

// Base Item Component
const BaseItem = ({ item, isSelected, onDragEnd, onSelect, onDoubleClick, children }) => {
  return (
    <>
      <Rect
        x={item.x}
        y={item.y}
        width={item.width}
        height={item.height}
        fill={isSelected ? "#ffeb3b" : item.data.color || "#f5f5dc"}
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

// Sticky Note Component
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

// Todo List Component
const TodoList = ({ item, isSelected, onDragEnd, onSelect, onDoubleClick }) => {
  const renderTodoItems = () => {
    const items = item.data.items || [];
    const maxItems = Math.floor((item.height - 40) / 25); // Calculate how many items fit
    const visibleItems = items.slice(0, maxItems);
    
    return visibleItems.map((todoItem, index) => (
      <React.Fragment key={todoItem.id}>
        {/* Checkbox */}
        <Circle
          x={item.x + 20}
          y={item.y + 35 + (index * 25)}
          radius={6}
          fill={todoItem.completed ? "#4caf50" : "white"}
          stroke="#666"
          strokeWidth={2}
        />
        {/* Check mark */}
        {todoItem.completed && (
          <Text
            x={item.x + 16}
            y={item.y + 30 + (index * 25)}
            text="✓"
            fontSize={10}
            fill="white"
          />
        )}
        {/* Todo text */}
        <Text
          x={item.x + 35}
          y={item.y + 28 + (index * 25)}
          text={todoItem.text}
          fontSize={14}
          width={item.width - 45}
          fill={todoItem.completed ? "#888" : "#333"}
          textDecoration={todoItem.completed ? "line-through" : ""}
        />
      </React.Fragment>
    ));
  };

  return (
    <BaseItem
      item={item}
      isSelected={isSelected}
      onDragEnd={onDragEnd}
      onSelect={onSelect}
      onDoubleClick={onDoubleClick}
    >
      {/* Title */}
      <Text
        x={item.x + 10}
        y={item.y + 8}
        text={item.data.title || "Todo List"}
        fontSize={16}
        fontStyle="bold"
        width={item.width - 20}
        onClick={onSelect}
        onDblClick={onDoubleClick}
      />
      {/* Todo items */}
      {renderTodoItems()}
    </BaseItem>
  );
};

// Goal Note Component
const GoalNote = ({ item, isSelected, onDragEnd, onSelect, onDoubleClick }) => {
  const progress = item.data.progress || 0;
  const progressBarWidth = item.width - 40;
  const progressFillWidth = (progress / 100) * progressBarWidth;

  return (
    <BaseItem
      item={item}
      isSelected={isSelected}
      onDragEnd={onDragEnd}
      onSelect={onSelect}
      onDoubleClick={onDoubleClick}
    >
      {/* Title */}
      <Text
        x={item.x + 10}
        y={item.y + 8}
        text={item.data.title || "Goal"}
        fontSize={16}
        fontStyle="bold"
        width={item.width - 20}
        onClick={onSelect}
        onDblClick={onDoubleClick}
      />
      
      {/* Target Date */}
      <Text
        x={item.x + 10}
        y={item.y + 30}
        text={`Target: ${item.data.targetDate ? new Date(item.data.targetDate).toLocaleDateString() : 'No date set'}`}
        fontSize={12}
        fill="#666"
        width={item.width - 20}
      />
      
      {/* Progress Bar Background */}
      <Rect
        x={item.x + 20}
        y={item.y + 50}
        width={progressBarWidth}
        height={10}
        fill="#e0e0e0"
        cornerRadius={5}
      />
      
      {/* Progress Bar Fill */}
      <Rect
        x={item.x + 20}
        y={item.y + 50}
        width={progressFillWidth}
        height={10}
        fill="#4caf50"
        cornerRadius={5}
      />
      
      {/* Progress Text */}
      <Text
        x={item.x + 20}
        y={item.y + 68}
        text={`${progress}% complete`}
        fontSize={12}
        fill="#333"
      />
      
      {/* Description */}
      <Text
        x={item.x + 10}
        y={item.y + 88}
        text={item.data.description || "No description"}
        fontSize={12}
        width={item.width - 20}
        height={item.height - 100}
        wrap="word"
        fill="#555"
      />
    </BaseItem>
  );
};

// Item Factory - renders the appropriate component based on item type
const ItemRenderer = ({ item, isSelected, onDragEnd, onSelect, onDoubleClick }) => {
  switch (item.type) {
    case ITEM_TYPES.STICKY_NOTE:
      return (
        <StickyNote
          item={item}
          isSelected={isSelected}
          onDragEnd={onDragEnd}
          onSelect={onSelect}
          onDoubleClick={onDoubleClick}
        />
      );
    case ITEM_TYPES.TODO_LIST:
      return (
        <TodoList
          item={item}
          isSelected={isSelected}
          onDragEnd={onDragEnd}
          onSelect={onSelect}
          onDoubleClick={onDoubleClick}
        />
      );
    case ITEM_TYPES.GOAL_NOTE:
      return (
        <GoalNote
          item={item}
          isSelected={isSelected}
          onDragEnd={onDragEnd}
          onSelect={onSelect}
          onDoubleClick={onDoubleClick}
        />
      );
    default:
      return null;
  }
};

// Toolbar Component
const Toolbar = ({ onAddItem, selectedTool, onToolChange }) => {
  const tools = [
    { type: ITEM_TYPES.STICKY_NOTE, label: "Sticky Note", icon: "📝" },
    { type: ITEM_TYPES.TODO_LIST, label: "Todo List", icon: "☑️" },
    { type: ITEM_TYPES.GOAL_NOTE, label: "Goal Note", icon: "🎯" }
  ];

  return (
    <div style={{
      position: "absolute",
      top: 50,
      left: 10,
      background: "#fff",
      padding: "10px",
      borderRadius: 8,
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      zIndex: 20,
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    }}>
      <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
        Add Items
      </div>
      {tools.map(tool => (
        <button
          key={tool.type}
          onClick={() => onAddItem(tool.type)}
          style={{
            padding: "8px 12px",
            border: selectedTool === tool.type ? "2px solid #2196f3" : "1px solid #ddd",
            borderRadius: "4px",
            background: selectedTool === tool.type ? "#e3f2fd" : "white",
            cursor: "pointer",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>{tool.icon}</span>
          {tool.label}
        </button>
      ))}
    </div>
  );
};

const CanvasBoard = () => {
  // Sample data with different item types
  const [items, setItems] = useState([
    {
      id: 1,
      type: ITEM_TYPES.STICKY_NOTE,
      x: 50,
      y: 60,
      width: 150,
      height: 120,
      zIndex: 0,
      data: {
        text: "First Note",
        color: "#fff59d",
        fontSize: 16
      }
    },
    {
      id: 2,
      type: ITEM_TYPES.TODO_LIST,
      x: 250,
      y: 60,
      width: 200,
      height: 200,
      zIndex: 0,
      data: {
        title: "My Tasks",
        color: "#c8e6c9",
        items: [
          { id: "t1", text: "Complete project proposal", completed: false },
          { id: "t2", text: "Review code changes", completed: true },
          { id: "t3", text: "Schedule team meeting", completed: false },
          { id: "t4", text: "Update documentation", completed: false }
        ]
      }
    },
    {
      id: 3,
      type: ITEM_TYPES.GOAL_NOTE,
      x: 500,
      y: 60,
      width: 220,
      height: 180,
      zIndex: 0,
      data: {
        title: "Learn React Canvas",
        description: "Master building interactive canvas applications with React and Konva",
        targetDate: "2025-07-01",
        progress: 65,
        color: "#ffcdd2"
      }
    }
  ]);

  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [selectedTool, setSelectedTool] = useState(ITEM_TYPES.STICKY_NOTE);
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });

  const stageRef = useRef();
  const textareaRef = useRef();
  const isPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Helper function to create new items
  const createNewItem = (type, x = 100, y = 100) => {
    const baseItem = {
      id: Date.now(),
      type,
      x,
      y,
      zIndex: 0
    };

    switch (type) {
      case ITEM_TYPES.STICKY_NOTE:
        return {
          ...baseItem,
          width: 150,
          height: 120,
          data: {
            text: "New sticky note",
            color: "#fff59d",
            fontSize: 16
          }
        };
      case ITEM_TYPES.TODO_LIST:
        return {
          ...baseItem,
          width: 200,
          height: 200,
          data: {
            title: "New Todo List",
            color: "#c8e6c9",
            items: [
              { id: "new1", text: "Add your first task", completed: false }
            ]
          }
        };
      case ITEM_TYPES.GOAL_NOTE:
        return {
          ...baseItem,
          width: 220,
          height: 180,
          data: {
            title: "New Goal",
            description: "Describe your goal here",
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            progress: 0,
            color: "#ffcdd2"
          }
        };
      default:
        return baseItem;
    }
  };

  const handleAddItem = (type) => {
    const newItem = createNewItem(type, centerPos.x - 100, centerPos.y - 60);
    setItems(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const updateCenterPosition = () => {
    const stage = stageRef.current;
    if (!stage) return;
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
    
    setSelectedId(null);
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
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, x, y } : item))
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

  const handleDoubleClick = (item) => {
    if (item.type === ITEM_TYPES.STICKY_NOTE) {
      setEditingId(item.id);
      setEditingText(item.data.text);
    }
    // For other item types, you could open specific editors
  };

  const getTextareaStyle = () => {
    if (!editingId) return { display: "none" };
    const item = items.find((n) => n.id === editingId);
    if (!item) return { display: "none" };

    const scale = stageScale;
    const stagePosX = stagePos.x;
    const stagePosY = stagePos.y;

    return {
      position: "absolute",
      top: stagePosY + item.y * scale + 10 * scale,
      left: stagePosX + item.x * scale + 10 * scale,
      width: (item.width - 20) * scale,
      height: (item.height - 20) * scale,
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
    setItems((prev) =>
      prev.map((item) =>
        item.id === editingId 
          ? { ...item, data: { ...item.data, text: editingText } } 
          : item
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Delete" && selectedId) {
      setItems(prev => prev.filter(item => item.id !== selectedId));
      setSelectedId(null);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  return (
    <>
      {/* Info Panel */}
      <div style={{
        position: "absolute",
        top: 10,
        left: 10,
        background: "#fff",
        padding: "4px 8px",
        borderRadius: 4,
        zIndex: 20,
        fontSize: "12px"
      }}>
        Zoom: {stageScale.toFixed(2)} | Items: {items.length} | Selected: {selectedId || "None"}
      </div>

      {/* Toolbar */}
      <Toolbar 
        onAddItem={handleAddItem}
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
      />

      {/* Instructions */}
      <div style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        background: "#fff",
        padding: "8px",
        borderRadius: 4,
        zIndex: 20,
        fontSize: "12px",
        maxWidth: "300px"
      }}>
        <strong>Controls:</strong><br/>
        • Double-click sticky notes to edit<br/>
        • Use toolbar to add new items<br/>
        • Drag items to move them<br/>
        • Press Delete to remove selected item<br/>
        • Mouse wheel to zoom, drag to pan
      </div>

      {/* Editable textarea for sticky notes */}
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
          {items.map((item) => (
            <ItemRenderer
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              onDragEnd={handleDragEnd}
              onSelect={() => setSelectedId(item.id)}
              onDoubleClick={() => handleDoubleClick(item)}
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

export default CanvasBoard;