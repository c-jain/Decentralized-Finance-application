import React from 'react';
import { newContextComponents } from "drizzle-react-components";

const { AccountData, ContractData } = newContextComponents;

class Home extends React.Component {
    state = {
        decimalKey: null,
        mintStackId: null,
        approveStackId: null
    };

    handleKeyDown = event => {
        if (event.keyCode === 13) {
            const { drizzle, drizzleState } = this.props;
            const contract = drizzle.contracts.ZastrinToken;

            const mintStackId = contract.methods["mintTokens"].cacheSend(event.target.value, {
                from: drizzleState.accounts[0], value: drizzle.web3.utils.toWei(event.target.value.toString())
            });

            this.setState({ mintStackId });
        }
    };

    handleApprove = event => {
        event.preventDefault();
        const decimals = parseInt(event.target.dataset.message);
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.ZastrinToken;

        const approveStackId = contract.methods["approve"].cacheSend(event.target.Spender.value, event.target.Amount.value * 10**decimals, { from: drizzleState.accounts[0] });

        this.setState({ approveStackId });
    }

    componentDidMount() {
        const contract = this.props.drizzle.contracts.ZastrinToken;
        const decimalKey = contract.methods["decimals"].cacheCall();
        
        this.setState({ decimalKey });
    }

    render() {
        const { ZastrinToken } = this.props.drizzleState.contracts;
        const decimals = ZastrinToken.decimals[this.state.decimalKey];

        return (
            <div>

                <div className="section">
                <AccountData
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
                accountIndex={0}
                units="ether"
                precision={3}
                render={({ address, balance, units }) => (
                    <div>
                    <div>My Address: <span style={{ color: "red" }}>{address}</span></div>
                    <div>My Ether: <span style={{ color: "red" }}>{balance}</span> {units}</div>
                    </div>
                )}
                />
                </div>

                { 
                    decimals &&
                    <div className="section">
                    <ContractData
                        drizzle={this.props.drizzle}
                        drizzleState={this.props.drizzleState}
                        contract="ZastrinToken"
                        method="balanceOf"
                        methodArgs={[this.props.drizzleState.accounts[0]]}
                        render={ data => (
                            <div>My ZastrinStableToken: <span style={{ color: "red" }}>{data/(10**decimals.value)}</span>{" "}ZST</div>
                        )}
                    />
                    </div>
                }

                <div className="section">
                    <h2>Mint ZastrinStableToken Here:</h2>
                    <p>1 ether = 100 ZST</p>
                    <input type="number" onKeyDown={this.handleKeyDown} placeholder="Enter amount of ether"/>
                </div>
                    
                {
                    decimals &&    
                    <div className="section">
                        <h2 className="mt-5">Approve ZST here:</h2>
                        <form data-message={decimals.value} onSubmit={this.handleApprove}>
                            <div className="form-group">
                                <label htmlFor="spender">Spender</label>
                                <input type="text" name="Spender" className="form-control" id="spender" placeholder="Address of spender" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="amount">Amount</label>
                                <input type="number" name="Amount" className="form-control" id="amount" placeholder="Amount of ZST to approve" />
                            </div>
                            <input type="submit" value="Submit" />
                        </form>
                    </div> 
                }                   

            </div>
        );
    }
};

export default Home;