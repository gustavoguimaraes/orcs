const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  const signerAddress = await signer.getAddress();
  const signerBalance = await signer.getBalance();

  console.log({ signerAddress, signerBalance: signerBalance.toString() });

  // NFT //
  const orc = await ethers.getContractAt("Orcs", "0xfda63d7c05147e1DCDCf41d74dce113499D80061");

  // deploy OrcSales //
  const beginSale = 1638248400; // Tue Nov 30 2021 05:00:00 GMT+0000
  // const beginSale = (await ethers.provider.getBlock()).timestamp + 2; // for testing only

  // Kovan:
  // const ethUsdOracle = "0x9326BFA02ADD2366b30bacB125260Af641031331";
  // Mainnet:
  const ethUsdOracle = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";

  const OrcSales = await ethers.getContractFactory("OrcSales_II");
  const orcSale = await OrcSales.deploy(orc.address, beginSale, ethUsdOracle);
  await orcSale.deployTransaction.wait();
  console.log("OrcSales deployed at: ", orcSale.address);


  await run("verify:verify", {
    address: orcSale.address,
    constructorArguments: [orc.address, beginSale, ethUsdOracle],
  });

  // add minter //
  const minterRole = await orc.MINTER_ROLE();
  await (await orc.grantRole(minterRole, orcSale.address)).wait();

  console.log(`OrcSale [${orcSale.address}}]: added as Minter to Orc contract`);

  // transfer ownership
  const manager = "0x10aBdC16A2791f9f31ff0CEB50b79f82909D5D07";
  await (await orcSale.transferOwnership(manager)).wait();

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
