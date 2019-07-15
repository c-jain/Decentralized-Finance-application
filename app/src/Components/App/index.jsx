import React from "react";
import { Route } from "react-router-dom";
import { ethers } from "ethers";


import Bank from "../Bank";
/*
import ListProposals from "../ListProposals"; */
import Home from "../Home/index";
import Navbar from "../Navbar/index"; 

const ethersjs = {
    httpProvider: {},
    address: '',
    ABI: [],
    instance: null, 
}


class App extends React.Component {
    constructor() {
        super();

        this.state = {
            decimalKey: null,
            decimals: null,
            stackId: null,
            proposals: []
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

    approve = () => {
        console.log('Hello');
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.ZastrinToken;
        contract.methods["approve"].cacheSend(drizzle.contracts.Bank.address, (10000 * 10**this.state.decimals).toString(16), { from: drizzleState.accounts[0] });
    }

    updateProposals = async () => {
        const proposals = await ethersjs.instance.getProposals();
        if(proposals !== this.state.proposals) {
            this.setState({
                proposals: proposals
            });
        }                
    };

    componentDidMount() {
        console.log(this.props.drizzle);
        console.log(this.props.drizzleState);
        const { drizzle } = this.props;

        // Creating bank contract instance using ethers.js and fetching the proposals
        ethersjs.httpProvider = new ethers.providers.JsonRpcProvider();
        ethersjs.address = drizzle.contracts.Bank.address;
        ethersjs.ABI = drizzle.contracts.Bank.abi;
        ethersjs.instance = new ethers.Contract(ethersjs.address, ethersjs.ABI, ethersjs.httpProvider);
        const proposals = ethersjs.instance.getProposals();
        proposals.then(result => {
            this.setState({proposals: result});
            console.log(result);
        });        

        // Getting decimal variable data key for using it later
        const contract = drizzle.contracts.ZastrinToken;
        const decimalKey = contract.methods["decimals"].cacheCall();
        this.setState({ decimalKey });
        

    }

    render() {
        // Fetching decimal value of ZST through it's datakey
        const { ZastrinToken } = this.props.drizzleState.contracts;
        const decimals = ZastrinToken.decimals[this.state.decimalKey];
        if(decimals) {
            if(decimals.value !== this.state.decimals) {
                this.setState({ decimals: decimals.value});
            }
        }

        // Updating proposals
        const { transactions, transactionStack } = this.props.drizzleState;
        const txHash = transactionStack[this.state.stackId];
        if(txHash && transactions[txHash] && transactions[txHash].status === 'success') {
            this.updateProposals();
        }

        return (
            <div>
                <Navbar />
                 
                <Route 
                    exact
                    path="/"
                    render={
                        props => (
                        <Home 
                            {...props}
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                            decimal={this.state.decimals}
                            mint={this.mint}
                        />
                        )
                    }
                />
                
                <Route 
                    path="/Bank"
                    render={
                        props => (
                        <Bank 
                            {...props}
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                            approve={this.approve}
                        />
                        )
                    }
                />
                
            </div>
        );
    }

};

export default App;