# Design Patterns
Following are the design patterns used in contract:

### Ownership
The contract contains a state variable `owner` which is set to the address which deployed the contract.
There are some functions (like adding an event) in contract which must be executed only by the Owner of the contract. Implementing the ownership pattern allows this functionality with re-usability. Thus used here.
