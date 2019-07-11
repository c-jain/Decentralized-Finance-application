import React from 'react';
import contract from '../Service/index';

class List extends React.Component {
    state = {
        proposals: [],
        proposalStatus: 0,
        status: 'Unaccepted',
        deleteStackId: null,
        acceptStackId: null,
        liquidateStackId: null
    };

    delete = (id) => {
      console.log(id);
      const { drizzle, drizzleState } = this.props;
      const contract = drizzle.contracts.Bank;
      const deleteStackId = contract.methods["deleteProposal"].cacheSend(id, {from: drizzleState.accounts[0]});
 
      this.setState({ deleteStackId });   
    }

    accept = (id) => {
      console.log(id);
      const { drizzle, drizzleState } = this.props;
      const contract = drizzle.contracts.Bank;
      
      const collateral = parseInt(this.state.proposals[id].proposalType._hex, 16) === 0 ? parseInt(this.state.proposals[id].collateralAmount._hex) : 0;
      
      const acceptStackId = contract.methods["acceptProposal"].cacheSend(id, { from: drizzleState.accounts[0], value: drizzle.web3.utils.toWei(collateral.toString())
      });
 
      this.setState({ acceptStackId });
    }

    liquidate = (id) => {
        console.log(id);
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Bank;
        const liquidateStackId = contract.methods["liquidate"].cacheSend(id, {from: drizzleState.accounts[0]});
   
        this.setState({ liquidateStackId });
      }

    changeStatus = () => {
        let status = this.state.status === 'Unaccepted'? 'Accepted' : 'Unaccepted';
        this.setState({ status });
    }

    componentDidMount() {
        var proposal = contract.getProposals();
        proposal.then(result => {
            console.log(result);
            this.setState({proposals: result});
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.changeStatus}>{this.state.status}</button>
                <div>
                  <ul className="list-group">
                    {
                        this.state.status === 'Unaccepted' &&
                        this.state.proposals.map(item => (
                            item.status === 0 &&
                            <li key={item.id._hex} className="list-group-item">
                             <button className="btn-sm mr-4 btn btn-info" onClick={() => this.accept(parseInt(item.id._hex))}>Accept</button>
                             <div style={{color: "green"}}>Type: <span style={{color: "red"}}>{item.proposalType === 0 ? "Lend" : "Borrow"}</span></div>
                             <div style={{color: "green"}}>Proposal ID: <span style={{color: "red"}}>{parseInt(item.id._hex, 16)}</span></div>
                             <div style={{color: "green"}}>Lending Amount: <span style={{color: "red"}}>{parseInt(item.amount._hex, 16)}</span> ZST</div>
                             <div style={{color: "green"}}>Collateral Amount: <span style={{color: "red"}}>{parseInt(item.collateralAmount._hex, 16)}</span> ether</div>
                             <div style={{color: "green"}}>Duration: <span style={{color: "red"}}>{parseInt(item.duration._hex, 16)}</span> Month</div>
                             <div style={{color: "green"}}>Monthly Payment: <span style={{color: "red"}}>{(parseInt(item.amount._hex, 16) * parseInt(item.interest._hex, 16))/100}</span> ZST @<span style={{color: "red"}}>{parseInt(item.interest._hex, 16)}</span>%</div>
                             <button className="btn-sm ml-4 btn btn-danger" onClick={() => this.delete(parseInt(item.id._hex))}>Delete</button>
                            </li>
                        ))
                    }
                    {
                        this.state.status === 'Accepted' &&
                        this.state.proposals.map(item => (
                            item.status === 1 &&
                            <li key={item.id._hex} className="list-group-item">
                             <div style={{color: "green"}}>Lender: <span style={{color: "red"}}>{item.lender}</span></div>
                             <div style={{color: "green"}}>Borrower: <span style={{color: "red"}}>{item.borrower}</span></div>
                             <div style={{color: "green"}}>Proposal ID: <span style={{color: "red"}}>{parseInt(item.id._hex, 16)}</span></div>
                             <div style={{color: "green"}}>Lending Amount: <span style={{color: "red"}}>{parseInt(item.amount._hex, 16)}</span> ZST</div>
                             <div style={{color: "green"}}>Collateral Amount: <span style={{color: "red"}}>{parseInt(item.collateralAmount._hex, 16)}</span> ether</div>
                             <div style={{color: "green"}}>Duration: <span style={{color: "red"}}>{parseInt(item.duration._hex, 16)}</span> Month</div>
                             <div style={{color: "green"}}>Monthly Payment: <span style={{color: "red"}}>{(parseInt(item.amount._hex, 16) * parseInt(item.interest._hex, 16))/100}</span> ZST @<span style={{color: "red"}}>{parseInt(item.interest._hex, 16)}</span>%</div>
                             <div style={{color: "green"}}>Monthly Payment Completed: <span style={{color: "red"}}>{parseInt(item.totalMonthlyPaymentCompleted._hex, 16)}</span></div>
                             <button className="btn-sm ml-4 btn btn-danger" onClick={() => this.liquidate(parseInt(item.id._hex))}>Liquidate</button>
                            </li>
                        ))
                    }
                  </ul>                
                </div>
            </div>
        );
    }
};

export default List;