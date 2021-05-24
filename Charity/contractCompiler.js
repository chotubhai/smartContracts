const path = require("path");
const fs = require('fs');   
const solc = require('solc');

const hellopath = path.resolve(__dirname,"contracts","charity.sol");
const source = fs.readFileSync(hellopath,"utf-8");

var input = {
    language: 'Solidity',
    sources: {
        'Charity.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
}; 
const data = JSON.parse(solc.compile(JSON.stringify(input)));
const abi = data.contracts['Charity.sol'][ 'Charity' ].abi;
const bytecode = data.contracts['Charity.sol'][ 'Charity' ].evm.bytecode.object

module.exports = {abi,bytecode};