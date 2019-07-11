import React from 'react';
import Contract from '../Service/index';
import { newContextComponents } from "drizzle-react-components";

const { AccountData, ContractData, ContractForm } = newContextComponents;


class Create extends React.Component {
    state = {
        proposals: []
    };

    componentDidMount() {
        var proposal = Contract.getProposals();
        proposal.then(result => {
            console.log(result);
            this.setState({proposals: result});
        });
    }

    updateProposal = async (event) => {
      event.preventDefault();
      const { drizzle, drizzleState } = this.props;
      const contract = drizzle.contracts.Bank;
      const proposal = this.state.proposals[event.target.Id.value];

      if(proposal.proposalType === 0) {
        // Lending update
        const StackId = contract.methods["updateProposal"].cacheSend(event.target.Id.value, event.target.Duration.value,
                                                                     event.target.Interest.value, event.target.Amount.value,
                                                                     event.target.Collateral.value, { from: drizzleState.accounts[0] });

      } else {
          //borrowing update
          let Value = event.target.Collateral.value - parseInt(proposal.collateralAmount._hex, 16);
          const remainingCollateral =  Value > 0 ? Value : 0;

          const StackId = contract.methods["updateProposal"].cacheSend(event.target.Id.value, event.target.Duration.value,
                                                                       event.target.Interest.value, event.target.Amount.value,
                                                                       event.target.Collateral.value, { from: drizzleState.accounts[0], value: drizzle.web3.utils.toWei(remainingCollateral.toString())
                                                                        });
      }

      console.log('successfull');
    }
    
    createProposal = event => {
        event.preventDefault();
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Bank;

        if(event.target.Type.value === 'lending') {
            const StackId = contract.methods["createProposal"].cacheSend(drizzle.web3.utils.asciiToHex(event.target.Type.value), event.target.Duration.value,
                                                               event.target.Interest.value, event.target.Amount.value,
                                                               event.target.Collateral.value, { from: drizzleState.accounts[0] });
        } else if(event.target.Type.value === 'borrowing') {
            const StackId = contract.methods["createProposal"].cacheSend(drizzle.web3.utils.asciiToHex(event.target.Type.value), event.target.Duration.value,
                                                                        event.target.Interest.value, event.target.Amount.value,
                                                                        event.target.Collateral.value, { from: drizzleState.accounts[0], value: drizzle.web3.utils.toWei(event.target.Collateral.value.toString())
                                                                        });
        }

        console.log('successfull');
    }

    render() {
        return (
            <div>
                {/* Form to create a new proposal */}
                <div className="section">
                    <h2 className="mt-5">Create Proposal here:</h2>
                    <form onSubmit={this.createProposal}>
                        <div className="form-group">
                            <label htmlFor="type">Type</label>
                            <input type="text" name="Type" className="form-control" id="type" placeholder="lending or borrowing" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="duration">Duration</label>
                            <input type="number" name="Duration" className="form-control" id="duration" placeholder="e.g 1 (in months)" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="interest">Interest</label>
                            <input type="number" name="Interest" className="form-control" id="interest" placeholder="e.g 5 (integer)" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="amount">Lending Amount</label>
                            <input type="number" name="Amount" className="form-control" id="amount" placeholder="Amount of ZST" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="collateral">Collateral Amount</label>
                            <input type="number" name="Collateral" className="form-control" id="collateral" placeholder="Amount of Ether" />
                        </div>
                        <input type="submit" value="Submit" />
                    </form>
                </div>

                {/* Form to update a existing proposal */}
                <div className="section">
                    <h2 className="mt-5">Update Proposal here:</h2>
                    <form onSubmit={this.updateProposal}>
                        <div className="form-group">
                            <label htmlFor="id">Proposal Id</label>
                            <input type="number" name="Id" className="form-control" id="id" placeholder="enter unique proposal id" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="duration">New Duration</label>
                            <input type="number" name="Duration" className="form-control" id="duration" placeholder="e.g 1 (in months)" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="interest">New Interest</label>
                            <input type="number" name="Interest" className="form-control" id="interest" placeholder="e.g 5 (integer)" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="amount">New Lending Amount</label>
                            <input type="number" name="Amount" className="form-control" id="amount" placeholder="Amount of ZST" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="collateral">New Collateral Amount</label>
                            <input type="number" name="Collateral" className="form-control" id="collateral" placeholder="Amount of Ether" />
                        </div>
                        <input type="submit" value="Submit" />
                    </form>
                </div>

                {/* Form to pay monthly payment */}
                <div className="section mt-5">
                  <h2>Pay Monthly loan payment here:</h2>
                  <ContractForm
                    drizzle={this.props.drizzle}
                    drizzleState={this.props.drizzleState}
                    contract="Bank"
                    method="payInterest"
                    sendArgs={{ from: this.props.drizzleState.accounts[0] }}
                    labels={["Enter Proposal Id"]}
                  />
                </div>

                {/* Form to pay final lending amount */}
                <div className="section mt-5">
                  <h2>Pay lending amount here and end the agreement:</h2>
                  <ContractForm
                    drizzle={this.props.drizzle}
                    drizzleState={this.props.drizzleState}
                    contract="Bank"
                    method="finalPayment"
                    sendArgs={{ from: this.props.drizzleState.accounts[0] }}
                    labels={["Enter Proposal Id"]}
                  />
                </div>

            </div>
        );
    }
};

export default Create;