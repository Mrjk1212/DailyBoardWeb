import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ical from 'ical.js';

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

            setEvents(parsedEvents);
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
            }}
        >
            {/* ICS file input */}
            <input
                type="file"
                accept=".ics"
                onChange={handleFileChange}
                style={{ margin: 8, width: 'calc(100% - 16px)' }}
            />

            {/* The actual calendar */}
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                height="90%" // leave space for file input
                events={item.data?.events || []}
            />
        </div>
    );
};

export default CalendarEditor;
