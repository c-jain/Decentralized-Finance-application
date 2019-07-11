pragma solidity >=0.5.0 <0.6.0;
pragma experimental ABIEncoderV2; // This allow's us to implement Proposal type arrays Getter function.

import "./ZastrinToken.sol";    // we are importing this inorder to use mintTokens function
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Bank {
    using SafeMath for uint;

    enum ProposalType {Lending, Borrowing}
    enum Status {Unaccepted, Accepted, Deleted, Completed}

    // A user defined data type for proposals
    struct Proposal {
        ProposalType proposalType;
        Status status;
        uint duration;
        uint interest;
        uint amount;
        uint collateralAmount;
        uint id;
        uint acceptTime;
        uint totalMonthlyPaymentCompleted;
        address lender;
        address borrower;
    }

    ZastrinToken public token;
    uint public Id;  // Id for proposals
    Proposal[] Proposals;  // List of all proposals
    uint decimals; // No. of decimals

    constructor(address _tokenAddress, uint _id) public {
        token = ZastrinToken(_tokenAddress);
        Id = _id;
        decimals = token.decimals();
    }

    // Getter function for Proposals
    function getProposals() public view returns (Proposal[] memory) {
        return Proposals;
    }

    // Modifier to check validity of a proposal id
    modifier onlyValidProposal(uint _id) {
        require(_id < Id, 'Invalid Id');
        _;
    }

    // Function to create a new proposal by lender or borrower
    function createProposal(bytes32 _type, uint _duration, uint _interest, uint _amount,
                            uint _collateralAmount) public payable returns (bool) {
        require(_type == 'lending' || _type == 'borrowing', 'Select a valid type');

        if(_type == 'lending') {

            require(token.allowance(msg.sender, address(this)) >= _amount * 10**decimals, 'Allow bank to deduct lending amount');

            require(token.transferFrom(msg.sender, address(this), _amount * 10**decimals), "Problem in depositing lending amount!");

            Proposals.push(Proposal(ProposalType.Lending, Status.Unaccepted, _duration, _interest, _amount,
                                        _collateralAmount, Id++, 0, 0, msg.sender, address(0)));

        } else if(_type == 'borrowing') {

            require(msg.value == _collateralAmount * 1 ether, "Send entered amount");

            Proposals.push(Proposal(ProposalType.Borrowing, Status.Unaccepted, _duration, _interest, _amount,
                                        _collateralAmount, Id++, 0, 0, address(0), msg.sender));
        }
        return true;
    }

    // Function to accept a proposal
    function acceptProposal(uint _id) public payable onlyValidProposal(_id) returns (bool) {
        require(Proposals[_id].status == Status.Unaccepted, "You cann't accept this proposal");

        if(Proposals[_id].proposalType == ProposalType.Lending) {

            require(msg.sender != Proposals[_id].lender, "You can not accept your own proposal");

            require(msg.value == Proposals[_id].collateralAmount * 1 ether, "Transfered collateral is unacceptable");

            require(token.transfer(msg.sender, Proposals[_id].amount * 10**decimals), "Problem in transfering lending amount!");

            Proposals[_id].borrower = msg.sender;  // Updating borrower

        } else if(Proposals[_id].proposalType == ProposalType.Borrowing) {

            require(msg.sender != Proposals[_id].borrower, "You can not accept your own proposal");

            require(token.allowance(msg.sender, address(this)) >= Proposals[_id].amount * 10**decimals, 'Allow bank to deduct lending amount');

            require(token.transferFrom(msg.sender, Proposals[_id].borrower, Proposals[_id].amount * 10**decimals), "Problem in transfering lending amount!");

            Proposals[_id].lender = msg.sender;  // Updating lender
        }

        // updating acceptTime and status
        Proposals[_id].acceptTime = now;
        Proposals[_id].status = Status.Accepted;

        return true;
    }

    // Function to pay monthly loan
    function payInterest(uint _id) public onlyValidProposal(_id) returns (bool) {

        require(Proposals[_id].status == Status.Accepted, "You cann't pay for this proposal");

        require(msg.sender == Proposals[_id].borrower, 'You are not suppose to pay!');

        require(Proposals[_id].totalMonthlyPaymentCompleted < Proposals[_id].duration, 'You completed all monthly loan payments!');

        // We do not divide it by 100 instead multiply by 10^(18-2)
        uint amountToPay = (Proposals[_id].amount * Proposals[_id].interest)*(10**(decimals - 2));
        require(token.allowance(msg.sender, address(this)) >= amountToPay, 'Allow bank to deduct interest amount!');

        require(token.transferFrom(msg.sender, Proposals[_id].lender, amountToPay), 'Problem in transfering the monthly loan payment!');

        Proposals[_id].totalMonthlyPaymentCompleted += 1;
        return true;
    }

    // Functon to pay base amount to lender and end the agreement
    function finalPayment(uint _id) public payable onlyValidProposal(_id) returns (bool){

        require(Proposals[_id].status == Status.Accepted, "You cann't pay for this proposal");

        require(msg.sender == Proposals[_id].borrower, 'You are not suppose to pay!');

        require(Proposals[_id].totalMonthlyPaymentCompleted == Proposals[_id].duration, 'First complete your remaining monthly loan payments');

        require(token.allowance(msg.sender, address(this)) >= Proposals[_id].amount * 10**decimals, 'Allow bank to deduct lending amount!');

        require(token.transferFrom(msg.sender, Proposals[_id].lender, Proposals[_id].amount * 10**decimals),
                                   "Problem in transfering the lending amount!");

        address payable Borrower = address(uint160(Proposals[_id].borrower));
        Borrower.transfer(Proposals[_id].collateralAmount * 1 ether);

        // Updating status
        Proposals[_id].status = Status.Completed;
        return true;
    }

    // Function to liquidate the collateral
    function liquidate(uint _id) public payable onlyValidProposal(_id) returns (bool) {
        require(Proposals[_id].status == Status.Accepted, "You cann't liquidate this proposal");

        // Main logic to liquidate collateral
        uint timepassed = now - Proposals[_id].acceptTime;
        require((timepassed > (Proposals[_id].duration * 30 days)) ||
               (((Proposals[_id].totalMonthlyPaymentCompleted * 30 + 30) * 1 days) < timepassed),
                "You cann't liquidate now!");

        // liquidate
        uint generatedTokens = token.mintTokens.value(Proposals[_id].collateralAmount * 1 ether)(Proposals[_id].collateralAmount * 1 ether);
        require(token.transfer(Proposals[_id].lender, generatedTokens), 'Problem in liqidating!');

        // Updating status
        Proposals[_id].status = Status.Completed;

        return true;
    }

    // Function to delete a proposal
    function deleteProposal(uint _id) public payable onlyValidProposal(_id) returns (bool) {
        require(Proposals[_id].status == Status.Unaccepted, "You cann't delete this proposal");

        if(Proposals[_id].proposalType == ProposalType.Lending) {

            require(Proposals[_id].lender == msg.sender, 'You are not allowed to delete this proposal');

            require(token.transfer(msg.sender, Proposals[_id].amount * 10**decimals), 'Unsuccessfull! Problem in deleting proposal');

        } else if(Proposals[_id].proposalType == ProposalType.Borrowing) {

            require(Proposals[_id].borrower == msg.sender, 'You are not allowed to delete this proposal');

            address payable Borrower = address(uint160(Proposals[_id].borrower));
            Borrower.transfer(Proposals[_id].collateralAmount * 1 ether);
        }

        Proposals[_id].status = Status.Deleted;
        return true;
    }

    // Function to update a proposal
    function updateProposal(uint _id, uint _duration, uint _interest, uint _amount,
                            uint _collateralAmount) public payable onlyValidProposal(_id) returns (bool) {
        require(Proposals[_id].status == Status.Unaccepted, "You cann't update this proposal");

        if(Proposals[_id].proposalType == ProposalType.Lending) {
            require(Proposals[_id].lender == msg.sender, 'You are not allowed to update this proposal');

            Proposals[_id].duration = _duration;
            Proposals[_id].interest = _interest;
            Proposals[_id].collateralAmount = _collateralAmount;

            if(_amount > Proposals[_id].amount) {

                require(token.allowance(msg.sender, address(this)) >= (_amount - Proposals[_id].amount) * 10**decimals, 'Allow bank to deduct extra lending amount');

                require(token.transferFrom(msg.sender, address(this),(_amount - Proposals[_id].amount) * 10**decimals), "Problem in depositing extra lending amount!");

            } else if(_amount < Proposals[_id].amount) {

                token.transfer(msg.sender, (Proposals[_id].amount - _amount) * 10**decimals);
            }
            Proposals[_id].amount = _amount;

        } else if(Proposals[_id].proposalType == ProposalType.Borrowing) {

            require(Proposals[_id].borrower == msg.sender, 'You are not allowed to update this proposal');

            Proposals[_id].duration = _duration;
            Proposals[_id].interest = _interest;
            Proposals[_id].amount = _amount;

            if(_collateralAmount < Proposals[_id].collateralAmount) {

                msg.sender.transfer((Proposals[_id].collateralAmount - _collateralAmount) * 1 ether);

            } else if(_collateralAmount > Proposals[_id].collateralAmount) {

                require(msg.value == (_collateralAmount - Proposals[_id].collateralAmount) * 1 ether, 'Send extra collateral amount');
            }
            Proposals[_id].collateralAmount = _collateralAmount;
        }
        return true;
    }
}