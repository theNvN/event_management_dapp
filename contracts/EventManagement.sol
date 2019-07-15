pragma solidity ^0.5.0;


contract EventManagement {


    address payable public owner;

    uint public idGenerator;


    struct Event {
        string title;
        string description;
        uint ticketsAvailable;
        uint ticketPrice;
        uint sales;
        mapping (address => uint) buyers;
        bool isOpen;
    }


    mapping (uint => Event) events;

    event LogEventAdded(string title, string desc, uint ticketPrice, uint ticketsAvailable, uint eventId);
    event LogBuyTickets(address buyer, uint eventId, uint numTickets);
    event LogGetRefund(address accountRefunded, uint eventId, uint numTickets);
    event LogEndSale(address owner, uint balance, uint eventId);

    constructor() public {
        owner = msg.sender;
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    function addEvent(string memory title, string memory description, uint price, uint ticketsAvailable) public isOwner returns (uint) {
        Event memory evt;

        evt.title = title;
        evt.description = description;
        evt.ticketPrice = price;
        evt.ticketsAvailable = ticketsAvailable;
        evt.isOpen = true;

        uint eventId = idGenerator;
        events[idGenerator] = evt;
        idGenerator++;

        emit LogEventAdded(title, description, price, ticketsAvailable, eventId);

        return eventId;
    }

    function readEvent(uint eventId)
      public
      view
      returns(string memory title, string memory description, uint ticketPrice, uint ticketsAvailable, uint sales, bool isOpen) {
        title = events[eventId].title;
        description = events[eventId].description;
        ticketPrice = events[eventId].ticketPrice;
        ticketsAvailable = events[eventId].ticketsAvailable;
        sales = events[eventId].sales;
        isOpen = events[eventId].isOpen;
    }


    function buyTickets(uint eventId, uint noOfTickets)
      public
      payable
    {
        require(events[eventId].isOpen == true);
        require(msg.value >= events[eventId].ticketPrice*noOfTickets);
        require(events[eventId].ticketsAvailable >= noOfTickets);

        events[eventId].buyers[msg.sender] += noOfTickets;
        events[eventId].ticketsAvailable -= noOfTickets;
        events[eventId].sales = noOfTickets;

        uint ticketsPrice = events[eventId].ticketPrice*noOfTickets;
        if (msg.value > ticketsPrice) {
            msg.sender.transfer(msg.value - ticketsPrice);
        }

        emit LogBuyTickets(msg.sender, eventId, noOfTickets);
    }


    function getRefund(uint eventId) public {
        require(events[eventId].buyers[msg.sender] > 0);

        uint noOfTicketsToRefund = events[eventId].buyers[msg.sender];
        uint refundAmount = events[eventId].ticketPrice*noOfTicketsToRefund;

        events[eventId].sales -= noOfTicketsToRefund;
        msg.sender.transfer(refundAmount);
        events[eventId].ticketsAvailable += noOfTicketsToRefund;

        emit LogGetRefund(msg.sender, eventId, noOfTicketsToRefund);
    }


    function getBuyerNumberTickets(uint eventId) public view returns (uint) {
        return events[eventId].buyers[msg.sender];
    }


    function endSale(uint eventId) public isOwner {
        events[eventId].isOpen = false;

        uint amountTotal = events[eventId].sales*events[eventId].ticketPrice;
        owner.transfer(amountTotal);

        emit LogEndSale(owner, amountTotal, eventId);
    }
}
