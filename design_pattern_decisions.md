# Design Patterns
The contract is simple enough to have only a few design patterns. Other design patterns were not needed to ensure safety & functionality of this app as of writing.
Following are the design patterns that are used in contract code:

### Ownership
The contract contains a state variable `owner` which is set to the address which deployed the contract.
There are some functions (like adding an event) in contract which must be executed only by the Owner of the contract. Implementing the ownership pattern allows this functionality with re-usability. Thus used here.

### Circuit Breaker
The contract utilizes the circuit breaker pattern. The owner (deploying address) of the contract has the ability to suspend the key transaction functions like buying ticket and adding another event, in case any emergency occurs or a bug is discovered. Thus safety is ensured.
