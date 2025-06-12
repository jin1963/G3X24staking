let web3;
let contract;
let token;
let user;

const stakingAddress = "0xd08a3b6c2497394c65a19137b71ef246403b1a6b";  // Smart contract ใหม่
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";  // G3X Token

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
  } else {
    alert("Please install MetaMask");
  }
});

document.getElementById("connectWallet").onclick = async () => {
  await ethereum.request({ method: "eth_requestAccounts" });
  const accounts = await web3.eth.getAccounts();
  user = accounts[0];
  contract = new web3.eth.Contract(stakingABI, stakingAddress);
  token = new web3.eth.Contract([
    {
      "constant": false,
      "inputs": [
        { "name": "_spender", "type": "address" },
        { "name": "_value", "type": "uint256" }
      ],
      "name": "approve",
      "outputs": [{ "name": "", "type": "bool" }],
      "type": "function"
    }
  ], tokenAddress);
  document.getElementById("status").innerText = `Connected: ${user}`;
};

document.getElementById("approveBtn").onclick = async () => {
  const amount = web3.utils.toWei(document.getElementById("stakeAmount").value, "ether");
  await token.methods.approve(stakingAddress, amount).send({ from: user });
  document.getElementById("status").innerText = "✅ Approved!";
};

document.getElementById("stakeBtn").onclick = async () => {
  const amount = web3.utils.toWei(document.getElementById("stakeAmount").value, "ether");
  const tier = parseInt(document.getElementById("stakeTier").value);
  await contract.methods.stake(amount, tier).send({ from: user });
  document.getElementById("status").innerText = "✅ Staked!";
};

document.getElementById("claimBtn").onclick = async () => {
  const index = document.getElementById("stakeIndex").value;
  await contract.methods.claim(index).send({ from: user });
  document.getElementById("status").innerText = "✅ Claimed!";
};

document.getElementById("unstakeBtn").onclick = async () => {
  const index = document.getElementById("stakeIndex").value;
  await contract.methods.unstake(index).send({ from: user });
  document.getElementById("status").innerText = "✅ Unstaked!";
};
