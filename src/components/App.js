import React, { useState } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Popup from 'react-popup';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.css';

const localizer = momentLocalizer(moment);

function App() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openCreatePopup = (slotInfo) => {
    Popup.create({
      title: 'Create Event',
      content: (
        <div>
          <input placeholder="Event Title" id="event-title" /><br />
          <input placeholder="Event Location" id="event-location" />
        </div>
      ),
      buttons: {
        right: [
          {
            text: 'Save',
            className: 'mm-popup__btn',
            action: function () {
              const title = document.getElementById('event-title').value;
              const location = document.getElementById('event-location').value;
              if (title && location) {
                setEvents([
                  ...events,
                  {
                    title: `${title} @ ${location}`,
                    start: slotInfo.start,
                    end: slotInfo.end,
                    id: new Date().getTime(),
                  },
                ]);
              }
              Popup.close();
            },
          },
        ],
      },
    });
  };

  const openEditPopup = (event) => {
    setSelectedEvent(event);
    const [title, location] = event.title.split(' @ ');

    Popup.create({
      title: 'Edit Event',
      content: (
        <div>
          <input placeholder="Event Title" id="event-title" defaultValue={title} /><br />
          <input placeholder="Event Location" id="event-location" defaultValue={location} />
        </div>
      ),
      buttons: {
        left: [
          {
            text: 'Delete',
            className: 'mm-popup__btn mm-popup__btn--danger',
            action: function () {
              setEvents(events.filter((e) => e.id !== event.id));
              Popup.close();
            },
          },
        ],
        right: [
          {
            text: 'Save',
            className: 'mm-popup__btn mm-popup__btn--info',
            action: function () {
              const newTitle = document.getElementById('event-title').value;
              const newLocation = document.getElementById('event-location').value;
              setEvents(events.map((e) =>
                e.id === event.id
                  ? { ...e, title: `${newTitle} @ ${newLocation}` }
                  : e
              ));
              Popup.close();
            },
          },
        ],
      },
    });
  };

  const filteredEvents = events.filter((e) => {
    const now = new Date();
    if (filter === 'past') return moment(e.start).isBefore(now, 'day');
    if (filter === 'upcoming') return moment(e.start).isSameOrAfter(now, 'day');
    return true;
  });

  return (
    <div className="App">
      <h2>Event Tracker Calendar</h2>
      <div className="filters">
        <button className="btn" onClick={() => setFilter('all')}>All</button>
        <button className="btn" onClick={() => setFilter('past')}>Past</button>
        <button className="btn" onClick={() => setFilter('upcoming')}>Upcoming</button>
      </div>
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        selectable
        style={{ height: 600 }}
        onSelectSlot={openCreatePopup}
        onSelectEvent={openEditPopup}
        eventPropGetter={(event) => {
          const isPast = moment(event.start).isBefore(new Date(), 'day');
          return {
            style: {
              backgroundColor: isPast ? 'rgb(222, 105, 135)' : 'rgb(140, 189, 76)',
              color: 'white',
            },
          };
        }}
      />
      <Popup />
    </div>
  );
}

export default App;
