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
        case ITEM_TYPES.CALENDAR:
        return {
            ...baseItem,
            data: {
                title: "Calendar",
                targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                progress: 0,
                color: ITEM_COLORS.CALENDAR
            }
        };
        case ITEM_TYPES.LINK:
        return {
            ...baseItem,
            data: {
                title: "Example Link",
                text: "example.com",
                fontSize: 16,
                color: ITEM_COLORS.LINK
            }
        };
        default:
            return baseItem;
    }
};