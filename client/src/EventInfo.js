import React, { Component } from "react";
import './EventInfo.css';

// For dynamically styling labels - OPEN/CLOSED of events
const styleOpen = {color: '#008000'};
const styleClosed = {color: '#ff3300'};

// Value of one gWei in wei
const oneGWei = 1000000000;

export class EventInfo extends Component {
  constructor(props) {
    super(props);

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

  render() {
    return (
      <div className="eventInfoContainer">
        <div id="goBackToEvents" onClick={this.props.goBackToEvents}>&lt;Go Back</div>
        <div id="infoEventTitle">{this.props.event.title}</div>
        <div id="infoEventIsOpen">
          Status: <div style={this.getEventStatusStyle(this.props.event.isOpen)}> {this.props.event.isOpen ? "OPEN" : "CLOSED"}</div>
        </div>
        <img id="infoEventImage" src={this.getIpfsUrl(this.props.event.imageIpfsHash)} alt="event" />
        <div id="infoEventDescription"><div>Description</div> <br /> {this.props.event.description} </div>
        <div id="infoTicketInfo">
          <div id="infoTicketInfoLabel">Get Tickets Here</div>
          <div id="infoTicketPrice">Ticket Price: {isNaN(this.props.event.ticketPrice) ? "-" : this.props.event.ticketPrice/oneGWei + " gWei"} </div>
          <div id="infoTicketsAvailable">Tickets Left: {this.props.event.ticketsAvailable} </div>
          <form id="infoFormBuyTickets">
            <div>Enter ticket count: </div>
            <input id="infoNoOfTicketsToBuy" type="number" min={1} max={this.props.event.ticketsAvailable}
              value={this.props.inputNoOfTickets} onChange={this.props.handleNoOfTicketsChange} disabled={!this.props.event.isOpen || this.props.isStopped}/>
            <input type="submit" value="Buy" onClick={this.props.buyTickets} disabled={!this.props.event.isOpen || this.props.isStopped}/>
          </form>
        </div>
        {this.props.isLoginAddressOwner ?
        <button id="endSaleBtn" onClick={this.props.endSale} value={this.props.selectedEventId} disabled={!this.props.event.isOpen}>
          {this.props.event.isOpen ? "CLOSE EVENT & WITHDRAW AMOUNT" : "EVENT CLOSED"}
        </button>
        :
        ""}
      </div>
    );
  }
}
