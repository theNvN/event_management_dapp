import React, { Component } from "react";
import './EventInfo.css';

const styleOpen = {color: '#008000'};
const styleClosed = {color: '#ff3300'};

export class EventInfo extends Component {
  constructor(props) {
    super(props);

    // console.log("props to eventInfo:", props);
    this.getEventStatusStyle = this.getEventStatusStyle.bind(this);
  }

  getEventStatusStyle(isOpen) {
    if (isOpen) {
      return styleOpen;
    }

    return styleClosed;
  }

  render() {
    return (
      <div className="eventInfoContainer">
        <div id="goBackToEvents" onClick={this.props.goBackToEvents}>&lt;Go Back</div>
        <div id="infoEventTitle">{this.props.event.title}</div>
        <div id="infoEventIsOpen">
          Status: <div style={this.getEventStatusStyle(this.props.event.isOpen)}> {this.props.event.isOpen ? "OPEN" : "CLOSED"}</div>
      </div>
        <div id="infoEventDescription"><div>Description</div> <br /> {this.props.event.description} </div>
        <div id="infoTicketInfo">
          <div id="infoTicketInfoLabel">Get Tickets Here</div>
          <div id="infoTicketPrice">Ticket Price: {this.props.event.ticketPrice} </div>
          <div id="infoTicketsAvailable">Tickets Left: {this.props.event.ticketsAvailable} </div>
          <form id="infoFormBuyTickets">
            <div>Enter ticket count: </div>
            <input id="infoNoOfTicketsToBuy" type="number" min={1} max={this.props.event.ticketsAvailable}
              value={this.props.inputNoOfTickets} onChange={this.props.handleNoOfTicketsChange}/>
            <input type="submit" value="Buy" onClick={this.props.buyTickets} disabled={!this.props.event.isOpen}/>
          </form>
        </div>
        {this.props.isLoginAddressOwner ?
        <button id="endSaleBtn" onClick={this.props.endSale} value={this.props.selectedEventId} disabled={!this.props.event.isOpen}>
          CLOSE EVENT & WITHDRAW AMOUNT
        </button>
        :
        ""
      }
      </div>
    );
  }
}
