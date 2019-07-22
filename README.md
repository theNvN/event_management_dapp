# Event Management DApp
This is a simple DApp, with sole purpose of management of the various events like parties, meetups etc.
An owner of the contract adds the event. Users can purchase the event tickets to participate in the events. The owner can close an event anytime and withdraw total amount aggregated through sales of tickets of that event.

## User Stories
Following are the user stories which clarify functionality of this app:
* The owner (deploying address of contract) logs into the app. App reads & identifies the address as the owner. Address displayed on top of the app is tagged as __Owner__ as can be seen. Balance of the logged in address is also shown below it. Apart from normal user functionality owner only privileges are enabled like adding or closing an event. A list of events are shown on __Events__ section, if any.

* Owner taps __Add Event__ button. __Event Form__ section appears. A form is shown asking details of the event. Leaving any field empty pops up an alert message asking for all info to be provided. Submitting the form with valid details, displays a message asking to wait while image file is uploaded to __IPFS__ while __Submit__ button is disabled. Upon successful upload an alert message is shown saying that event is added successfully and is taken back to __Events__ section where added event is added to the list of events. The balance of the owner address is updated.

* Owner taps __Go Back__ button in the __Event Form__ section. The __Events__ section is shown.

* __User__ (not __Owner__) logs into the app. App reads & identifies the address as a normal user. __Add Event__ button is __disabled__ and the address displayed at the top is tagged as __User__. A list of events already added events are shown. Each event's info is shown including the image.

* User/Owner taps __Your Events__ button. __Participated Events__ section is shown. A list of events with few details, including number of tickets bought, are shown that current address bought.

* User/Owner taps any event, i.e. it's image in __Events__ section. __Event Info__ section is shown, displaying event's information along with ticket buying form asking for number of tickets to buy. If logged in address was identified as __Owner__, __Close Event & Withdraw Amount__ button is shown otherwise NOT. Entering invalid input (exceeded number, non-numeric etc.) shows alert message asking to enter valid input. Upon entering valid input and tapping __Buy__ button, the event is added to __Participated Events__ section for address that bought tickets & balance updates, provided transaction was successful.

* Owner taps __Close Event & Withdraw Amount__ button in __Event Info__ section. An alert message is shown saying event is closed, __Close Event & Withdraw Amount__ button is disabled & balance updates, provided transaction was successful. Event that was closed is now labeled __CLOSED__ instead of __OPEN__ in __Events__, __Event Info__ & __Participated Events__ section.  __BUY__ button is disabled now.


# React Truffle Box

This box comes with everything you need to start using smart contracts from a react app. This is as barebones as it gets, so nothing stands in your way.

## Installation

First ensure you are in a new and empty directory.

1. Run the `unbox` command via `npx` and skip to step 3. This will install all necessary dependencies. A Create-React-App is generated in the `client` directory.
   ```js
   npx truffle unbox react
   ```

2. Alternatively, you can install Truffle globally and run the `unbox` command.
    ```javascript
    npm install -g truffle
    truffle unbox react
    ```

3. Run the development console.
    ```javascript
    truffle develop
    ```

4. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```javascript
    compile
    migrate
    ```

5. In the `client` directory, we run the React app. Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // in another terminal (i.e. not in the truffle develop prompt)
    cd client
    npm run start
    ```

6. Truffle can run tests written in Solidity or JavaScript against your smart contracts. Note the command varies slightly if you're in or outside of the development console.
    ```javascript
    // inside the development console.
    test

    // outside the development console..
    truffle test
    ```

7. Jest is included for testing React components. Compile your contracts before running Jest, or you may receive some file not found errors.
    ```javascript
    // ensure you are inside the client directory when running this
    npm run test
    ```

8. To build the application for production, use the build script. A production build will be in the `client/build` folder.
    ```javascript
    // ensure you are inside the client directory when running this
    npm run build
    ```

## FAQ

* __How do I use this with the Ganache-CLI?__

    It's as easy as modifying the config file! [Check out our documentation on adding network configurations](http://truffleframework.com/docs/advanced/configuration#networks). Depending on the port you're using, you'll also need to update line 29 of `client/src/utils/getWeb3.js`.

* __Where is my production build?__

    The production build will be in the `client/build` folder after running `npm run build` in the `client` folder.

* __Where can I find more documentation?__

    This box is a marriage of [Truffle](http://truffleframework.com/) and a React setup created with [create-react-app](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md). Either one would be a great place to start!
