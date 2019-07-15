import React, { Component } from "react";
import './EventForm.css';

export class EventForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="eventFormContainer">
        <div id="goBackToEvents" onClick={this.props.goBackToEvents}>&lt;Go Back</div>
        <div id="eventFormLabel">Add an Event</div>
        <form id="addEventForm">
          <label>
            Event Title:<br />
            <input id="formEventTitle" type="text" value={this.props.inputEventTitle} onChange={this.props.handleEventTitleChange} />
          </label>
          <label>
            Number of Tickets:<br />
            <input id="formEventTicketsCount" type="number" value={this.props.inputEventTicketsCount} onChange={this.props.handleEventTicketsCountChange} />
          </label>
          <label>
            Ticket Price:<br />
            <input id="formEventTicketPrice" type="number" value={this.props.inputEventTicketPrice} onChange={this.props.handleEventTicketPriceChange} />
          </label>
          <label>
            Description:<br />
            <textarea id="formEventDescription" rows="10" cols="80" value={this.props.inputEventDescription} onChange={this.props.handleEventDescriptionChange} />
          </label>
          <input type="submit" onClick={this.props.addEvent} />
        </form>
      </div>
    );
  }
}
