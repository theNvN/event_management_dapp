var EventManagement = artifacts.require("EventManagement")
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract("EventManagement", function(accounts) {

  const deployAccount = accounts[0]
  const firstAccount = accounts[1]
  const secondAccount = accounts[2]
  const thirdAccount = accounts[3]

  let instance

  const event1 = {
    title: "event 1",
    description: "event 1 description",
    ticketsAvailable: 100,
    ticketPrice: 1000,
    imageIpfsHash: "Qmf1rst1pf5aPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq"
  }

  const event2 = {
    title: "event 2",
    description: "event 2 description",
    ticketsAvailable: 200,
    ticketPrice: 2000,
    imageIpfsHash: "Qm5ec0nd1pf5PSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq"
  }

  const event3 = {
    title: "event 3",
    description: "event 3 description",
    ticketsAvailable: 300,
    ticketPrice: 3000,
    imageIpfsHash: "Qmth1rd1pf5aPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq"
  }

  beforeEach(async() => {
    instance = await EventManagement.new()
  })

  describe("Setup", async() => {

    it("owner should be set to the deploying address", async() => {
        const owner = await instance.owner()
        assert.equal(owner, deployAccount, "the deploying address should be the owner")
    })
  })

  describe("Functions", () => {

    describe("addEvent()", async() => {

      it("adding an event should emit an event with the provided event details", async() => {
        const tx = await instance.addEvent(event1.title, event1.description, event1.ticketPrice,
          event1.ticketsAvailable, event1.imageIpfsHash,  {from: deployAccount})
        const eventData = tx.logs[0].args

        assert.equal(eventData.title, event1.title, "the added event titles should match")
        assert.equal(eventData.description, event1.description, "the added event descriptions should match")
        assert.equal(eventData.ticketsAvailable.toString(10), event1.ticketsAvailable.toString(10), "the added event ticket amounts should match")
        assert.equal(eventData.ticketPrice.toString(), event1.ticketPrice.toString(), "the added event ticket prices should match")
        assert.equal(eventData.imageIpfsHash, event1.imageIpfsHash, "the added event image ipfs hashes should match")
      })

      it("only the owner should be able to add an event", async() => {
        await instance.addEvent(event1.title, event1.description, event1.ticketPrice,
          event1.ticketsAvailable, event1.imageIpfsHash,  {from: deployAccount})

        await catchRevert(instance.addEvent(event1.title, event1.description, event1.ticketPrice,
          event1.ticketsAvailable, event1.imageIpfsHash,  {from: firstAccount}))
      })
    })

    describe("buyTickets()", async() => {

      it("tickets should only be able to be purchased when the event is open", async() => {
        const numberOfTickets = 1

        // event with id 1 does not exist, therefore not open
        await catchRevert(instance.buyTickets(1, numberOfTickets, {from: firstAccount, value: event1.ticketPrice}))

        await instance.addEvent(event1.title, event1.description, event1.ticketPrice,
          event1.ticketsAvailable, event1.imageIpfsHash,  {from: deployAccount})

        await instance.buyTickets(0, numberOfTickets, {from: firstAccount, value: event1.ticketPrice})

        const eventDetails = await instance.readEvent(0)
        assert.equal(eventDetails['4'], numberOfTickets, `the ticket sales should be ${numberOfTickets}`)
      })

      it("tickets should only be able to be purchased when enough value is sent with the transaction", async() => {
        const numberOfTickets = 1
        await instance.addEvent(event1.title, event1.description, event1.ticketPrice,
          event1.ticketsAvailable, event1.imageIpfsHash,  {from: deployAccount})
        await catchRevert(instance.buyTickets(0, numberOfTickets, {from: firstAccount, value: event1.ticketPrice - 1}))
      })

      it("tickets should only be able to be purchased when there are enough tickets remaining", async() => {
        await instance.addEvent(event1.title, event1.description, event1.ticketPrice,
          event1.ticketsAvailable, event1.imageIpfsHash,  {from: deployAccount})
        await instance.buyTickets(0, 51, {from: firstAccount, value: event1.ticketPrice * 51})
        await catchRevert(instance.buyTickets(0, 51, {from: secondAccount, value: event1.ticketPrice * 51}))
      })

    })

    describe("endSale()", async() => {

      it("only the owner should be able to end the sale and mark it as closed", async() => {
        await instance.addEvent(event1.title, event1.description, event1.ticketPrice,
          event1.ticketsAvailable, event1.imageIpfsHash,  {from: deployAccount})

        await catchRevert(instance.endSale(0, {from: firstAccount}))
        const txResult = await instance.endSale(0, {from: deployAccount})
        const eventData = await instance.readEvent(0)

        assert.equal(eventData['5'], false, "The event isOpen variable should be marked false.")
      })

      it("endSale() should emit an event with information about how much ETH was sent to the contract owner", async() => {
        const numberToPurchase = 3

        await instance.addEvent(event1.title, event1.description, event1.ticketPrice,
          event1.ticketsAvailable, event1.imageIpfsHash,  {from: deployAccount})
        await instance.buyTickets(0, numberToPurchase, {from: secondAccount, value: event1.ticketPrice*numberToPurchase})
        const txResult = await instance.endSale(0, {from: deployAccount})

        const amount = txResult.logs[0].args['2'].toString()

        assert.equal(amount, event1.ticketPrice*numberToPurchase, "the first emitted event should contain the tranferred amount as the second parameter")
      })

    })

  })

})
