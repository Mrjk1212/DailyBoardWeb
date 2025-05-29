export const ITEM_TYPES = {
    STICKY_NOTE: 'sticky_note',
    TODO_LIST: 'todo_list',
    GOAL_NOTE: 'goal_note',
    DRAWING_PATH: 'drawing_path',
    SHAPE: 'shape'
};

export const DEFAULT_DIMENSIONS = {
    [ITEM_TYPES.STICKY_NOTE]: { width: 150, height: 120 },
    [ITEM_TYPES.TODO_LIST]: { width: 200, height: 200 },
    [ITEM_TYPES.GOAL_NOTE]: { width: 220, height: 180 }
};