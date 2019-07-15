pragma solidity >=0.5.0 <0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract ZastrinToken is ERC20, ERC20Detailed {
    using SafeMath for uint;
    uint public tokenPrice; // Price per token

    constructor(uint _tokenPrice) ERC20Detailed("ZastrinStableToken", "ZST", 18) public {
        tokenPrice = _tokenPrice;
    }

    function mintTokens(uint value) public payable returns (uint){
        require(msg.value == value, "Please send entered amount!");

        uint decimals = decimals();
        uint amountToBeMinted = value.div(tokenPrice) * 10**decimals;

        _mint(msg.sender, amountToBeMinted);
        emit ZastrinTokenMinted(msg.sender, amountToBeMinted);
        return amountToBeMinted;
    }

    event ZastrinTokenMinted(address indexed to, uint amount);
}