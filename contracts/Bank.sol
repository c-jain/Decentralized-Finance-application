pragma solidity >=0.5.0 <0.6.0;
pragma experimental ABIEncoderV2; // This allow's us to implement Proposal type arrays Getter function.

import "./TokenGenerator.sol";    // we are importing this inorder to use tokenGenerator function
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Bank {
    using SafeMath for uint;
    TokenGenerator public token;

    // A user defined data type for proposals
    struct Proposal {
        bytes32 Type;
        uint Duration;
        uint Interest;
        uint LendingAmount;
        uint CollateralAmount;
        uint Id;
        address Lender;
        address Borrower;
        uint Timestamp;
        uint TotalRepaymentMade;
    }
    
    Proposal[] Proposals;
    Proposal[] ActiveProposals;

    constructor(address _tokenAddress) public {
        token = TokenGenerator(_tokenAddress);
    }

    // Getter function for Proposals
    function getProposals() public view returns (Proposal[] memory) {
        return Proposals;
    }

    // Getter function for ActiveProposals
    function getActiveProposals() public view returns (Proposal[] memory) {
        return ActiveProposals;
    }

    // modifier to check validity of a proposal id
    modifier onlyValidProposal(uint _id) {
        require(_id < Proposals.length, 'Given Id is invalid');
        _;
    }

    // modifier to check validity of a active proposal id
    modifier onlyValidActiveProposal(uint _id) {
        require(_id < ActiveProposals.length, 'Given Id is invalid');
        _;
    }

    // function to create a new proposal by lender or borrower
    function createProposal(bytes32 _type, uint _duration, uint _interest, uint _lendingAmount,
                            uint _collateralAmount) public payable returns (bool) {
        require(_type == 'Lend' || _type == 'Borrow', 'Select a valid type');
        if(_type == 'Lend') {
            require(token.allowance(msg.sender, address(this)) >= _lendingAmount, 'Allow bank to deduct lending amount');
            require(token.transferFrom(msg.sender, address(this), _lendingAmount), "Problem in depositing lending amount!");
            uint _id = Proposals.length;
            Proposals.push(Proposal(_type, _duration, _interest, _lendingAmount,
                                        _collateralAmount, _id, msg.sender, address(0), 0, 0));

        } else if(_type == 'Borrow') {
            require(msg.value == _collateralAmount, "Collateral amount and transfered collateral are different!");
            uint _id = Proposals.length;
            Proposals.push(Proposal(_type, _duration, _interest, _lendingAmount,
                                        _collateralAmount, _id, address(0), msg.sender, 0, 0));
        }
        return true;
    }

    // function to conclude a proposal
    function concludeProposal(uint _id) public payable onlyValidProposal(_id) returns (bool) {
        if(Proposals[_id].Type == 'Lend') {
            require(msg.sender != Proposals[_id].Lender, "You can not accept your own proposal");
            require(msg.value == Proposals[_id].CollateralAmount, "Transfered collateral is unacceptable");
            require(token.transfer(msg.sender, Proposals[_id].LendingAmount), "Problem in transfering lending amount!");
            // Setting borrower and timestamp
            Proposals[_id].Borrower = msg.sender;
            Proposals[_id].Timestamp = now;

        } else if(Proposals[_id].Type == 'Borrow') {
            require(msg.sender != Proposals[_id].Borrower, "You can not accept your own proposal");
            require(token.allowance(msg.sender, address(this)) >= Proposals[_id].LendingAmount, 'Allow bank to deduct lending amount');
            require(token.transferFrom(msg.sender, Proposals[_id].Borrower, Proposals[_id].LendingAmount), "Problem in transfering lending amount!");
            // Setting lender and timestamp
            Proposals[_id].Lender = msg.sender;
            Proposals[_id].Timestamp = now;
        }
        // Adding this proposal to active proposal list
        ActiveProposals.push(Proposals[_id]);
        uint newId = ActiveProposals.length - 1;
        ActiveProposals[newId].Id = newId;

        // Deleting this proposal from list
        Proposals[_id] = Proposals[Proposals.length - 1];
        Proposals[_id].Id = _id;
        delete Proposals[Proposals.length - 1];

        return true;
    }

    // function to calculate no. of days passed after the given agreement is being concluded
    function noOfDays(uint _id) public view onlyValidActiveProposal(_id) returns (uint) {
        uint startDate = ActiveProposals[_id].Timestamp;
        uint presentDate = now;
        uint Days = (presentDate - startDate) / (60*60*24);  // Unix timestamp is in second
        return Days;
    }

    // function to pay interest
    function payInterest(uint _id) public onlyValidActiveProposal(_id) returns (bool) {
        require(msg.sender == ActiveProposals[_id].Borrower, 'You are not suppose to pay!');
        require(ActiveProposals[_id].TotalRepaymentMade < ActiveProposals[_id].Duration, 'You completed all monthly loan payments!');
        // should we allow borrower to pay after 30 days?
        // require(noOfDays(_id) <= (ActiveProposals[_id].TotalRepaymentMade + 1)*30, "You are late!");
        
        uint amountToPay = (ActiveProposals[_id].LendingAmount * ActiveProposals[_id].Interest) / 100;
        require(token.allowance(msg.sender, address(this)) >= amountToPay, 'Allow bank to deduct interest amount!');
        require(token.transferFrom(msg.sender, ActiveProposals[_id].Lender, amountToPay), 'Problem in transfering the monthly loan payment!');
        ActiveProposals[_id].TotalRepaymentMade += 1;
        return true;
    }

    // functon to pay base amount to lender and end the agreement
    function finalPayment(uint _id) public payable onlyValidActiveProposal(_id) returns (bool){
        require(msg.sender == ActiveProposals[_id].Borrower, 'You are not suppose to pay!');
        require(ActiveProposals[_id].TotalRepaymentMade == ActiveProposals[_id].Duration, 'First complete your remaining monthly loan payments');
        require(token.allowance(msg.sender, address(this)) >= ActiveProposals[_id].LendingAmount, 'Allow bank to deduct lending amount!');
        require(token.transferFrom(msg.sender, ActiveProposals[_id].Lender, ActiveProposals[_id].LendingAmount),
                                   "Problem in transfering the lending amount!");
        address payable Borrower = address(uint160(ActiveProposals[_id].Borrower));
        Borrower.transfer(ActiveProposals[_id].CollateralAmount);

        // Deleting this proposal from list
        ActiveProposals[_id] = ActiveProposals[ActiveProposals.length - 1];
        ActiveProposals[_id].Id = _id;
        delete ActiveProposals[ActiveProposals.length - 1];
        return true;
    }

    // function to liquidate the collateral
    function liquidate(uint _id) public payable onlyValidActiveProposal(_id) returns (bool) {
        uint Days = noOfDays(_id);
        require((Days > (ActiveProposals[_id].Duration * 30 + 1)) || ActiveProposals[_id].TotalRepaymentMade < Days/30, "Cann't liquidate now!");
        
        // liquidate
        uint generatedTokens = token.tokenGenerator.value(ActiveProposals[_id].CollateralAmount)(ActiveProposals[_id].CollateralAmount);
        token.transfer(ActiveProposals[_id].Lender, generatedTokens);

        // Deleting this proposal from list
        ActiveProposals[_id] = ActiveProposals[ActiveProposals.length - 1];
        ActiveProposals[_id].Id = _id;
        delete ActiveProposals[ActiveProposals.length - 1];
        return true;
    }

    // function to delete a proposal
    function deleteProposal(uint _id) public payable onlyValidProposal(_id) returns (bool) {
        if(Proposals[_id].Type == 'Lend') {
            require(Proposals[_id].Lender == msg.sender, 'You are not allowed to delete this proposal');
        } else if(Proposals[_id].Type == 'Borrow') {
            require(Proposals[_id].Borrower == msg.sender, 'You are not allowed to delete this proposal');
        }

        Proposals[_id] = Proposals[Proposals.length - 1]; // idea is to place last proposal at
        Proposals[_id].Id = _id;                          // the newly generated gap
        delete Proposals[Proposals.length - 1];
        return true;
    }

    // function to update a proposal
    function updateProposal(uint _id, uint _duration, uint _interest, uint _lendingAmount,
                            uint _collateralAmount) public payable onlyValidProposal(_id) returns (bool) {
        if(Proposals[_id].Type == 'Lend') {
            require(Proposals[_id].Lender == msg.sender, 'You are not allowed to update this proposal');
            
            Proposals[_id].Duration = _duration;
            Proposals[_id].Interest = _interest;
            Proposals[_id].CollateralAmount = _collateralAmount;
            
            if(_lendingAmount > Proposals[_id].LendingAmount) {
                require(token.allowance(msg.sender, address(this)) >= _lendingAmount - Proposals[_id].LendingAmount, 'Allow bank to deduct extra lending amount');
                require(token.transferFrom(msg.sender, address(this), _lendingAmount - Proposals[_id].LendingAmount), "Problem in depositing extra lending amount!");
            } else if(_lendingAmount < Proposals[_id].LendingAmount) {
                token.transfer(msg.sender, Proposals[_id].LendingAmount - _lendingAmount);
            }
            Proposals[_id].LendingAmount = _lendingAmount;
        } else if(Proposals[_id].Type == 'Borrow') {
            require(Proposals[_id].Borrower == msg.sender, 'You are not allowed to update this proposal');
            
            Proposals[_id].Duration = _duration;
            Proposals[_id].Interest = _interest;
            Proposals[_id].LendingAmount = _lendingAmount;
            
            if(_collateralAmount < Proposals[_id].CollateralAmount) {
                msg.sender.transfer(Proposals[_id].CollateralAmount - _collateralAmount);
            } else if(_collateralAmount > Proposals[_id].CollateralAmount) {
                require(msg.value == _collateralAmount - Proposals[_id].CollateralAmount, 'Send extra collateral amount');
            }
            Proposals[_id].CollateralAmount = _collateralAmount;
        }
        return true;
    }
}