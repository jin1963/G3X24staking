let web3;
let contract;
let tokenContract;
let user;

const contractAddress = "0xd08a3b6c2497394c65a19137b71ef246403b1a6b"; // G3X24 Staking Contract Address
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";   // G3X Token Address

const abi = [ 
  {"inputs":[{"internalType":"address","name":"_g3xToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[{"internalType":"uint16","name":"","type":"uint16"}],"name":"aprByTier","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"depositRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"g3xToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getStakeCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getStakeInfo","outputs":[{"internalType":"uint112","name":"amount","type":"uint112"},{"internalType":"uint32","name":"startTime","type":"uint32"},{"internalType":"uint32","name":"unlockTime","type":"uint32"},{"internalType":"uint16","name":"durationDays","type":"uint16"},{"internalType":"uint16","name":"apr","type":"uint16"},{"internalType":"bool","name":"claimed","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"rewardPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint16","name":"duration","type":"uint16"},{"internalType":"uint16","name":"newApr","type":"uint16"}],"name":"setAPR","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint16","name":"duration","type":"uint16"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"stakeCounts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalStaked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"unstake","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userStakes","outputs":[{"internalType":"uint112","name":"amount","type":"uint112"},{"internalType":"uint32","name":"startTime","type":"uint32"},{"internalType":"uint32","name":"unlockTime","type":"uint32"},{"internalType":"uint16","name":"durationDays","type":"uint16"},{"internalType":"uint16","name":"apr","type":"uint16"},{"internalType":"bool","name":"claimed","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawExcess","outputs":[],"stateMutability":"nonpayable","type":"function"}
];

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        user = accounts[0];
        contract = new web3.eth.Contract(abi, contractAddress);
        tokenContract = new web3.eth.Contract([
            {"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"type":"function"}
        ], tokenAddress);
        document.getElementById("status").innerText = "✅ Connected: " + user;
    } else {
        alert("Please install MetaMask!");
    }
});

document.getElementById("connectWallet").onclick = async () => {
    if (window.ethereum) {
        await ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        user = accounts[0];
        document.getElementById("status").innerText = "✅ Connected: " + user;
    }
};

document.getElementById("approveBtn").onclick = async () => {
    const amount = document.getElementById("stakeAmount").value;
    const weiAmount = web3.utils.toWei(amount, "ether");
    await tokenContract.methods.approve(contractAddress, weiAmount).send({ from: user });
    alert("✅ Approved!");
};

document.getElementById("stakeBtn").onclick = async () => {
    const amount = document.getElementById("stakeAmount").value;
    const tier = document.getElementById("stakeTier").value;
    const weiAmount = web3.utils.toWei(amount, "ether");
    await contract.methods.stake(weiAmount, parseInt(tier)).send({ from: user });
    alert("✅ Staked!");
};

document.getElementById("claimBtn").onclick = async () => {
    await contract.methods.claim(0).send({ from: user });
    alert("✅ Reward Claimed!");
};

document.getElementById("unstakeBtn").onclick = async () => {
    await contract.methods.unstake(0).send({ from: user });
    alert("✅ Unstaked!");
};
