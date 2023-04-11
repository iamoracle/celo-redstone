async function main() {
    const [deployer] = await ethers.getSigners();
  
    // We get the contract to deploy
    const Membership = await hre.ethers.getContractFactory("Membership");
    const membership = await Membership.deploy()

    const deployed = await membership.deployed();

  
    console.log(deployed.address, membership.address);
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });