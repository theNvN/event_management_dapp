pragma solidity ^0.5.0;

import "./libraries/Seriality/src/Seriality.sol";

/// @title Contract that manages multiple events (eg. parties, meetups)
/// @autor Naveen Sahu
/// @notice Buy tickets of an event and/or be the owner of contract to host your own events
contract EventManagement is Seriality {

    /*Address of owner (address that deopolyed it) of contract*/
    address payable public owner;

    /*For generating unique id of an event*/
    uint idGenerator;

    /*Array of ids of all events*/
    uint[] eventIds;

    /*
    Represents an individual event
     title: Title of the event
     description: Description of event
     ticketsAvailable: No. of tickets currently available for sale
     ticketPrice: Price of one ticket
     sales: Total no. of tickets sold
     buyers: Mapping of a buyer address to no. of tickets bought
     imageIpfsHash: Ipfs hash of the event image
    */
    struct Event {
        string title;
        string description;
        uint ticketsAvailable;
        uint ticketPrice;
        uint sales;
        mapping (address => uint) buyers;
        bool isOpen;
        string imageIpfsHash;
    }

    /*Mapping of event id to event struct*/
    mapping (uint => Event) events;

    /*Logs for contract transactions*/
    event LogEventAdded(uint id, string title, string description, uint ticketPrice, uint ticketsAvailable, string imageIpfsHash);
    event LogBuyTickets(uint id, address buyer, uint numTickets);
    event LogGetRefund(uint id, address accountRefunded, uint numTickets);
    event LogEndSale(uint id, address owner, uint balance);

    /// @notice Deploying address is set as owner of contract
    constructor() public {
        owner = msg.sender;
    }

    /*Checks if sender address is owner*/
    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    /// @notice Adds an event to contract
    /// @param title Title of event
    /// @param description Description of the event
    /// @param price Price of one ticket for this event
    /// @param ticketsAvailable Total tickets available for sale
    /// @param imageIpfsHash Ipfs hash of the event image poster
    /// @return Id of addded event
    function addEvent(string memory title, string memory description, uint price, uint ticketsAvailable, string memory imageIpfsHash)
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
        evt.imageIpfsHash = imageIpfsHash;

        uint eventId = idGenerator;
        events[eventId] = evt;

        eventIds.push(eventId);
        idGenerator++;

        emit LogEventAdded(eventId, title, description, price, ticketsAvailable, events[eventId].imageIpfsHash);

        return eventId;
    }

    /// @notice Allows anyone to buy specified number of tickets
    /// @param eventId Id of the event, tickets to buy for
    /// @param noOfTickets No. of tickets to buy
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

    /// @notice Get the number of tickets the buyer bought
    /// @param eventId Id of the event
    /// @return No of tickets bought
    function getBuyerNumberTickets(uint eventId)
      public
      view
      returns (uint)
    {
        return events[eventId].buyers[msg.sender];
    }

    /// @notice Allows owner to end sale of an event
    /// @param eventId Id of the event to end the sale for
    function endSale(uint eventId)
      public
      isOwner
    {
        events[eventId].isOpen = false;

        uint amountTotal = events[eventId].sales*events[eventId].ticketPrice;
        owner.transfer(amountTotal);

        emit LogEndSale(eventId, owner, amountTotal);
    }

    /// @notice Retrieves all of the event's info (except event's image's Ipfs Hash)
    /// @return Array of individual event properties except for string type properties.
    /// @dev For passing string arrays it is first converted to bytes using Seriality library
    /// See https://github.com/pouladzade/Seriality for more info
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

    /// @param eventId Id of the event
    /// @return Ipfs has of event's image poster
    function getEventImageIpfsHash(uint eventId)
      public
      view
      returns (string memory)
    {
      return events[eventId].imageIpfsHash;
    }

    /// @notice Gets the buyer's purchases
    /// @return purchasedEventIds Array of event Ids buyer purchased
    /// @return ticketCounts Array consistion of no. of tickets purchased for distinct events
    function getBuyerPurchases()
      public
      view
      returns(uint[] memory purchasedEventIds, uint[] memory ticketCounts)
    {
       uint eventCount = getBuyerEventPurchaseCount();
       purchasedEventIds = new uint[](eventCount);
       ticketCounts = new uint[](eventCount);

       for (uint i = 0; i < eventIds.length; i++) {
           if (events[eventIds[i]].buyers[msg.sender] != 0) {
               purchasedEventIds[i] = eventIds[i];
               ticketCounts[i] = events[eventIds[i]].buyers[msg.sender];
           }
       }
    }

    // Helper functions:

    /// @return No. of distinct events buyer purchased for
    function getBuyerEventPurchaseCount()
      private
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

    /// @dev See this library https://github.com/pouladzade/Seriality
    /// and article https://medium.com/hackernoon/serializing-string-arrays-in-solidity-db4b6037e520
    /// @return buffer bytes of events' titles array
    function getEventsTitlesBuffer()
      private
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

    /// @dev See this library https://github.com/pouladzade/Seriality
    /// and article https://medium.com/hackernoon/serializing-string-arrays-in-solidity-db4b6037e520
    /// @return buffer bytes of events' descriptions array
    function getEventsDescriptionsBuffer()
      private
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

    /// @param eventId Id of the event to read
    /// @return individual properties of the event
    function readEvent(uint eventId)
      public
      view
      returns(string memory title, string memory description, uint ticketPrice, uint ticketsAvailable, uint sales, bool isOpen, string memory imageIpfsHash)
    {
        title = events[eventId].title;
        description = events[eventId].description;
        ticketPrice = events[eventId].ticketPrice;
        ticketsAvailable = events[eventId].ticketsAvailable;
        sales = events[eventId].sales;
        isOpen = events[eventId].isOpen;
        imageIpfsHash = events[eventId].imageIpfsHash;
    }

}
