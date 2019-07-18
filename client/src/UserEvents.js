import React, { Component } from "react";
import './UserEvents.css';

export class UserEvents extends React.Component {
  constructor(props) {
    super(props);

    this.getParticipatedEventsArray = this.getParticipatedEventsArray.bind(this);
  }

  getParticipatedEventsArray() {
    return Object.keys(this.props.participatedEvents).map((key) => {
      return {
        id: key,
        title: this.props.participatedEvents[key]['title'],
        description: this.props.participatedEvents[key]['description'],
        isOpen: this.props.participatedEvents[key]['isOpen'],
        ticketPurchaseCount: this.props.participatedEvents[key]['ticketPurchaseCount']
      };
    });
  }

  render() {
    const participatedEvents = this.getParticipatedEventsArray().map((event) => {
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
