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
        address creator;
    }
    
    Proposal[] listOfProposals;
    Proposal[] listOfActiveProposals;

    constructor(address _tokenAddress) public {
        token = ERC20(_tokenAddress);
    }

    // function to create a new proposal by lender or borrower
    function createProposal(string memory _type, uint _duration, uint _interest, uint _lendingAmount,
                            uint _collateralAmount, address _creator) public payable returns (bool) {
        if(_type == "Lend")
            token.transfer(address(this), _lendingAmount);

        uint len = listOfProposals.length();
        listOfProposals[len] = Proposal(_type, _duration, _interest, _lendingAmount,
                                        _collateralAmount, len, msg.sender);

        return true;
    }

    // function to delete a proposal
    function deleteProposal(uint _id) public payable returns (bool) {
        Proposal lastProposal = listOfProposals[listOfProposals.length()-1];  // idea is to place last proposal at 
        delete listOfProposals[_id];                                          // the newly generated gap
        listOfProposals[_id] = lastProposal;
        listOfProposals[_id].id = _id;

        return true;
    }

    // function to conclude a proposal
    // function to update a proposal

}