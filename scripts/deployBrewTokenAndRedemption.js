const { ethers } = require("hardhat");

async function main() {
  const signer = await ethers.getSigners()
  const signerAddress = await signer[0].getAddress()
  const signerBalance = await signer[0].getBalance()
  console.log({ signerAddress, signerBalance: signerBalance.toString() })

  // deploy BREW token
  const Brew = await ethers.getContractFactory("Brew");
  const brew = await Brew.deploy();
  await brew.deployTransaction.wait();
  console.log("Brew deployed: ", brew.address);

  await run("verify:verify", {
    address: brew.address,
  });

  // deploy Brew Redemption
  const orcAddress = "0xfda63d7c05147e1DCDCf41d74dce113499D80061" // mainnet address
  const BrewRedemption = await ethers.getContractFactory("BrewRedemption");
  const brewRedemption = await BrewRedemption.deploy(brew.address, orcAddress)

  await brewRedemption.deployTransaction.wait();
  console.log("BrewRedemption deployed: ", brewRedemption.address)

  await run("verify:verify", {
    address: brewRedemption.address,
    constructorArguments: [brew.address, orcAddress],
  });

  // add minter
  const minterRole = await brew.MINTER_ROLE();
  await (await brew.grantRole(minterRole, brewRedemption.address)).wait();

  console.log(`BrewRedemption [${brewRedemption.address}]: added as Minter to Brew contract`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
