const path = require("path");

// var HDWalletProvider = require('truffle-hdwallet-provider');
// const infuraUrl = "https://rinkeby.infura.io/v3/<PROJECT-ID>";
// const mnemonic = "";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: "8545",
      network_id: "*"
    },

    // rinkeby: {
    //   provider: () => new HDWalletProvider(mnemonic, infuraUrl),
    //   network_id: 4,
    //   gas: 5500000
    // }

  }
};
