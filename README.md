# DAA

## Requirements
The server side scripts requires NodeJS 8.
Go to [NVM](https://github.com/creationix/nvm) and follow the installation description.
By running `source ./tools/initShell.sh`, the correct NodeJs version will be activated for the current shell.

Yarn is required to be installed globally to minimize the risk of dependency issues.
Go to [Yarn](https://yarnpkg.com/en/docs/install) and choose the right installer for your system.

Depending on your system the following components might be already available or have to be provided manually:
* Python 2.7
* make (on Ubuntu this is part of the commonly installed `sudo apt-get install build-essential`)
* On OSX the build tools included in XCode are required

## General
Before running the provided scripts, you have to initialize your current terminal via `source ./tools/initShell.sh` for every terminal in use. This will add the current directory to the system PATH variables and must be repeated for time you start a new terminal window from project base directory.
```
cd <project base directory>
source ./tools/initShell.sh
```

__Every command must be executed from within the projects base directory!__

## Setup
Open your terminal and change into your project base directory. From here, install all needed dependencies.
```
cd <project base directory>
source ./tools/initShell.sh
yarn install
```
This will install all required dependecies in the directory _node_modules_.

## NVM
You can load the configured lts/carbon NodeJS version (8.x LTS) for this project by running `nvm use` in project root directory.

## Compile, migrate and run unit tests
To compile, deploy and test the smart contracts, go into the projects root directory and use the task runner accordingly.
```
# Compile contract
yarn compile

# Migrate contract
yarn migrate

# Test the contract
yarn test

# Run coverage tests
yarn coverage
```

## Rinkeby testnet deployment
For the Rinkeby deployment, you need a Geth installation on your machine.
Follow the [installation instructions](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum) for your OS.

Start local Rinkeby test node in a separate terminal window and wait for the sync is finished.
```
geth --syncmode "fast" --rinkeby --rpc
```

Now you can connect to your local Rinkeby Geth console.
```
geth attach ipc://<PATH>/<TO>/Library/Ethereum/rinkeby/geth.ipc

# e.g.
# geth attach ipc://Users/patrice/Library/Ethereum/rinkeby/geth.ipc
```

Upon setup the node does not contain any private keys and associated accounts. Create an account in the web3 Geth console.
```
web3.personal.newAccount()
```
Press [Enter] twice to skip the password (or set one but then later it has to be provided for unlocking the account).

Read the address and send some Rinkeby Ether to pay for deployment and management transaction fees.
```
web3.eth.accounts
```
You can [obtain Rinkeby testnet Ether](https://www.rinkeby.io/#faucet) from the faucet by pasting your address in social media and pasting the link.

Connect to your rinkeby Geth console and unlock the account for deployment (2700 seconds = 45 minutes).
```
> personal.unlockAccount(web3.eth.accounts[0], "", 2700)
```

Change the `membershipFee` in cnf.json:
```
"membershipFee": <YOUR_VALUE_HERE>
```
`from` has to be the address that is used for deployment (`web3.eth.accounts[0]`).

After exiting the console by `<STRG> + <D>`, simply run `yarn migrate-rinkeby`.
This may take several minutes to finish.

https://rinkeby.etherscan.io/address/<YOUR_RINKEBY_ADDRESS>

## MainNet deployment
__This is the production deployment, so please doublecheck all properties in cnf.json!__
- update cnf.json with latest values!

For the MainNet deployment, you need a Geth installation on your machine.
Follow the [installation instructions](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum) for your OS.

Start local MainNet Ethereum node in a separate terminal window and wait for the sync is finished.
```
geth --syncmode "fast" --rpc
```

Now you can connect to your local MainNet Geth console.
```
geth attach ipc://<PATH>/<TO>/Library/Ethereum/geth.ipc

# e.g.
# geth attach ipc://Users/patrice/Library/Ethereum/geth.ipc
```

While syncing the blockchain, you can monitor the progress by typing `web3.eth.syncing`.
This shows you the highest available block and the current block you are on.

Upon setup the node does not contain any private keys and associated accounts. Create an account in the web3 Geth console.
```
web3.personal.newAccount("<YOUR_SECURE_PASSWORD>")
```
Enter <YOUR_SECURE_PASSWORD> and Press [Enter] to finish the account creation.

Read the address and send some real Ether to pay for deployment and management transaction fees.
```
web3.eth.accounts
```

Connect to your MainNet Geth console and unlock the account for deployment (240 seconds = 4 minutes).
```
personal.unlockAccount(web3.eth.accounts[0], "<YOUR_SECURE_PASSWORD>", 240)
```

Change the `from` (deployer) and `membershipFee` in cnf.json:
```
"from":         "<REAL_ADDRESS_HERE>",
"membershipFee": <YOUR_VALUE_HERE>
```
`from` has to be the address that is used for deployment (`web3.eth.accounts[0]`).

After exiting the console by `<STRG> + <D>`, simply run `yarn migrate-mainnet`.
This may take several minutes to finish.

Now, your smart contract can be found on etherscan:
https://etherscan.io/address/<REAL_ADDRESS_HERE>

### Generate Contructor ABI
Simply run `yarn abi` and copy the encoded output for usage in contract verification. Please select the suitable network for verification, because verification can be done on testnet as well as on mainnet.

### Contract Verification
The final step for the MainNet deployment is the contract verificationSmart contract verification.

This can be dome on [Etherscan](https://etherscan.io/address/<REAL_ADDRESS_HERE>).
- Click on the `Contract Creation` link in the `to` column
- Click on the `Contract Code` link

Fill in the following data.
```
Contract Address:       <REAL_ADDRESS_HERE>
Contract Name:          DAA
Compiler:               v0.4.15+commit.bbb8e64f
Optimization:           YES
Solidity Contract Code: <Copy & Paste from ./build/bundle/DAA_all.sol>
Constructor Arguments:  <ABI from abiEncode.js>
```
- paste the result from __contract verification__ into `Constructor Arguments ABI-encoded`
- Confirm you are not a robot
- Hit `verify and publish` button

Now your smart contract is verified.
