pragma solidity >=0.5.0 <0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract TokenGenerator is ERC20, ERC20Detailed, MinterRole, ERC20Mintable {
    using SafeMath for uint;

    constructor(uint256 initialSupply) ERC20Detailed("StableCoin", "STC", 18) public {
        _mint(msg.sender, initialSupply);     // deployer get some initial stable coins
        _addMinter(address(this));                     //  deployer giving authority to this contract to mint tokens
    }

    uint amountOfEtherCollected = 0;
    uint totalMintedTokens = 0;

    function tokengenerator()  public payable {
        uint amountOfEther = msg.value;                        // caller want to generate stable coins worth of msg.value
        uint amountToBeMinted = amountOfEther.mul(100);        // 1 ether = 100 stable coins
        mint(address(this), amountToBeMinted);                          // contract minting the tokens
        totalMintedTokens.add(amountToBeMinted);               // keeping record of total tokens minted till now
        transferFrom(address(this), msg.sender, amountToBeMinted);      // transfering minted token to caller
        amountOfEtherCollected.add(msg.value);                                 // keeping record of total ethers collected
    }
}