const path = require("path");

// var HDWalletProvider = require('truffle-hdwallet-provider');

// const infuraRinkebyUrl = "https://rinkeby.infura.io/v3/<PROJECT-ID>";
// const infuraRopstenUrl = "https://ropsten.infura.io/v3/<PROJECT-ID>"";
//
// const mnemonic = ";

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
    //   provider: () => new HDWalletProvider(mnemonic, infuraRinkebyUrl),
    //   network_id: 4,
    //   gas: 5500000
    // },

    // ropsten: {
    //   provider: () => new HDWalletProvider(mnemonic, infuraRopstenUrl),
    //   network_id: 3,
    //   gas: 4000000
    // }

  }
};
