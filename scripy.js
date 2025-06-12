let web3;
let contract;
const contractAddress = "0x06eFC38F507E92607b0Dbc4A3d46D5Fa2FeF5afD";  // Address Smart Contract ใหม่ล่าสุดของคุณ
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";   // G3X Token

let user;

window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await web3.eth.getAccounts();
            user = accounts[0];
            contract = new web3.eth.Contract(stakingABI, contractAddress);
            document.getElementById("status").innerText = "✅ Wallet connected: " + user;
        } catch (err) {
            console.error(err);
            document.getElementById("status").innerText = "❌ Wallet connection failed.";
        }
    } else {
        alert("⚠️ MetaMask not detected.");
    }
});

document.getElementById("connectWallet").onclick = async () => {
    if (window.ethereum) {
        try {
            await ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await web3.eth.getAccounts();
            user = accounts[0];
            document.getElementById("status").innerText = "✅ Wallet connected: " + user;
        } catch (error) {
            console.error(error);
            document.getElementById("status").innerText = "❌ Connection failed!";
        }
    } else {
        alert("⚠️ MetaMask not found!");
    }
};

document.getElementById("approveBtn").onclick = async () => {
    const amount = document.getElementById("stakeAmount").value;
    const tokenContract = new web3.eth.Contract([
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

    try {
        await tokenContract.methods.approve(contractAddress, web3.utils.toWei(amount, "ether")).send({ from: user });
        document.getElementById("status").innerText = "✅ Token approved!";
    } catch (err) {
        console.error(err);
        document.getElementById("status").innerText = "❌ Approval failed.";
    }
};

document.getElementById("stakeBtn").onclick = async () => {
    const amount = document.getElementById("stakeAmount").value;
    const tier = document.getElementById("stakeTier").value;

    try {
        await contract.methods.stake(web3.utils.toWei(amount, "ether"), parseInt(tier)).send({ from: user });
        document.getElementById("status").innerText = "✅ Stake successful!";
    } catch (err) {
        console.error(err);
        document.getElementById("status").innerText = "❌ Stake failed.";
    }
};

document.getElementById("claimBtn").onclick = async () => {
    try {
        await contract.methods.claim(0).send({ from: user });
        document.getElementById("status").innerText = "✅ Reward claimed!";
    } catch (err) {
        console.error(err);
        document.getElementById("status").innerText = "❌ Claim failed.";
    }
};

document.getElementById("unstakeBtn").onclick = async () => {
    try {
        await contract.methods.unstake(0).send({ from: user });
        document.getElementById("status").innerText = "✅ Unstake successful!";
    } catch (err) {
        console.error(err);
        document.getElementById("status").innerText = "❌ Unstake failed.";
    }
};
