import React from 'react';

import ListProposalsUI from './index'

class ListProposals extends React.Component {
    state = {
        status: 'Unaccepted',
        stackId: null,
    };

    changeStatus = () => {
        const status = this.state.status === 'Unaccepted'? 'Accepted' : 'Unaccepted';
        this.setState({ status });
    }

    cancel = (id) => {
        console.log(id);
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Bank;

        const stackId = contract.methods["deleteProposal"].cacheSend(id, {from: drizzleState.accounts[0]});   
        this.setState({ stackId });   
    }

    accept = (id) => {
        console.log(id);
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Bank;
        
        let collateral = this.props.proposals[id].proposalType === 0 ?
                           parseInt(this.props.proposals[id].collateralAmount._hex, 16) : 0;
        const stackId = contract.methods["acceptProposal"].cacheSend(id, { from: drizzleState.accounts[0], value: collateral });
        this.setState({ stackId });
    }

    liquidate = (id) => {
        console.log(id);
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Bank;

        const stackId = contract.methods["liquidate"].cacheSend(id, {from: drizzleState.accounts[0]});    
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
            <ListProposalsUI 
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
                proposals={this.props.proposals}
                decimal={this.props.decimal}
                changeStatus={this.changeStatus}
                status={this.state.status}
                accept={this.accept}
                cancel={this.cancel}
                liquidate={this.liquidate}
            />
        );
    }
};

export default ListProposals;