import React, { Component } from "react";
import EventManagementContract from "./contracts/EventManagement.json";
import getWeb3 from "./utils/getWeb3";
import getDataFromBuffer from "./utils/getDataFromBuffer";
import ipfs from "./utils/ipfs";

import "./App.css";

import { Events } from './Events.js';
import { EventInfo } from './EventInfo.js';
import { EventForm } from './EventForm.js';
import { UserEvents } from './UserEvents.js';

const VIEW_MODE_EVENTS_LIST = 'events_list';
const VIEW_MODE_EVENT_INFO = 'event_info';
const VIEW_MODE_EVENT_FORM = 'event_form';
const VIEW_MODE_EVENT_USER = 'event_user';

const FIELD_ID = 0;
const FIELD_TITLE = 1;
const FIELD_DESCRIPTION = 2;
const FIELD_TICKETS_AVAILABLE = 3;
const FIELD_TICKET_PRICE = 4;
const FIELD_IS_OPEN = 5;
const FIELD_IMAGE_IPFS_HASH = 6;

const FIELD_USER_EVENT_ID = 0;
const FIELD_USER_EVENT_TICKET_COUNT = 1;

const oneGWei = 1000000000;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null,

      loginAddress: "0x0000000000000000000000000000000000000000",
      owner: "0x0000000000000000000000000000000000000000",
      loginAddressBalance: 0,
      gasPrice: 0,
      inputNoOfTickets: "",
      inputEventTitle: "",
      inputEventTicketsCount: "",
      inputEventTicketPrice: "",
      inputEventDescription: "",

      viewMode: VIEW_MODE_EVENTS_LIST,
      selectedEventId: 0,

      events: {},
      participatedEvents: {},
      currentFileBuffer: null,
      isWorking: false
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
    this.showUserEvents = this.showUserEvents.bind(this);
    this.endSale = this.endSale.bind(this);
    this.captureFile = this.captureFile.bind(this);
  }

  componentDidMount = async () => {
    console.log("componentDidMount called.");
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

      console.log("contract address: ", instance);

      const owner = await instance.methods.owner().call();
      console.log("accounts, owner", accounts + ", " + owner);

      // Get balance of logged in account
      web3.eth.getBalance(accounts[0])
      .then((balance) => {
        this.setState({
          loginAddressBalance: balance
        });
      });

      web3.eth.getGasPrice()
      .then((result) => {
        let gasPrice = Number(result);
        this.setState({
          gasPrice
        });
      });

      const eventsData = await instance.methods.getEventsData().call();

      const eventIds = eventsData[FIELD_ID];
      const titlesBuffer = eventsData[FIELD_TITLE];
      const titles = getDataFromBuffer(titlesBuffer);
      const descriptionsBuffer = eventsData[FIELD_DESCRIPTION];
      const descriptions = getDataFromBuffer(descriptionsBuffer);
      const ticketsAvailabilities = eventsData[FIELD_TICKETS_AVAILABLE];
      const ticketsPrices = eventsData[FIELD_TICKET_PRICE];
      const areOpen = eventsData[FIELD_IS_OPEN];

      let events = {};
      for (let i = 0; i < eventIds.length; i++) {
        const ipfsHash = await instance.methods.getEventImageIpfsHash(i).call();

        events[eventIds[i]] = {
          title: titles[i],
          description: descriptions[i],
          ticketsAvailable: (areOpen[i] ? ticketsAvailabilities[i] : 0),
          ticketPrice: (areOpen[i] ? ticketsPrices[i] : "-"),
          isOpen: areOpen[i],
          imageIpfsHash: ipfsHash
        };
      }

      const buyerTicketsData = await instance.methods.getBuyerPurchases().call({from: accounts[0]});
      const userEventIds = buyerTicketsData[FIELD_USER_EVENT_ID];
      const userEventTicketCounts = buyerTicketsData[FIELD_USER_EVENT_TICKET_COUNT];

      let userEvents = {};
      for (let i = 0; i < userEventIds.length; i++) {
        const event = events[userEventIds[i]];
        userEvents[userEventIds[i]] = {
          title: event.title,
          description: event.description,
          isOpen: event.isOpen,
          ticketPurchaseCount: userEventTicketCounts[i],
          imageIpfsHash: event.imageIpfsHash
        };
      }

      // Set state
      this.setState({
       web3,
       accounts,
       contract: instance,
       owner,
       loginAddress: accounts[0],
       events,
       participatedEvents: userEvents
      });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleNoOfTicketsChange(event) {
    this.setState({
      inputNoOfTickets: event.target.value
    });
  }

  buyTickets = async(event) => {
    event.preventDefault();
    if (this.state.inputNoOfTickets == 0) {
      return;
    }

    let estimatedValue =  2*this.state.gasPrice +
      this.state.events[this.state.selectedEventId].ticketPrice*this.state.inputNoOfTickets;

    this.state.contract.methods.buyTickets(this.state.selectedEventId, this.state.inputNoOfTickets)
    .send({from: this.state.accounts[0], value: estimatedValue})
    .on('receipt', (receipt) => {
      const eventId = receipt.events.LogBuyTickets.returnValues['id'];
      const numTickets = receipt.events.LogBuyTickets.returnValues['numTickets'];

      let newEventsList = Object.assign({}, this.state.events);
      newEventsList[eventId].ticketsAvailable -= numTickets;

      let initialPurchaseCount = 0;
      if (this.state.participatedEvents[eventId] != undefined) {
        initialPurchaseCount = this.state.participatedEvents[eventId].ticketPurchaseCount;
      }

      let newUserEventsList = Object.assign({}, this.state.participatedEvents);
      newUserEventsList[eventId] = {
        title: this.state.events[eventId].title,
        description: this.state.events[eventId].description,
        isOpen: this.state.events[eventId].isOpen,
        ticketPurchaseCount: Number(numTickets) + Number(initialPurchaseCount),
        imageIpfsHash: this.state.events[eventId].imageIpfsHash
      };

      this.state.web3.eth.getBalance(this.state.loginAddress)
      .then((balance) => {
        console.log("newBalance ", balance);
        this.setState({
          events: newEventsList,
          participatedEvents: newUserEventsList,
          inputNoOfTickets: "",
          loginAddressBalance: balance
        });

        alert(numTickets + " ticket(s) successfully bought!");
      });

    });
  }

  goBackToEvents() {
    this.setState({
      viewMode: VIEW_MODE_EVENTS_LIST,
      inputNoOfTickets: "",
      inputEventTitle: "",
      inputEventTicketsCount: "",
      inputEventTicketPrice: "",
      inputEventDescription: "",
      isWorking: false
    });
  }

  showEventInfo(id) {
    this.setState({
      selectedEventId: id,
      viewMode: VIEW_MODE_EVENT_INFO
    });
  }

  showAddEventForm(event) {
    this.setState({
      viewMode: VIEW_MODE_EVENT_FORM
    });
  }

  handleEventTitleChange(event) {
    this.setState({
      inputEventTitle: event.target.value
    });
  }

  handleEventTicketsCountChange(event) {
    this.setState({
      inputEventTicketsCount: event.target.value
    });
  }

  handleEventTicketPriceChange(event) {
    this.setState({
      inputEventTicketPrice: event.target.value
    });
  }

  handleEventDescriptionChange(event) {
    this.setState({
      inputEventDescription: event.target.value
    });
  }

  addEvent = async(event) => {
    event.preventDefault();

    this.setState({
      isWorking: true
    });

    ipfs.add(this.state.currentFileBuffer, (error, result) => {
      if (error) {
        console.log("error: ", error);
        return;
      }

      const imageIpfsHash = result[0]['path'];

      this.state.contract.methods.addEvent(
        this.state.inputEventTitle,
        this.state.inputEventDescription,
        Number(this.state.inputEventTicketPrice)*oneGWei,
        this.state.inputEventTicketsCount,
        imageIpfsHash
      ).send({from: this.state.loginAddress})
      .on('receipt', (receipt) => {

        const id = receipt.events.LogEventAdded.returnValues['id'];
        const title = receipt.events.LogEventAdded.returnValues['title'];
        const description = receipt.events.LogEventAdded.returnValues['desc'];
        const ticketPrice = receipt.events.LogEventAdded.returnValues['ticketPrice'];
        const ticketsAvailable = receipt.events.LogEventAdded.returnValues['ticketsAvailable'];
        const isOpen = true; // by default
        const imageIpfsHash = receipt.events.LogEventAdded.returnValues['imageIpfsHash'];

        let newEventsList = Object.assign({}, this.state.events);
        newEventsList[id] = {
          title: title,
          description: description,
          ticketPrice: ticketPrice,
          ticketsAvailable: ticketsAvailable,
          isOpen: isOpen,
          imageIpfsHash: imageIpfsHash,
          isWorking: false
        };

        this.state.web3.eth.getBalance(this.state.loginAddress)
        .then((balance) => {
          this.setState({
            loginAddressBalance: balance,
            events: newEventsList
          }, () => {
            this.goBackToEvents();
            alert("Event Added!");
          });
        });

      })
      .on('error', (error) => {
        console.log("Error occurred: ", error);
      });

    });
  }

  endSale = async(event) => {
    console.log("endSale id:", event.target.value);
    this.state.contract.methods.endSale(event.target.value)
    .send({from: this.state.loginAddress})
    .on('receipt', (receipt) => {
      const eventId = receipt.events.LogEndSale.returnValues['id'];
      const amountTotal = receipt.events.LogEndSale.returnValues['balance'];

      console.log("eventId amountTotal: ", eventId + ", " + amountTotal);

      let newEventsList = Object.assign({}, this.state.events);
      newEventsList[eventId] = {
        title: newEventsList[eventId].title,
        description: newEventsList[eventId].description,
        ticketPrice: "-",
        ticketsAvailable: 0,
        isOpen: false,
        imageIpfsHash: newEventsList[eventId].imageIpfsHash
      };

      let newUserEventsList = Object.assign({}, this.state.participatedEvents);

      if (newUserEventsList[eventId] != undefined) {
        newUserEventsList[eventId] = {
          title: newUserEventsList[eventId].title,
          description: newUserEventsList[eventId].description,
          isOpen: false,
          imageIpfsHash: newUserEventsList[eventId].imageIpfsHash,
          ticketPurchaseCount: newUserEventsList[eventId].ticketPurchaseCount
        };
      }

      this.state.web3.eth.getBalance(this.state.loginAddress)
      .then((balance) => {
        this.setState({
          loginAddressBalance: balance,
          events: newEventsList,
          participatedEvents: newUserEventsList
        }, () => {
          this.goBackToEvents();
          alert("Event sale closed!");
        });
      });

    })
    .on('error', (error) => {
      console.log("Error occurred: ", error);
    });
  }

  showUserEvents() {
    this.setState({
      viewMode: VIEW_MODE_EVENT_USER
    });
  }

  captureFile(event) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({
        currentFileBuffer: Buffer(reader.result)
      });
    }
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
          isLoginAddressOwner={this.state.owner == this.state.loginAddress}
          showEventInfo={this.showEventInfo}
          showAddEventForm={this.showAddEventForm}
          showUserEvents={this.showUserEvents}/>
      );
    } else if (this.state.viewMode == VIEW_MODE_EVENT_INFO) {
      renderComponent = (
        <EventInfo
          selectedEventId={this.state.selectedEventId}
          event={this.state.events[this.state.selectedEventId]}
          isLoginAddressOwner={this.state.owner == this.state.loginAddress}
          handleNoOfTicketsChange={this.handleNoOfTicketsChange}
          buyTickets={this.buyTickets}
          endSale={this.endSale}
          goBackToEvents={this.goBackToEvents}/>
      );
    } else if (this.state.viewMode == VIEW_MODE_EVENT_FORM) {
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
          captureFile={this.captureFile}
          goBackToEvents={this.goBackToEvents}
          isWorking={this.state.isWorking}/>
      );
    } else {
      renderComponent = (
        <UserEvents
          participatedEvents={this.state.participatedEvents}
          goBackToEvents={this.goBackToEvents}/>
      );
    }

    return (
      <div className="wrapper">
        <div id="appTitle">Event Management</div>
        <div className="container">
          <div id="userLoginAddress">
            <span id="loginAddressLabel">{this.state.owner == this.state.loginAddress ? "Owner " : "User "}</span>
            {this.state.loginAddress}</div>
          <div id="loginAddressBalance">Balance:&nbsp; {this.state.loginAddressBalance/oneGWei} gWei</div>
          {renderComponent}
        </div>
      </div>
    );
  }
}

export default App;
