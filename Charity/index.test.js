const Web3 = require("web3");
const assert = require("assert");
const Provider = require("@truffle/hdwallet-provider");
const privatekey = [
  "0x937b9459282ea4a0348fdfa4bef24757c3e18a79a9ca6e1c87fd32a0cf6a57a7",
  "0xa20db3391d9f7230f87e1ef282254ce2778270120ce1a340695467114b48ca7d",
];
const provider = new Provider(
  privatekey,
  "https://rinkeby.infura.io/v3/e478ce7a543e4c01bb2b4ca8765ae5b0"
);
const web3 = new Web3(provider);
const { bytecode, abi } = require("./contractCompiler");

const address = "0xc4420c555AA3f3Cbf71462CDcDA9856cb0Ca169D";

var charity;

describe("Starting charity contract testing", function () {
  this.timeout(0);
  before(async () => {
    charity = await new web3.eth.Contract(abi)
      .deploy({
        data: bytecode,
        //constructor arg. req.amt and receiver address
        arguments: [1, "0xe626f6FeD982ee26474939463C8923bfE6ba247D"],
      })
      .send(
        {
          from: address,
          gas: "1500000",
          // gasPrice: '30000000000000'
        },
        function (error, transactionHash) {
          console.log("hasH " + transactionHash);
        }
      );
  });

  it("Donate to charity", async () => {
    await charity.methods.donate().send({
      from: "0xc4420c555AA3f3Cbf71462CDcDA9856cb0Ca169D",
      value: web3.utils.toWei("0.01", "ether"),
    });

    await charity.methods.donate().send({
      from: "0xe626f6FeD982ee26474939463C8923bfE6ba247D",
      value: web3.utils.toWei("0.01", "ether"),
    });

    const donators = await charity.methods.getDonators().call({
      from: "0xc4420c555AA3f3Cbf71462CDcDA9856cb0Ca169D",
    });

    assert.strictEqual(Number(donators), 2);
  });

  it("check value received", async () => {
    const value = await charity.methods.valueReceived().call({
      from: "0xc4420c555AA3f3Cbf71462CDcDA9856cb0Ca169D",
    });

    assert.strictEqual(!!value, true);
  });

  it("disperse Amt to receiver", async () => {
    const value = await charity.methods.disperseAmt().call({
      from: "0xc4420c555AA3f3Cbf71462CDcDA9856cb0Ca169D",
    });

    assert.strictEqual(Number(value), 0);
  });

  after(() => {
    provider.engine.stop();
  });
});
