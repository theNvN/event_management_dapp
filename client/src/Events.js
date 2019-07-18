import React, { Component } from "react";
import './Events.css';

export class Events extends Component {
  constructor(props) {
    super(props);

    this.getEventsArray = this.getEventsArray.bind(this);
  }

  getEventsArray() {
    if (this.props.eventsList == undefined) {
      return [];
    }

    return Object.keys(this.props.eventsList).map((key) => {
      return {
        id: key,
        title: this.props.eventsList[key]['title'],
        ticketPrice: this.props.eventsList[key]['ticketPrice'],
        ticketsAvailable: this.props.eventsList[key]['ticketsAvailable'],
        isOpen: this.props.eventsList[key]['isOpen']
      };
    });
  }

  render() {
    const events = this.getEventsArray().map((event) => {
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
          <button id="showUserEventsBtn" onClick={this.props.showUserEvents}>Your Events</button>
          <button id="showAddEventFormBtn" onClick={this.props.showAddEventForm} disabled={!this.props.isLoginAddressOwner}>Add Event></button>
        </div>
        <div className="eventsList">
          {events}
        </div>
      </div>
    );
  }
}
