pragma solidity ^0.5.0;

import "./libraries/Seriality/src/Seriality.sol";

contract EventManagement is Seriality {

    address payable public owner;

    uint public idGenerator;

    uint[] eventIds;

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

    event LogEventAdded(uint id, string title, string desc, uint ticketPrice, uint ticketsAvailable);
    event LogBuyTickets(uint id, address buyer, uint numTickets);
    event LogGetRefund(uint id, address accountRefunded, uint numTickets);
    event LogEndSale(uint id, address owner, uint balance);

    constructor() public {
        owner = msg.sender;
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    function addEvent(string memory title, string memory description, uint price, uint ticketsAvailable)
      public
      isOwner
      returns (uint)
    {
        Event memory evt;

        evt.title = title;
        evt.description = description;
        evt.ticketPrice = price;
        evt.ticketsAvailable = ticketsAvailable;
        evt.sales = 0;
        evt.isOpen = true;

        uint eventId = idGenerator;
        events[eventId] = evt;

        eventIds.push(eventId);
        idGenerator++;

        emit LogEventAdded(eventId, title, description, price, ticketsAvailable);

        return eventId;
    }

    function readEvent(uint eventId)
      public
      view
      returns(string memory title, string memory description, uint ticketPrice, uint ticketsAvailable, uint sales, bool isOpen)
    {
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

        emit LogBuyTickets(eventId, msg.sender, noOfTickets);
    }


    function getRefund(uint eventId) public {
        require(events[eventId].buyers[msg.sender] > 0);

        uint noOfTicketsToRefund = events[eventId].buyers[msg.sender];
        uint refundAmount = events[eventId].ticketPrice*noOfTicketsToRefund;

        events[eventId].sales -= noOfTicketsToRefund;
        msg.sender.transfer(refundAmount);
        events[eventId].ticketsAvailable += noOfTicketsToRefund;

        emit LogGetRefund(eventId, msg.sender, noOfTicketsToRefund);
    }


    function getBuyerNumberTickets(uint eventId) public view returns (uint) {
        return events[eventId].buyers[msg.sender];
    }


    function endSale(uint eventId) public isOwner {
        events[eventId].isOpen = false;

        uint amountTotal = events[eventId].sales*events[eventId].ticketPrice;
        owner.transfer(amountTotal);

        emit LogEndSale(eventId, owner, amountTotal);
    }

    // Helper functions:
    function getEventsData()
      public
      view
      returns (uint[] memory ids, bytes memory titlesBuffer, bytes memory descriptionsBuffer, uint[] memory ticketsAvailable,
      uint[] memory ticketsPrices, bool[] memory areOpen)
    {
        titlesBuffer = getEventsTitlesBuffer();
        descriptionsBuffer = getEventsDescriptionsBuffer();

        ids = new uint[](eventIds.length);
        ticketsAvailable = new uint[](eventIds.length);
        ticketsPrices = new uint[](eventIds.length);
        areOpen = new bool[](eventIds.length);

        for (uint i = 0; i < eventIds.length; i++) {
            ids[i] = eventIds[i];
            ticketsAvailable[i] = events[eventIds[i]].ticketsAvailable;
            ticketsPrices[i] = events[eventIds[i]].ticketPrice;
            areOpen[i] = events[eventIds[i]].isOpen;
        }
    }

    function getBuyerPurchases()
      public
      view
      returns(uint[] memory purchasedEventIds)
    {
       uint count = getBuyerEventPurchaseCount();
       purchasedEventIds = new uint[](count);

       for (uint i = 0; i < eventIds.length; i++) {
           if (events[eventIds[i]].buyers[msg.sender] != 0) {
               purchasedEventIds[i] = eventIds[i];
           }
       }
    }

    function getBuyerEventPurchaseCount()
      public
      view
      returns (uint)
    {
        uint count = 0;
        for (uint i = 0; i < eventIds.length; i++) {
            if (events[eventIds[i]].buyers[msg.sender] != 0) {
                count += 1;
            }
        }

        return count;
    }

    function getEventIds()
      public
      view
      returns (uint[] memory)
    {
      return eventIds;
    }

    function getEventsTitlesBuffer()
      public
      view
      returns(bytes memory)
    {
      uint offset = 64*eventIds.length;

      bytes memory buffer = new bytes(offset);
      string memory out = new string(32);

      for (uint i = 0; i < eventIds.length; i++) {
        out = events[eventIds[i]].title;

        stringToBytes(offset, bytes(out), buffer);
        offset -= sizeOfString(out);
      }

      return buffer;
    }

    function getEventsDescriptionsBuffer()
      public
      view
      returns(bytes memory)
    {
      uint offset = 64*eventIds.length;

      bytes memory buffer = new bytes(offset);
      string memory out = new string(32);

      for (uint i = 0; i < eventIds.length; i++) {
        out = events[eventIds[i]].description;

        stringToBytes(offset, bytes(out), buffer);
        offset -= sizeOfString(out);
      }

      return buffer;
    }

    // function getEventsBufferBytes()
    //   public
    //   view
    //   returns (bytes memory, bytes memory, bytes memory, bytes memory, bytes memory)
    // {
    //     //uint length = eventIds.length;

    //     // uint titleOffset = 64*length;
    //     // uint descriptionOffset = 64*length;
    //     // uint ticketsAvailableOffset =4*length;
    //     // uint ticketPriceOffset = 4*length;
    //     // uint isOpenOffset = 1*length;

    //     uint offset = 64*eventIds.length + 64*eventIds.length + 4*eventIds.length + 4*eventIds.length + eventIds.length;

    //     bytes memory titleBuffer = new bytes(64*eventIds.length);
    //     bytes memory descriptionBuffer = new bytes(64*eventIds.length);
    //     bytes memory ticketsAvailableBuffer = new bytes(4*eventIds.length);
    //     bytes memory ticketPriceBuffer = new bytes(4*eventIds.length);
    //     bytes memory isOpenBuffer = new bytes(eventIds.length);

    //     string memory titleOut = new string(32);
    //     string memory descriptionOut = new string(32);
    //     uint ticketsAvailableOut;
    //     uint ticketPriceOut;
    //     bool isOpenOut;

    //     for (uint i = 0; i < eventIds.length; i++) {
    //         titleOut = events[eventIds[i]].title;
    //         descriptionOut = events[eventIds[i]].description;
    //         ticketsAvailableOut = events[eventIds[i]].ticketsAvailable;
    //         ticketPriceOut = events[eventIds[i]].ticketPrice;
    //         isOpenOut = events[eventIds[i]].isOpen;

    //         stringToBytes(offset, bytes(titleOut), titleBuffer);
    //         offset -= sizeOfString(titleOut);

    //         stringToBytes(offset, bytes(descriptionOut), descriptionBuffer);
    //         offset -= sizeOfString(descriptionOut);

    //         uintToBytes(offset, ticketsAvailableOut, ticketsAvailableBuffer);
    //         offset -= sizeOfUint(256);

    //         uintToBytes(offset, ticketPriceOut, ticketPriceBuffer);
    //         offset -= sizeOfUint(256);

    //         boolToBytes(offset, isOpenOut, isOpenBuffer);
    //         offset -= sizeOfBool();
    //     }

    //     return (titleBuffer, descriptionBuffer, ticketsAvailableBuffer, ticketPriceBuffer, isOpenBuffer);

    // }
}
