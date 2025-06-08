export const ITEM_TYPES = {
    STICKY_NOTE: 'sticky_note',
    TODO_LIST: 'todo_list',
    GOAL_NOTE: 'goal_note',
    FREE_DRAW: 'free_draw',
    CALENDAR: 'calendar',
    LINK: 'link',
    IMAGE: 'image'
};

export const DEFAULT_DIMENSIONS = {
    [ITEM_TYPES.STICKY_NOTE]: { width: 150, height: 120 },
    [ITEM_TYPES.TODO_LIST]: { width: 250, height: 300 },
    [ITEM_TYPES.GOAL_NOTE]: { width: 220, height: 180 },
    [ITEM_TYPES.CALENDAR]: {width: 500, height: 500}
};