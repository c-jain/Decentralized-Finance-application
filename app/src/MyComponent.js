import React from "react";
import {
  AccountData,
  ContractData,
  ContractForm,
} from "drizzle-react-components";

export default ({ accounts }) => (
  <div className="App">
    
    <div className="section">
      <h2>Active Account</h2>
      <AccountData accountIndex="0" units="ether" precision="3" />
    </div>

    <div className="section">
      <h2>Generate Stable Coins</h2>
      <p>
        Currently 1 ether = 100 ZTC
      </p>
      <p>
        <strong>My Balance: </strong>
        <ContractData
          contract="TokenGenerator"
          method="balanceOf"
          methodArgs={[accounts[0]]}
        />
      </p>
      <h3>Generate ZTC</h3>
      <ContractForm
        contract="TokenGenerator"
        method="tokenGenerator"
        sendArgs={{from: accounts[0], value: 1}}
        labels={["Enter ether"]}
      />
    </div>
    
  </div>
);
