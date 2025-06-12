const contractAddress = "0xd08a3b6c2497394c65a19137b71ef246403b1a6b";
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";

let web3;
let user;
let contract;
let tokenContract;

window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
    } else {
        alert("MetaMask not detected");
    }
});

document.getElementById("connectWallet").onclick = async () => {
    try {
        await ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        user = accounts[0];
        contract = new web3.eth.Contract(stakingABI, contractAddress);
        tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
        document.getElementById("status").innerText = "✅ Connected: " + user;
    } catch (err) {
        console.error(err);
        alert("Connection failed");
    }
};

document.getElementById("approveBtn").onclick = async () => {
    const amount = document.getElementById("stakeAmount").value;
    try {
        await tokenContract.methods.approve(contractAddress, web3.utils.toWei(amount, "ether")).send({ from: user });
        document.getElementById("status").innerText = "✅ Approved";
    } catch (err) {
        console.error(err);
        alert("Approval failed");
    }
};

document.getElementById("stakeBtn").onclick = async () => {
    const amount = document.getElementById("stakeAmount").value;
    const tier = document.getElementById("stakeTier").value;
    try {
        await contract.methods.stake(web3.utils.toWei(amount, "ether"), parseInt(tier)).send({ from: user });
        document.getElementById("status").innerText = "✅ Staked Successfully";
    } catch (err) {
        console.error(err);
        alert("Staking failed");
    }
};

document.getElementById("claimBtn").onclick = async () => {
    try {
        await contract.methods.claim(0).send({ from: user });
        document.getElementById("status").innerText = "✅ Claimed Successfully";
    } catch (err) {
        console.error(err);
        alert("Claim failed");
    }
};

document.getElementById("unstakeBtn").onclick = async () => {
    try {
        await contract.methods.unstake(0).send({ from: user });
        document.getElementById("status").innerText = "✅ Unstaked Successfully";
    } catch (err) {
        console.error(err);
        alert("Unstake failed");
    }
};
