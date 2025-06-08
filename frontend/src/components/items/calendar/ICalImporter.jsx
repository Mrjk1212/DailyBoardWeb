import React, { useState } from 'react';
import Calendar from './Calendar';         // your Konva component
import CalendarEditor from './CalendarEditor'; // your DOM calendar with FullCalendar & ICS import

const ICalImporter = ({ item, stageScale, stagePos, onDragEnd, onResize, onSelect, onDoubleClick, isSelected, isDraggable }) => {
    const [events, setEvents] = useState(item.data?.events || []);

    // Update item.data.events when events change
    const calendarItem = {
        ...item,
        data: {
            ...item.data,
            events,
        }
    };

    return (
        <>
            {/* Canvas visual calendar box */}
            <Calendar
                item={calendarItem}
                isSelected={isSelected}
                onDragEnd={onDragEnd}
                onResize={onResize}
                onSelect={onSelect}
                onDoubleClick={onDoubleClick}
                isDraggable={isDraggable}
            />

            {/* The actual FullCalendar and ICS file input, positioned absolutely */}
            <CalendarEditor
                item={calendarItem}
                stageScale={stageScale}
                stagePos={stagePos}
                setEvents={setEvents}  // pass down setter to update events from ICS import
            />
        </>
    );
};

export default ICalImporter;
