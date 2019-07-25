import React, { Component } from "react";
import './Events.css';

// For dynamically styling labels - OPEN/CLOSED of events
const styleOpen = {color: '#008000'};
const styleClosed = {color: '#ff3300'};

// Value of one gWei in wei
const oneGWei = 1000000000;

export class Events extends Component {
  constructor(props) {
    super(props);

    this.getEventsArray = this.getEventsArray.bind(this);
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
        isOpen: this.props.eventsList[key]['isOpen'],
        imageIpfsHash: this.props.eventsList[key]['imageIpfsHash']
      };
    });
  }

  render() {
    const events = this.getEventsArray().map((event) => {
      return (
        <div className="event" key={event.id}>
          <div className="upper" onClick={(e) => this.props.showEventInfo(event.id)}>
            <img className="eventImage" src={this.getIpfsUrl(event.imageIpfsHash)} alt="event" />
            <div className="eventId">Event Id: {event.id}</div>
            <div className="isEventOpen" style={this.getEventStatusStyle(event.isOpen)}>{event.isOpen ? "OPEN" : "CLOSED"}</div>
          </div>
          <div className="lower">
            <div className="eventTitle">{event.title}</div>
            <div className="ticketPrice">Price: {isNaN(event.ticketPrice) ? "-" : event.ticketPrice/oneGWei + " gWei"}</div>
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
