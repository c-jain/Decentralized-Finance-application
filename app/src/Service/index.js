import { ethers } from 'ethers';

let httpProvider = new ethers.providers.JsonRpcProvider();
var address = // 'paste Bank contract address here in hexadecmal';
var abi = // paste Bank contract ABI here;

// var privateKey = '0xf11e7c582b68358adf1b6d252eb723080e8e8be2d273007ec35afd238ccda9f6';  
// var wallet = new ethers.Wallet(privateKey, httpProvider);
export default new ethers.Contract(address, abi, httpProvider);