import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ical from 'ical.js';
import { updateItem } from '../../api/useApi';

const CalendarEditor = ({ item, stageScale, stagePos, setEvents }) => {
    if (!item) return null;

    const left = item.x * stageScale + stagePos.x;
    const top = item.y * stageScale + stagePos.y;
    const width = item.width * stageScale;
    const height = item.height * stageScale;

    // ICS file import handler
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const jcalData = ical.parse(text);
            const vcalendar = new ical.Component(jcalData);
            const vevents = vcalendar.getAllSubcomponents('vevent');

            const parsedEvents = vevents.map((vevent) => {
                const event = new ical.Event(vevent);
                return {
                    id: event.uid,
                    title: event.summary,
                    start: event.startDate.toJSDate(),
                    end: event.endDate.toJSDate(),
                    allDay: event.startDate.isDate,
                };
            });

            // Save to UI state
            setEvents(parsedEvents);

            // Persist to backend
            const updatedItem = {
                ...item,
                data: JSON.stringify({
                    ...item.data,
                    events: parsedEvents,
                }),
            };

            await updateItem(updatedItem);
        } catch (error) {
            console.error('Failed to parse ICS file:', error);
        }
    };

    return (
        <div
            style={{
                position: 'absolute',
                top,
                left,
                width,
                height,
                background: 'white',
                zIndex: 10,
                border: '1px solid #ccc',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                pointerEvents: 'auto',
                padding: 0,
                margin: 0,
            }}
        >
            {/* ICS file input */}
            <input
                type="file"
                accept=".ics"
                onChange={handleFileChange}
                style={{ margin: 8}}
            />

            {/* The actual calendar */}
            <div
    style={{
        transform: `scale(${stageScale})`,
        transformOrigin: 'top left',
        width: `${100 / stageScale}%`,  // counteract shrink
        height: `${100 / stageScale}%`, // maintain layout
        overflow: 'hidden',
    }}
>
    <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={item.data?.events || []}
        height="100%"        // ✅ allowed
        expandRows={true}
        dayMaxEventRows={true}
        dayMaxEvents={true}
    />
</div>
        </div>
    );
};

export default CalendarEditor;
