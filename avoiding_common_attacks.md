# Avoiding Common Attacks
This document lists common attacks that the contract avoids.

### 1.) tx.Origin Attacks
The contract never uses `tx.origin` global variable. Using `tx.origin` maybe tricked into calling a malicious contract and harming the system in a way.
Wherever needed, only `msg.sender` global variable is used is used.

### 2.) Re-entrancy Attacks
The contract avoids the possible re-entrancy attacks. Wherever an external call is made, all the internal work (internal state changes) is done before the external work.

### 3.) Integer Overflow and Underflow
The contract avoids the usage of smaller data types (`uint8`, `uint16` etc.) naturally, consequently avoid the problem of integer overflow/underflow.

### 4.) Denial of Service
Possible DoS exploits, if any, are avoided using withdrawal design pattern, in which internal state are changed first before doing any external work.
