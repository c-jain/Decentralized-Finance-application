import React from "react";
import { Route } from "react-router-dom";
import { ethers } from "ethers";


import Bank from "../Bank/Bank";
import ListProposals from "../ListProposals/ListProposals";
import Home from "../Home/index";
import Navbar from "../Navbar/index"; 




class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            decimalKey: null,
            bankInstance: null,
            proposals: [],
            previousTxHash: '',
        };
    }

    mint = event => {
        event.preventDefault();
        console.log(event.target.Amount.value);
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.ZastrinToken;
        
        // This is the way to do a transaction
        contract.methods["mintTokens"].cacheSend(drizzle.web3.utils.toWei(event.target.Amount.value.toString()), {
            from: drizzleState.accounts[0], value: drizzle.web3.utils.toWei(event.target.Amount.value.toString())
        });
    };    

    updateProposals = async (txHash) => {
        const proposals = await this.state.bankInstance.getProposals();
        this.setState({
            proposals: proposals,
            previousTxHash: txHash,
        });
        console.log(this.state.proposals);
    };

    async componentDidMount() {
        console.log(this.props.drizzle);
        console.log(this.props.drizzleState);
        const { drizzle } = this.props;

        // Creating bank contract instance using ethers.js and fetching the proposals
        const httpProvider = new ethers.providers.JsonRpcProvider();
        const address = drizzle.contracts.Bank.address;
        const ABI = drizzle.contracts.Bank.abi;
        const instance = new ethers.Contract(address, ABI, httpProvider);
        const proposals = await instance.getProposals();
        this.setState({
            proposals: proposals,
            bankInstance: instance
        });
        console.log(proposals);       

        // Getting decimal variable data key for using it later
        const contract = drizzle.contracts.ZastrinToken;
        const decimalKey = contract.methods["decimals"].cacheCall();
        this.setState({ decimalKey });
    }

    render() {
        // Fetching decimal value of ZST through it's datakey
        const { ZastrinToken } = this.props.drizzleState.contracts;
        const decimals = ZastrinToken.decimals[this.state.decimalKey];

        return (
            <div>
                <Navbar />
                 
                {
                    decimals &&
                    <Route 
                        exact
                        path="/"
                        render={
                            props => (
                            <Home 
                                {...props}
                                drizzle={this.props.drizzle}
                                drizzleState={this.props.drizzleState}
                                decimal={decimals.value}
                                mint={this.mint}
                            />
                            )
                        }
                    />
                }
                
                {
                    decimals &&
                    <Route 
                        path="/Bank"
                        render={
                            props => (
                            <Bank 
                                {...props}
                                drizzle={this.props.drizzle}
                                drizzleState={this.props.drizzleState}
                                updateProposals={this.updateProposals}
                                decimal={decimals.value}
                                proposals={this.state.proposals}
                                previousTxHash={this.state.previousTxHash}
                            />
                            )
                        }
                    />
                }

                {
                    decimals &&
                    <Route 
                        path="/listproposals"
                        render={
                            props => (
                            <ListProposals 
                                {...props}
                                drizzle={this.props.drizzle}
                                drizzleState={this.props.drizzleState}
                                updateProposals={this.updateProposals}
                                previousTxHash={this.state.previousTxHash}
                                decimal={decimals.value}
                                proposals={this.state.proposals}
                            />
                            )
                        }
                    />
                }
                
            </div>
        );
    }

};

export default App;