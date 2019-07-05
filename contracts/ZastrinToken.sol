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
        require(msg.value == (value * 1 ether), "Please send entered amount!");
            
        uint amountToBeMinted = msg.value.div(tokenPrice);
        uint decimals = decimals();

        _mint(msg.sender, amountToBeMinted * 10**decimals);
        emit ZastrinTokenMinted(msg.sender, amountToBeMinted * 10**decimals);
        return amountToBeMinted * 10**decimals;
    }

    event ZastrinTokenMinted(address indexed to, uint amount);
}