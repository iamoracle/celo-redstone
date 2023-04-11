const { assert, expect } = require("chai");
const { ethers } = require("hardhat");
const { before } = require("mocha");
const { WrapperBuilder } = require("@redstone-finance/evm-connector");

before(async function () {
  const [deployer] = await ethers.getSigners();
  const Membership = await ethers.getContractFactory("Membership");
  const membership = await Membership.deploy();
  await membership.deployed();

  this.membership = membership;
  this.deployer = deployer;
});

describe("Membership", function () {
  it("Should mint a new nft for user", async function () {
    const res = await this.membership.safeMint(
      this.deployer.address,
      "silver.json"
    );

    await res.wait();

    const balance = await this.membership.balanceOf(this.deployer.address);

    assert.equal(balance, 1);
  });

  it("Should confirm owner of token", async function () {
    const owner = await this.membership.ownerOf(0);
    assert.equal(owner, this.deployer.address);
  });

  it("Should confirm token URI", async function () {
    const tokenUri = await this.membership.tokenURI(0);

    assert.equal(
      tokenUri,
      "https://bafybeiel32kbj4izgahwrluoojd4jxcm3uuzimnxexnwdenqop7o2hyw6u.ipfs.nftstorage.link/ipfs/bafybeiel32kbj4izgahwrluoojd4jxcm3uuzimnxexnwdenqop7o2hyw6u/silver.json"
    );
  });

  it("Should update membership from Silver to Gold", async function () {
    const membershipRes = await fetch(
      "https://celo-redstone-react-app.vercel.app/api/memberships/0xF72B6dceBD333Df2308cD77C4754D0866E1D9911"
    );

    const body = await membershipRes.json();

    //When membership is upgraded Gold
    if (body.level === 1) {
      const wrappedContract = WrapperBuilder.wrap(
        this.membership
      ).usingDataService(
        {
          dataServiceId: "redstone-custom-urls-demo",
          uniqueSignersCount: 2,
          dataFeeds: ["0xc59fdf6be8a2f340"],
        },
        ["https://d1zm8lxy9v2ddd.cloudfront.net"]
      );

      // Interact with the contract (getting oracle value securely)
      const res = await wrappedContract.updateMembership(0);

      await res.wait();

      const tokenUri = await this.membership.tokenURI(0);

      assert.equal(
        tokenUri,
        "https://bafybeiel32kbj4izgahwrluoojd4jxcm3uuzimnxexnwdenqop7o2hyw6u.ipfs.nftstorage.link/ipfs/bafybeiel32kbj4izgahwrluoojd4jxcm3uuzimnxexnwdenqop7o2hyw6u/gold.json"
      );
    }
  });
});
