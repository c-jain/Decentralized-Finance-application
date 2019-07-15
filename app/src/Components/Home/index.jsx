import React from 'react';
import { newContextComponents } from "drizzle-react-components";

import "../index.css";

const { AccountData, ContractData } = newContextComponents;

const Home = ({ drizzle, drizzleState, decimal, mint }) => (((
    <div className="container">
        <div>
            <AccountData
                drizzle={drizzle}
                drizzleState={drizzleState}
                accountIndex={0}
                units="ether"
                precision={3}
                render={({ address, balance, units }) => (
                    <div>
                        <div className="d-lg-flex p-2 bg-light font-weight-bold mt-5 text-secondary">
                            My Address: 
                            <span className="text-success pl-2">{address}</span>
                        </div>
                        <div className="d-lg-flex p-2 bg-light font-weight-bold text-secondary">
                            My Ether:
                            <span className="text-success pl-2 pr-2">{balance}</span>
                            {units}
                        </div>
                    </div>
                )}
            />
            <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="ZastrinToken"
                method="balanceOf"
                methodArgs={[drizzleState.accounts[0]]}
                render={ data => (
                    <div className="d-lg-flex p-2 bg-light font-weight-bold text-secondary">
                        My ZastrinStableToken: 
                        <span className="text-success pl-2 pr-2">{data/(10**decimal)}</span>
                        ZST
                    </div>
                )}
            />
        </div>

        <div className="mint mx-auto">
            <div className="align-items-center d-lg-inline-flex flex-column p-2 bg-light mt-5">
                <h2 className="text-secondary">Mint ZastrinStableToken Here:</h2>
                <h4 className="text-info">1 Ether = 100 ZST</h4>
                <form onSubmit={mint}>
                    <div className="form-row align-items-center">
                        <div className="col-auto">
                            <label className="sr-only" htmlFor="amount">Ethers</label>
                            <input type="number" step="any" name="Amount" id="amount" className="form-control mb-2" placeholder="Enter amount of ether" required/>
                        </div>
                        <div>
                            <input type="submit" value="Mint" className="btn btn-outline-success mb-2" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
)));

export default Home;