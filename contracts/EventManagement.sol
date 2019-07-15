pragma solidity ^0.5.0;


contract EventManagement {


    address payable public owner;

    uint   PRICE_TICKET = 100 wei;

    uint public idGenerator;


    struct Event {
        string description;
        string website;
        uint ticketsAvailable;
        uint sales;
        mapping (address => uint) buyers;
        bool isOpen;
    }


    mapping (uint => Event) events;

    event LogEventAdded(string desc, string url, uint ticketsAvailable, uint eventId);
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

    function addEvent(string memory description, string memory url, uint ticketsAvailable) public isOwner returns (uint) {
        Event memory evt;

        evt.description = description;
        evt.website = url;
        evt.ticketsAvailable = ticketsAvailable;
        evt.isOpen = true;

        uint eventId = idGenerator;
        events[idGenerator] = evt;
        idGenerator++;

        emit LogEventAdded(description, url, ticketsAvailable, eventId);

        return eventId;
    }

    function readEvent(uint eventId)
      public
      view
      returns(string memory description, string memory url, uint ticketsAvailable, uint sales, bool isOpen) {
        description = events[eventId].description;
        url = events[eventId].website;
        ticketsAvailable = events[eventId].ticketsAvailable;
        sales = events[eventId].sales;
        isOpen = events[eventId].isOpen;
    }


    function buyTickets(uint eventId, uint noOfTickets)
      public
      payable
    {
        require(events[eventId].isOpen == true);
        require(msg.value >= PRICE_TICKET*noOfTickets);
        require(events[eventId].ticketsAvailable >= noOfTickets);

        events[eventId].buyers[msg.sender] += noOfTickets;
        events[eventId].ticketsAvailable -= noOfTickets;
        events[eventId].sales = noOfTickets;

        uint ticketsPrice = PRICE_TICKET*noOfTickets;
        if (msg.value > ticketsPrice) {
            msg.sender.transfer(msg.value - ticketsPrice);
        }

        emit LogBuyTickets(msg.sender, eventId, noOfTickets);
    }


    function getRefund(uint eventId) public {
        require(events[eventId].buyers[msg.sender] > 0);

        uint noOfTicketsToRefund = events[eventId].buyers[msg.sender];
        uint refundAmount = PRICE_TICKET*noOfTicketsToRefund;

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

        uint amountTotal = events[eventId].sales*PRICE_TICKET;
        owner.transfer(amountTotal);

        emit LogEndSale(owner, amountTotal, eventId);
    }
}
