pragma solidity >=0.5.0 <0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract TokenGenerator is ERC20, ERC20Detailed {
    using SafeMath for uint;

    uint public etherCollected;

    constructor() ERC20Detailed("Zastrin", "ZTC", 0) public {
        etherCollected = 0;
    }

    function tokenGenerator() public payable {
        uint amountToBeMinted = msg.value.mul(100);        // 1 ether = 100 stable coins
        _mint(msg.sender, amountToBeMinted);
        etherCollected.add(msg.value);                     // keeping record of total ethers collected
        emit Generated(msg.sender, amountToBeMinted);
    }

    event Generated(address indexed from, uint amount);
}