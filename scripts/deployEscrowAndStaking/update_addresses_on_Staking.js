const { ethers, upgrades } = require('hardhat');
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');
const w3utils = require('web3-utils');
const snx = require('synthetix-2.50.4-ovm');
const { artifacts, contract, web3 } = require('hardhat');

const THALES_AMOUNT = web3.utils.toWei('200');
const SECOND = 1000;
const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const WEEK = 604800;
const YEAR = 31556926;

const fs = require('fs');
const { getTargetAddress, setTargetAddress, encodeCall } = require('../helpers');

const user_key1 = process.env.PRIVATE_KEY;

async function main() {
	let accounts = await ethers.getSigners();
	// let owner = accounts[0];
	let networkObj = await ethers.provider.getNetwork();
	let network = networkObj.name;
	let IssuerAddress;
	if (networkObj.chainId == 10) {
		networkObj.name = 'optimisticEthereum';
		network = 'optimisticEthereum';
		
	}
	if (networkObj.chainId == 69) {
		network = 'optimisticKovan';
	}
	if (networkObj.chainId == 42) {
		network = 'kovan';
	}
	let durationPeriod, unstakeDurationPeriod;
	if (network == 'homestead') {
		console.log('Setting duration to WEEK');
		network = 'mainnet';
		durationPeriod = WEEK;
		unstakeDurationPeriod = WEEK;
	} else {
		console.log('Setting duration to MINUTE');
		durationPeriod = MINUTE;
		unstakeDurationPeriod = MINUTE;
	}

	SNXIssuerAddress = getTargetAddress('SNXIssuer', network);
	const owner = new ethers.Wallet(user_key1, ethers.provider);

	console.log('Owner is:' + owner.address);
	console.log('Network name:' + network);
	console.log('SNXIssuer address: ' + SNXIssuerAddress);

	const maxSNXPercentage = "15";
	const maxAMMPercentage = "12";
	const maxRoyalePercentage = "3";
	const AMMMultiplier = "10";
	const SNXMultiplier = "1";
	const fixedReward = w3utils.toWei("70000", "ether")
	const extraReward = w3utils.toWei("21000", "ether")

	const ThalesStakingRewardsPoolAddress = getTargetAddress('ThalesStakingRewardsPool', network);

	const ProxyStaking = await ethers.getContractFactory('StakingThales');
	let StakingThalesAddress =  getTargetAddress('StakingThales', network);
	
	const ProxyEscrow = await ethers.getContractFactory('EscrowThales');
	let EscrowThalesAddress =  getTargetAddress('EscrowThales', network);

	const StakingThales = await ProxyStaking.attach(StakingThalesAddress);
    console.log("StakingThales attached on: ", StakingThales.address);
	
	const EscrowThales = await ProxyEscrow.attach(EscrowThalesAddress);
    console.log("EscrowThales attached on: ", EscrowThales.address);

	let ThalesAMMAddress =  getTargetAddress('ThalesAMM', network);
	let ThalesRoyaleAddress =  getTargetAddress('ThalesRoyale', network);
	let PriceFeedAddress =  getTargetAddress('PriceFeed', network);
	let ExoticBondsAddress =  getTargetAddress('ThalesBonds', network);

	tx = await StakingThales.setThalesAMM(ThalesAMMAddress, {from:owner.address});
	await tx.wait().then(e => {
		console.log('Staking Thales: setThalesAMM ', ThalesAMMAddress);
	});
	delay(1000);
	
	tx = await StakingThales.setThalesRoyale(ThalesRoyaleAddress, {from:owner.address});
	await tx.wait().then(e => {
		console.log('Staking Thales: setThalesRoyale ', ThalesRoyaleAddress);
	});
	delay(1000);
	
	tx = await StakingThales.setPriceFeed(PriceFeedAddress, {from:owner.address});
	await tx.wait().then(e => {
		console.log('Staking Thales: setPriceFeed ',PriceFeedAddress);
	});
	delay(1000);
	
	tx = await StakingThales.setMaxSNXRewardsPercentage(maxSNXPercentage, {from:owner.address});
	await tx.wait().then(e => {
		console.log('Staking Thales: setMaxSNXRewardsPercentage ',maxSNXPercentage);
	});
	delay(1000);
	
	tx = await StakingThales.setMaxAMMVolumeRewardsPercentage(maxAMMPercentage, {from:owner.address});
	await tx.wait().then(e => {
		console.log('Staking Thales: setMaxAMMVolumeRewardsPercentage ',maxAMMPercentage);
	});
	delay(1000);
	
	tx = await StakingThales.setAMMVolumeRewardsMultiplier(AMMMultiplier, {from:owner.address});
	await tx.wait().then(e => {
		console.log('Staking Thales: setAMMVolumeRewardsMultiplier ',AMMMultiplier);
	});
	delay(1000);
	
	tx = await StakingThales.setSNXVolumeRewardsMultiplier(SNXMultiplier, {from:owner.address});
	await tx.wait().then(e => {
		console.log('Staking Thales: setSNXVolumeRewardsMultiplier ',SNXMultiplier);
	});
	delay(1000);
	
	tx = await EscrowThales.setThalesStakingRewardsPool(ThalesStakingRewardsPoolAddress, {from:owner.address});
	await tx.wait().then(e => {
		console.log('Escrow Thales: ThalesStakingRewardsPoolAddress ',ThalesStakingRewardsPoolAddress);
	});
	delay(1000);
	
	tx = await StakingThales.setMaxThalesRoyaleRewardsPercentage(maxRoyalePercentage, {from:owner.address});
	await tx.wait().then(e => {
		console.log('Staking Thales: setMaxThalesRoyaleRewardsPercentage ',maxRoyalePercentage);
	});
	delay(1000);
	
	tx = await StakingThales.setThalesStakingRewardsPool(ThalesStakingRewardsPoolAddress, {from:owner.address});
	await tx.wait().then(e => {
		console.log('Staking Thales: ThalesStakingRewardsPoolAddress ',ThalesStakingRewardsPoolAddress);
	});
	delay(1000);
	
	tx = await StakingThales.setClaimEnabled(true, {from:owner.address});
	await tx.wait().then(e => {
		console.log('Staking Thales: setClaimEnabled ',true);
	});
	delay(1000);
	
	tx = await StakingThales.setFixedPeriodReward(fixedReward, {from:owner.address});
	await tx.wait().then(e => {
		console.log('Staking Thales: setFixedPeriodReward ',fixedReward);
	});
	delay(1000);
	
	tx = await StakingThales.setPeriodExtraReward(extraReward, {from:owner.address});
	await tx.wait().then(e => {
		console.log('Staking Thales: setFixedPeriodReward ',extraReward);
	});
	delay(1000);
	
	tx = await StakingThales.setExoticBonds(ExoticBondsAddress, {from:owner.address});
	await tx.wait().then(e => {
		console.log('Staking Thales: setExoticBonds ',ExoticBondsAddress);
	});
	delay(1000);
	
	tx = await EscrowThales.setStakingThalesContract(StakingThales.address, {from:owner.address});
	await tx.wait().then(e => {
		console.log('Escrow Thales: setStakingThalesContract ', StakingThales.address );
	});
	delay(1000);
	
	// tx = await StakingThales.startStakingPeriod({from:owner.address});
	// await tx.wait().then(e => {
	// 	console.log('Staking Thales: startStakingPeriod ');
	// });
	
	

}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});

function delay(time) {
	return new Promise(function(resolve) {
		setTimeout(resolve, time);
	});
}
