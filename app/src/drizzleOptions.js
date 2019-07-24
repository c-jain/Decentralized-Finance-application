import ZastrinToken from "./contracts/ZastrinToken.json";
import Bank from "./contracts/Bank.json";

const options = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:8545",
    },
  },
  contracts: [ZastrinToken, Bank],
  events: {
    ZastrinToken: ["ZastrinTokenMinted"],
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
