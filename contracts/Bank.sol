pragma solidity >=0.5.0 <0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Bank {
    using SafeMath for uint;
    ERC20 public token;

    // A user defined data type for proposals
    struct Proposal {
        string Type;
        uint duration;
        uint interest;
        uint lendingAmount;
        uint collateralAmount;
        uint id;
        address lender;
        address borrower;
        uint timestamp;
        uint totalRepaymentMade;
    }
    
    Proposal[] listOfProposals;
    Proposal[] listOfActiveProposals;

    constructor(address _tokenAddress) public {
        token = ERC20(_tokenAddress);
    }

    // Getter function for listOfProposals
    function getListOfProposals() public view returns (Proposal[]) {
        return listOfProposals;
    }

    // Getter function for listOfActiveProposals
    function getListOfActiveProposals() public view returns (Proposal[]) {
        return listOfActiveProposals;
    }

    // function to create a new proposal by lender or borrower
    function createProposal(string memory _type, uint _duration, uint _interest, uint _lendingAmount,
                            uint _collateralAmount, address _creator) public payable returns (bool) {
        if(_type == "Lend")
            msg.sender.token.transfer(address(this), _lendingAmount);

        uint len = listOfProposals.length;
        if(_type == "Lend") {
            listOfProposals.push(Proposal(_type, _duration, _interest, _lendingAmount,
                                        _collateralAmount, len, msg.sender, 0x0, 0, 0));
        } else {
            listOfProposals.push(Proposal(_type, _duration, _interest, _lendingAmount,
                                        _collateralAmount, len, 0x0, msg.sender, 0, 0));
        }

        return true;
    }

    // function to delete a proposal
    function deleteProposal(uint _id) public payable returns (bool) {
        Proposal lastProposal = listOfProposals[listOfProposals.length - 1];   // idea is to place last proposal at
        delete listOfProposals[_id];                                          // the newly generated gap
        listOfProposals[_id] = lastProposal;
        listOfProposals[_id].id = _id;

        return true;
    }

    // function to conclude a proposal
    function concludeProposal(uint _id) public payable{
        if(listOfProposals[_id].Type == "Lend") {
            token.transfer(msg.sender, _lendingAmount);
        } else {
            msg.sender.transfer(listOfProposals[_id].creator, listOfProposals[_id].lendingAmount);
        }
        listOfProposals[_id].secondParty = msg.sender;
        listOfProposals[_id].timestamp = now;
        listOfActiveProposals.push(listOfProposals[_id]);
        uint len = listOfActiveProposals.length;
        listOfActiveProposal[len-1].id = len-1;
        deleteProposal(_id);
    }

    // function to update a proposal
    function updateProposal(uint _id, uint _duration, uint _interest, uint _lendingAmount,
                            uint _collateralAmount) public payable returns (bool) {
        if(listOfProposals[_id].Type == "Lend") {
            listOfProposals[_id].duration = _duration;
            listOfProposals[_id].interest = _interest;
            listOfProposals[_id].collateralAmount = _collateralAmount;
            if(_lendingAmount > listOfProposals[_id].lendingAmount) {
                msg.sender.token.transfer(address(this), _lendingAmount - listOfProposals[_id].lendingAmount)
            } else if(_lendingAmount < listOfProposals[_id].lendingAmount) {
                token.transfer(msg.sender, listOfProposals[_id].lendingAmount - _lendingAmount);
            }
            listOfProposals[_id].lendingAmount = _lendingAmount;
        } else {
            listOfProposals[_id].duration = _duration;
            listOfProposals[_id].interest = _interest;
            listOfProposals[_id].lendingAmount = _lendingAmount;
            if(_collateralAmount < listOfProposals[_id].collateralAmount) {
                msg.sender.transfer(listOfProposals[_id].collateralAmount - _collateralAmount);
            }
            listOfProposals[_id].collateralAmount = _collateralAmount;
        }
    }

    // function to liquidate the collateral
    function liquidate(uint _id) payable {
        uint amountToBeMinted = listOfActiveProposal[_id].collateralAmount.mul(100);
        token._mint(listOfActiveProposal[_id].lender, amountToBeMinted);
        Proposal lastProposal = listOfActiveProposal[listOfActiveProposal.length - 1];   // idea is to place last proposal at
        delete listOfActiveProposal[_id];                                          // the newly generated gap
        listOfActiveProposal[_id] = lastProposal;
        listOfActiveProposal[_id].id = _id;
    }

    // function to pay interest
    function payInterest(uint _id, uint _interestAmount) public {
        msg.sender.token.transfer(listOfActiveProposal[_id].lender, _interestAmount);
        listOfActiveProposal[_id].totalRepaymentMade += 1;
    }

    // functon to pay base amount to lender and end the agreement
    function finalPayment(uint _id, uint _baseAmount) public payable {
        msg.sender.token.transfer(listOfActiveProposal[_id].lender, _interestAmount);
        listOfActiveProposal[_id].borrower.transfer(listOfActiveProposal[_id].collateralAmount);
        Proposal lastProposal = listOfActiveProposal[listOfActiveProposal.length - 1];   // idea is to place last proposal at
        delete listOfActiveProposal[_id];                                          // the newly generated gap
        listOfActiveProposal[_id] = lastProposal;
        listOfActiveProposal[_id].id = _id;
    }

}

// issue in delete logic