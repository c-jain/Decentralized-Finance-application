import React from 'react';

import BankUI from './index';

class Bank extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stackId: null,
        };
    }

    approve = () => {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.ZastrinToken;
        contract.methods["approve"].cacheSend(drizzle.contracts.Bank.address, (10000 * 10**this.props.decimal).toString(16),
                                              { from: drizzleState.accounts[0] });
    }

    create = event => {
        event.preventDefault();
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Bank;

        const collateral = drizzle.web3.utils.toWei(event.target.Collateral.value.toString());
        const amount = event.target.Amount.value * 10**this.props.decimal;
        let stackId = null;

        if(event.target.Type.value === 'lending') {
            stackId = contract.methods["createProposal"].cacheSend(drizzle.web3.utils.asciiToHex(event.target.Type.value),
                                                                   event.target.Duration.value,
                                                                   event.target.Interest.value,
                                                                   amount, collateral,
                                                                   { from: drizzleState.accounts[0] });
        } else if(event.target.Type.value === 'borrowing') {
            stackId = contract.methods["createProposal"].cacheSend(drizzle.web3.utils.asciiToHex(event.target.Type.value),
                                                                   event.target.Duration.value, event.target.Interest.value,
                                                                   amount, collateral,
                                                                   { from: drizzleState.accounts[0], value: collateral });
        }
        this.setState({ stackId });
    }

    update = async (event) => {
        event.preventDefault();
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Bank;

        const oldCollateral = parseInt(this.props.proposals[event.target.Id.value].collateralAmount._hex, 16);        
        const collateral = drizzle.web3.utils.toWei(event.target.Collateral.value.toString());
        const amount = event.target.Amount.value * 10**this.props.decimal;
        let stackId = null;
  
        if(this.props.proposals[event.target.Id.value].proposalType === 0) {
            // Lending update
            stackId = contract.methods["updateProposal"].cacheSend(event.target.Id.value, event.target.Duration.value,
                                                                   event.target.Interest.value, amount,
                                                                   collateral, { from: drizzleState.accounts[0] });  
        } else {
            //borrowing update
            const remainingCollateral =  collateral - oldCollateral > 0 ? collateral - oldCollateral : 0;
  
            stackId = contract.methods["updateProposal"].cacheSend(event.target.Id.value, event.target.Duration.value,
                                                                         event.target.Interest.value, amount,
                                                                         collateral, { from: drizzleState.accounts[0],
                                                                         value: remainingCollateral });
        }
        this.setState({ stackId });
    }

    render() {
        // Updating proposals
        const { transactions, transactionStack } = this.props.drizzleState;
        const txHash = transactionStack[this.state.stackId];
        if(txHash && transactions[txHash] && transactions[txHash].status === 'success' && this.props.previousTxHash !== txHash) {
            this.props.updateProposals(txHash);
        }

        return (
            <BankUI 
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
                approve={this.approve}
                create={this.create}
                update={this.update}
            />
        );
    }
};

export default Bank;