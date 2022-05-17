const { ethers } = require('hardhat');
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');

const { getTargetAddress, setTargetAddress } = require('../helpers');

async function main() {
	let networkObj = await ethers.provider.getNetwork();
    let network = networkObj.name;
	let net_optimistic = '';
	
	if (network == 'homestead') {
		network = 'mainnet';
		net_optimistic = 'optimisticEthereum';
	}
	if (networkObj.chainId == 42) {
		network = 'kovan';
		net_optimistic = 'optimisticKovan';
	}
	if (networkObj.chainId == 69) {
		console.log("Error L2 network used! Deploy only on L1 Mainnet. \nTry using \'--network mainnet\'");
		return 0;
	}
	if (networkObj.chainId == 10) {
		console.log("Error L2 network used! Deploy only on L1 Mainnet. \nTry using \'--network mainnet\'");
		return 0;
	}

	const ProxyThalesExchanger_deployed = getTargetAddress('ProxyThalesExchanger', network);
	const ProxyThalesExchangerImplementation = await getImplementationAddress(ethers.provider, ProxyThalesExchanger_deployed);

	console.log("Implementation ProxyThalesExchanger: ", ProxyThalesExchangerImplementation);
	setTargetAddress('ProxyThalesExchangerImplementation', network, ProxyThalesExchangerImplementation);

	try {
		await hre.run('verify:verify', {
			address: ProxyThalesExchangerImplementation,
			constructorArguments: []
		});
	} catch (e) {
		console.log(e);
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

