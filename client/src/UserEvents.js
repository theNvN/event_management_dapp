import React, { Component } from "react";
import './UserEvents.css';

export class UserEvents extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const participatedEvents = this.props.participatedEvents.map((event) => {
      return (
        <div className="userEvent" key={event.id}>
          <div className="upper">
            <div className="userEventId">Event Id: {event.id}</div>
            <div className="isUserEventOpen">{event.isOpen ? "OPEN" : "CLOSED"}</div>
          </div>
          <div className="lower">
            <div className="userEventTitle">{event.title}</div>
            <div className="tickerPurchaseCount">No. of tickets purchased:&nbsp; {event.ticketPurchaseCount}</div>
          </div>
        </div>
      );
    });

    return (
      <div className="userEventsContainer">
        <div id="goBackToEvents" onClick={this.props.goBackToEvents}>&lt;Go Back</div>
        <div id="participatedEventsLabel">Participated Events</div>
        <div id="participatedEventsList">
          {participatedEvents}
        </div>
      </div>
    );
  }
}
