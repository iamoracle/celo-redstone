async function main() {
  const [deployer] = await ethers.getSigners();

  // We get the contract to deploy
  const Membership = await hre.ethers.getContractFactory("Membership");
  const membership = await Membership.attach(
    "0x1E5219A723B044a156D39b5e4a336CFE3CdD9EE5"
  );

  const res = await membership.safeMint(deployer.address, "gold.json");

  const ok = await res.wait();

  console.log(ok);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });