import React, { Component } from "react";
import './EventForm.css';

// Value of one gWei in wei
const oneGWei = 1000000000;

export class EventForm extends Component {
  constructor(props) {
    super(props);

    this.getIpfsUrl = this.getIpfsUrl.bind(this);
  }

  // get Ipfs url string given ipfs hash
  getIpfsUrl() {
    return ("https://ipfs.io/ipfs/" + this.props.ipfsHash);
  }

  render() {
    return (
      <div className="eventFormContainer">
        <div id="goBackToEvents" onClick={this.props.goBackToEvents}>&lt;Go Back</div>
        <div id="eventFormLabel">Add an Event</div>
        <form id="addEventForm">
          <label>
            Event Title:<br />
            <input id="formEventTitle" type="text" value={this.props.inputEventTitle} onChange={this.props.handleEventTitleChange}
              disabled={this.props.isStopped}/>
          </label>

          <label>
            Number of Tickets:<br />
            <input id="formEventTicketsCount" type="number" value={this.props.inputEventTicketsCount} onChange={this.props.handleEventTicketsCountChange}
              disabled={this.props.isStopped}/>
          </label>

          <label>
            Ticket Price:<br />
          <input id="formEventTicketPrice" type="number" value={this.props.inputEventTicketPrice} onChange={this.props.handleEventTicketPriceChange}
            disabled={this.props.isStopped}/>
          &nbsp;gWei
          </label>

          <label>
            Upload Event Image:<br />
          <input id="formEventImage" type="file" onChange={this.props.captureFile} disabled={this.props.isStopped}/>
          </label>

          <label>
            Description:<br />
            <textarea id="formEventDescription" rows="10" cols="80" value={this.props.inputEventDescription} onChange={this.props.handleEventDescriptionChange}
              disabled={this.props.isStopped}/>
          </label>

          {this.props.isWorking ? <p>Uploading image to Ipfs. Please Wait...</p> : ""}

          <input id="formEventSubmitBtn" type="submit" onClick={this.props.addEvent} disabled={this.props.isWorking || this.props.isStopped} />
        </form>
      </div>
    );
  }
}
