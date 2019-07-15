import React, { Component } from "react";
import EventManagementContract from "./contracts/EventManagement.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

import { Events } from './Events.js';
import { EventInfo } from './EventInfo.js';
import { EventForm } from './EventForm.js';

const VIEW_MODE_EVENTS_LIST = 'events_list';
const VIEW_MODE_EVENT_INFO = 'event_info';
const VIEW_MODE_EVENT_FORM = 'event_form';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null,

      loginAddress: "0xl0g1n4ddr33ssth151swh4t5h0uld1d0",
      inputNoOfTickets: "",
      inputEventTitle: "",
      inputEventTicketsCount: "",
      inputEventTicketPrice: "",
      inputEventDescription: "",

      viewMode: VIEW_MODE_EVENTS_LIST,
      selectedEventId: 0,
      events: [{
        'id': 21,
        'title': 'Evnet E',
        'description': 'This is a fake event for testing. Do not disappoint yourself. Thank You!',
        'ticketsAvailable': 25,
        'sales': 10,
        'ticketPrice': 500,
        'isOpen': true
      }]
    };

    this.handleNoOfTicketsChange = this.handleNoOfTicketsChange.bind(this);
    this.buyTickets = this.buyTickets.bind(this);
    this.goBackToEvents = this.goBackToEvents.bind(this);
    this.showEventInfo = this.showEventInfo.bind(this);
    this.showAddEventForm = this.showAddEventForm.bind(this);
    this.handleEventTitleChange = this.handleEventTitleChange.bind(this);
    this.handleEventTicketsCountChange = this.handleEventTicketsCountChange.bind(this);
    this.handleEventTicketPriceChange = this.handleEventTicketPriceChange.bind(this);
    this.handleEventDescriptionChange = this.handleEventDescriptionChange.bind(this);
    this.addEvent = this.addEvent.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EventManagementContract.networks[networkId];
      const instance = new web3.eth.Contract(
        EventManagementContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleNoOfTicketsChange(event) {
    console.log("handleNoOfTicketsChange value: ", event.target.value);
    this.setState({
      inputNoOfTickets: event.target.value
    });
  }

  buyTickets(event) {
    //TODO Sort out invalid no of tickets
    event.preventDefault();
    console.log("buyTickets noOfTickets: ", this.state.inputNoOfTickets);
    this.setState({
      inputNoOfTickets: ""
    });
  }

  goBackToEvents() {
    this.setState({
      viewMode: VIEW_MODE_EVENTS_LIST,
      inputNoOfTickets: "",
      inputEventTitle: "",
      inputEventTicketsCount: "",
      inputEventTicketPrice: "",
      inputEventDescription: ""
    });
  }

  showEventInfo(event) {
    console.log("showEventInfo id: ", event.target.id);
    this.setState({
      selectedEventId: event.target.id,
      viewMode: VIEW_MODE_EVENT_INFO
    });
  }

  showAddEventForm(event) {
    console.log("showAddEventForm");
    this.setState({
      viewMode: VIEW_MODE_EVENT_FORM
    });
  }

  handleEventTitleChange(event) {
    console.log("handleEventTitleChange value: ", event.target.value);
    this.setState({
      inputEventTitle: event.target.value
    });
  }

  handleEventTicketsCountChange(event) {
    console.log("handleEventTicketsCountChange value: ", event.target.value);
    this.setState({
      inputEventTicketsCount: event.target.value
    });
  }

  handleEventTicketPriceChange(event) {
    console.log("handleEventTicketPriceChange value: ", event.target.value);
    this.setState({
      inputEventTicketPrice: event.target.value
    });
  }

  handleEventDescriptionChange(event) {
    console.log("handleEventDescriptionChange value: ", event.target.value);
    this.setState({
      inputEventDescription: event.target.description
    });
  }

  addEvent(event) {
    event.preventDefault();
    console.log("addEvent");
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    let renderComponent;
    if (this.state.viewMode == VIEW_MODE_EVENTS_LIST) {
      renderComponent = (
        <Events
          eventsList={this.state.events}
          showEventInfo={this.showEventInfo}
          showAddEventForm={this.showAddEventForm}/>
      );
    } else if (this.state.viewMode == VIEW_MODE_EVENT_INFO) {
      renderComponent = (
        <EventInfo
          event={this.state.events[0]}
          handleNoOfTicketsChange={this.handleNoOfTicketsChange}
          buyTickets={this.buyTickets}
          goBackToEvents={this.goBackToEvents}/>
      );
    } else {
      renderComponent = (
        <EventForm
          inputEventTitle={this.state.inputEventTitle}
          inputEventTicketsCount={this.state.inputEventTicketsCount}
          inputEventTicketPrice={this.state.inputEventTicketPrice}
          inputEventDescription={this.state.inputEventDescription}
          handleEventTitleChange={this.handleEventTitleChange}
          handleEventTicketsCountChange={this.handleEventTicketsCountChange}
          handleEventTicketPriceChange={this.handleEventTicketPriceChange}
          handleEventDescriptionChange={this.handleEventDescriptionChange}
          addEvent={this.addEvent}
          goBackToEvents={this.goBackToEvents}/>
      );
    }

    return (
      <div className="wrapper">
        <div id="appTitle">Event Management</div>
        <div className="container">
          <div id="userLoginAddress">
            {this.state.loginAddress}
          </div>
          {renderComponent}
        </div>
      </div>
    );
  }
}

export default App;
