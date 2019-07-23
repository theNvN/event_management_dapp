# Event Management DApp
This is a simple DApp, with sole purpose of management of the various events like parties, meetups etc.
An owner of the contract adds the event. Users can purchase the event tickets to participate in the events. The owner can close an event anytime and withdraw total amount aggregated through sales of tickets of that event.
__IPFS__ is used for persistence of and serving the image files.
__Seriality__ library is used for serialization of data in parts of contract code. All credits for library goes [here](https://github.com/pouladzade/Seriality).

## User Stories
Following are the user stories which clarify functionality of this app:
* The owner (deploying address of contract) logs into the app. App reads & identifies the address as the owner. Address displayed on top of the app is tagged as __Owner__ as can be seen. __Activation Toggle__ (labeled as __DEACTIVATE__ or __ACTIVATE__) button is shown initially labeled as "DEACTIVATE". Balance of the logged in address is also shown below address. Apart from normal user functionality owner only privileges are enabled like adding or closing an event. A list of events are shown on __Events__ section, if any.

* __Owner__ taps the __Activation Toggle__ button. If initially labeled __DEACTIVATE__, disables the functionality of adding an event in __Event From__ section and of buying tickets even if event is open. If button is labeled __ACTIVATE__ and owner taps it, it re-enables the functionalities disabled earlier.

* Owner taps __Add Event__ button. __Event Form__ section appears. A form is shown asking details of the event. Leaving any field empty pops up an alert message asking for all info to be provided. Submitting the form with valid details, displays a message asking to wait while image file is uploaded to __IPFS__ while __Submit__ button is disabled. Upon successful upload an alert message is shown saying that event is added successfully and is taken back to __Events__ section where added event is added to the list of events. The balance of the owner address is updated.

* Owner taps __Go Back__ button in the __Event Form__ section. The __Events__ section is shown.

* __User__ (NOT __Owner__) logs into the app. App reads & identifies the address as a normal user. __Add Event__ button is __disabled__ and the address displayed at the top is tagged as __User__.  __Activation Toggle__ button is NOT visible. A list of events already added events are shown. Each event's info is shown including the image.

* User/Owner taps __Your Events__ button. __Participated Events__ section is shown. A list of events with few details, including number of tickets bought, are shown that current address bought.

* User/Owner taps any event, i.e. it's image in __Events__ section. __Event Info__ section is shown, displaying event's information along with ticket buying form asking for number of tickets to buy. If logged in address was identified as __Owner__, __Close Event & Withdraw Amount__ button is shown otherwise NOT. Entering invalid input (exceeded number, non-numeric etc.) shows alert message asking to enter valid input. Upon entering valid input and tapping __Buy__ button, the event is added to __Participated Events__ section for address that bought tickets & balance updates, provided transaction was successful.

* Owner taps __Close Event & Withdraw Amount__ button in __Event Info__ section. An alert message is shown saying event is closed, __Close Event & Withdraw Amount__ button is disabled, now labeled as __Event Closed__ & balance updates, provided transaction was successful. Event that was closed is now labeled __CLOSED__ instead of __OPEN__ in __Events__, __Event Info__ & __Participated Events__ section.  __BUY__ button is disabled now.


## Installation
### Components
This project utilizes following key components:
* [Web3](https://web3js.readthedocs.io/en/1.0/) to interact with a Ethereum node.
* [Ganache](https://www.trufflesuite.com/ganache),  personal blockchain for Ethereum development.
* [Truffle](https://www.trufflesuite.com/) development environment for the development & testing.
* [React](https://reactjs.org/) for front end.
* [Lite-server](https://www.npmjs.com/package/lite-server) for serving web app for development.
* [IPFS](https://ipfs.io/) for persistence of image files to ipfs.

Above components are required for app functionality and can be installed by navigating to `./client` (containing `package.json`) directory and running `npm install` command.
However, use following if installing it individually:
1. Web3
    ```javascript
    npm install web3
    ```
2. Ganache
    ```javascript
    npm install -g ganache-cli
    ```
    This installs command line version of ganache. Check [here](https://www.trufflesuite.com/ganache) for GUI ganache.

3. Truffle
    ```javascript
    npm install -g truffle
    ```

4. IPFS
    ```javascript
    npm install --save ipfs-http-client
    ```
5. Lite-server
    ```javascript
    npm install lite-server --save-dev
    ```

### Interaction

1. Run the ganache development blockchain by running:
    ```javascript
    ganache-cli
    ```
2. Run the tests against the contracts
    ```javascript
    truffle test
    ```
3. Compile and migrate the smart contracts
    ```javascript
    truffle compile
    truffle migrate
    ```

4. In the `client` directory, run the React app. Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // in another terminal (i.e. not in the truffle develop prompt)
    cd client
    npm run start
    ```

### Note
Depending on the port, the ganache is running on your system you may need to change config files.
Open `./truffle-config.js` file and update line 10. Open `./client/src/utils/getWeb3.js` and update line 29 too, if your port is different.
[Check out documentation on adding network configurations](http://truffleframework.com/docs/advanced/configuration#networks).
