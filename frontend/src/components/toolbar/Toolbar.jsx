import React from 'react';
import { ITEM_TYPES } from '../../constants/itemTypes';

const Toolbar = ({ onAddItem, selectedTool, setSelectedTool }) => {
    const tools = [
        {
            id: 'select',
            name: 'Select',
            icon: '👆',
            description: 'Select and move items'
        },
        {
            id: ITEM_TYPES.STICKY_NOTE,
            name: 'Sticky Note',
            icon: '📝',
            description: 'Add a sticky note'
        },
        {
            id: ITEM_TYPES.TODO_LIST,
            name: 'Todo List',
            icon: '☑️',
            description: 'Add a todo list'
        },
        {
            id: ITEM_TYPES.TEXT_BOX,
            name: 'Text Box',
            icon: '📄',
            description: 'Add a text box'
        },
        {
            id: ITEM_TYPES.SHAPE,
            name: 'Shape',
            icon: '🔷',
            description: 'Add a shape'
        }
    ];

    const handleToolClick = (toolId) => {
        if (toolId === 'select') {
            setSelectedTool('select');
        } else {
            setSelectedTool(toolId);
        }
    };

    const handleAddClick = (toolId) => {
        if (toolId !== 'select' && onAddItem) {
            onAddItem(toolId);
        }
    };

    return (
        <div className="toolbar">
            <div className="toolbar-header">
                <h3>Tools</h3>
            </div>
            
            <div className="toolbar-section">
                <h4>Selection</h4>
                <div className="tool-grid">
                    {tools.filter(tool => tool.id === 'select').map(tool => (
                        <button
                            key={tool.id}
                            className={`tool-button ${selectedTool === tool.id ? 'active' : ''}`}
                            onClick={() => handleToolClick(tool.id)}
                            title={tool.description}
                        >
                            <span className="tool-icon">{tool.icon}</span>
                            <span className="tool-name">{tool.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="toolbar-section">
                <h4>Add Items</h4>
                <div className="tool-grid">
                    {tools.filter(tool => tool.id !== 'select').map(tool => (
                        <button
                            key={tool.id}
                            className={`tool-button ${selectedTool === tool.id ? 'active' : ''}`}
                            onClick={() => {
                                handleToolClick(tool.id);
                                handleAddClick(tool.id);
                            }}
                            title={tool.description}
                        >
                            <span className="tool-icon">{tool.icon}</span>
                            <span className="tool-name">{tool.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="toolbar-section">
                <h4>Actions</h4>
                <div className="action-buttons">
                    <button className="action-button delete" title="Delete selected item">
                        🗑️ Delete
                    </button>
                    <button className="action-button duplicate" title="Duplicate selected item">
                        📋 Copy
                    </button>
                    <button className="action-button clear" title="Clear canvas">
                        🧹 Clear All
                    </button>
                </div>
            </div>

            <style jsx>{`
                .toolbar {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    width: 200px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 1000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }

                .toolbar-header {
                    padding: 16px;
                    border-bottom: 1px solid #e0e0e0;
                    background: #f8f9fa;
                    border-radius: 8px 8px 0 0;
                }

                .toolbar-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                }

                .toolbar-section {
                    padding: 16px;
                    border-bottom: 1px solid #f0f0f0;
                }

                .toolbar-section:last-child {
                    border-bottom: none;
                }

                .toolbar-section h4 {
                    margin: 0 0 12px 0;
                    font-size: 12px;
                    font-weight: 600;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .tool-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 8px;
                }

                .tool-button {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    background: #f8f9fa;
                    border: 1px solid #e0e0e0;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 14px;
                }

                .tool-button:hover {
                    background: #e9ecef;
                    border-color: #ced4da;
                }

                .tool-button.active {
                    background: #007bff;
                    border-color: #0056b3;
                    color: white;
                }

                .tool-icon {
                    font-size: 16px;
                    min-width: 20px;
                    text-align: center;
                }

                .tool-name {
                    font-weight: 500;
                }

                .action-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .action-button {
                    padding: 8px 12px;
                    border: 1px solid #e0e0e0;
                    border-radius: 6px;
                    background: white;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }

                .action-button:hover {
                    background: #f8f9fa;
                }

                .action-button.delete:hover {
                    background: #ffebee;
                    border-color: #ef5350;
                    color: #c62828;
                }

                .action-button.duplicate:hover {
                    background: #e3f2fd;
                    border-color: #42a5f5;
                    color: #1565c0;
                }

                .action-button.clear:hover {
                    background: #fff3e0;
                    border-color: #ff9800;
                    color: #ef6c00;
                }
            `}</style>
        </div>
    );
};

export default Toolbar;