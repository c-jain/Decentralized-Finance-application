import React from "react";
import { newContextComponents } from "drizzle-react-components";
import { DrizzleContext } from "drizzle-react";

const { AccountData, ContractData, ContractForm } = newContextComponents;

export default () => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;
      if (!initialized) {
        return "Loading...";
      }

      const { accounts } = drizzleState;
      const { web3 } = drizzle;
      return (
        <div className="App">
          
          <div className="section">
          <AccountData
            drizzle={drizzle}
            drizzleState={drizzleState}
            accountIndex="0"
            units="ether"
            precision="3"
            render={({ address, balance, units }) => (
              <div>
                <div>My Address: <span style={{ color: "red" }}>{address}</span></div>
                <div>My Ether: <span style={{ color: "red" }}>{balance}</span> {units}</div>
              </div>
            )}
          />
          </div>

          <div className="section">
            <h2>Mint Stable Coins</h2>
            <p>
              Currently 1 ether = 100 ZST
            </p>
            <p>
              <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="ZastrinToken"
                method="balanceOf"
                methodArgs={[accounts[0]]}
                render={ displayData => (
                  <div>
                    My Balance: {displayData/1000000000000000000} 
                  </div>
                )}
              />
            </p>
            <p>
              <ContractForm 
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="ZastrinToken"
                method="mintTokens"
                sendArgs={{from: accounts[0], value: web3.utils.toWei('1', 'ether')}}
                labels={["Enter amount of ether to mint tokens"]}
              />
            </p>
          </div>
        </div>
      );
    }}
  </DrizzleContext.Consumer>
);
