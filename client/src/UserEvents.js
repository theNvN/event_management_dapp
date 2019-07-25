import React, { Component } from "react";
import './UserEvents.css';

// For dynamically styling labels - OPEN/CLOSED of events
const styleOpen = {color: '#008000'};
const styleClosed = {color: '#ff3300'};

export class UserEvents extends React.Component {
  constructor(props) {
    super(props);

    this.getParticipatedEventsArray = this.getParticipatedEventsArray.bind(this);
    this.getEventStatusStyle = this.getEventStatusStyle.bind(this);
    this.getIpfsUrl = this.getIpfsUrl.bind(this);
  }

  getEventStatusStyle(isOpen) {
    if (isOpen) {
      return styleOpen;
    }

    return styleClosed;
  }

  // get Ipfs url string given ipfs hash
  getIpfsUrl(ipfsHash) {
    return ("https://ipfs.io/ipfs/" + ipfsHash);
  }

  // Convert Events Object to array type and return
  getParticipatedEventsArray() {
    return Object.keys(this.props.participatedEvents).map((key) => {
      return {
        id: key,
        title: this.props.participatedEvents[key]['title'],
        description: this.props.participatedEvents[key]['description'],
        isOpen: this.props.participatedEvents[key]['isOpen'],
        ticketPurchaseCount: this.props.participatedEvents[key]['ticketPurchaseCount'],
        imageIpfsHash: this.props.participatedEvents[key]['imageIpfsHash']
      };
    });
  }

  render() {
    const participatedEvents = this.getParticipatedEventsArray().map((event) => {
      return (
        <div className="userEvent" key={event.id}>
          <div className="upper">
            <img className="userEventImage" src={this.getIpfsUrl(event.imageIpfsHash)} alt="event" />
            <div className="userEventId">Event Id: {event.id}</div>
            <div className="isUserEventOpen" style={this.getEventStatusStyle(event.isOpen)}>{event.isOpen ? "OPEN" : "CLOSED"}</div>
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
