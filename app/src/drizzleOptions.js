import ZastrinToken from "./contracts/ZastrinToken.json";

const options = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:8545",
    },
  },
  contracts: [ZastrinToken],
  events: {
    ZastrinToken: ["ZastrinTokenMinted"],
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
