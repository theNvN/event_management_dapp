import React, { Component } from "react";
import './Events.css';

export class Events extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const events = this.props.eventsList.map((event) => {
      return (
        <div className="event" key={event.id}>
          <div id={event.id} className="upper" onClick={this.props.showEventInfo}>
            <div className="eventId">Event Id: {event.id}</div>
            <div className="isEventOpen">{event.isOpen ? "OPEN" : "CLOSED"}</div>
          </div>
          <div className="lower">
            <div className="eventTitle">{event.title}</div>
            <div className="ticketPrice">Price: {event.ticketPrice}</div>
            <div className="ticketsAvailable">Tickets Left: {event.ticketsAvailable}</div>
          </div>
        </div>
      );
    });

    return (
      <div className="eventsWrapper">
        <div id="eventsListHeader">
          <div id="eventsListLabel">EVENTS</div>
          <button id="showAddEventFormBtn" onClick={this.props.showAddEventForm}>Add Your Event></button>
        </div>
        <div className="eventsList">
          {events}
        </div>
      </div>
    );
  }
}
