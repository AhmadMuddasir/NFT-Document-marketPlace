const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("NFT Marketplace", function () {
  let nftMarketplace;
  let basicNft;
  let basicNftTwo;
  let deployer;
  let user1;
  let user2;
  const PRICE = ethers.parseEther("0.1");
  const TOKEN_ID = 0;
  const TOKEN_ID_TWO = 1;

  beforeEach(async function () {
    // Get signers
    [deployer, user1, user2] = await ethers.getSigners();

    // Deploy contracts
    const BasicNft = await ethers.getContractFactory("BasicNft");
    const BasicNftTwo = await ethers.getContractFactory("BasicNftTwo");
    const NftMarketplace = await ethers.getContractFactory("NftMarketPlace");

    basicNft = await BasicNft.deploy();
    basicNftTwo = await BasicNftTwo.deploy();
    nftMarketplace = await NftMarketplace.deploy();

    // Mint NFTs
    await basicNft.mintNft();
    await basicNft.mintNft();
    await basicNftTwo.mintNft();
  });

  describe("listItem", function () {
    it("should list an NFT for sale", async function () {
      // Approve marketplace to transfer NFT
      await basicNft.approve(nftMarketplace.target, TOKEN_ID);
      console.log("nftMarketplace.target",nftMarketplace.target);
      console.log("TOKEN_ID", TOKEN_ID);

      // List NFT
      await expect(
        nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
      ).to.emit(nftMarketplace, "listedItems");
    });

    it("should revert if price is zero", async function () {
      await basicNft.approve(nftMarketplace.target, TOKEN_ID);
      await expect(
        nftMarketplace.listItem(basicNft.target, TOKEN_ID, 0)
      ).to.be.revertedWithCustomError(nftMarketplace, "NftMarketPlace_PriceMustBeAboveZero");
    });

    it("should revert if not approved", async function () {
      await expect(
        nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
      ).to.be.revertedWithCustomError(nftMarketplace, "NftMarketPlace_NotApprovedForMarketPlace");
    });

    it("should revert if not owner", async function () {
      await basicNft.approve(nftMarketplace.target, TOKEN_ID);
      await expect(
        nftMarketplace.connect(user1).listItem(basicNft.target, TOKEN_ID, PRICE)
      ).to.be.revertedWithCustomError(nftMarketplace, "NftMarketplace__NotOwner");
    });
  });

  describe("buyItem", function () {
    beforeEach(async function () {
      await basicNft.approve(nftMarketplace.target, TOKEN_ID);
      await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE);
    });



    it("should update the s_listing",async()=>{
      const listing =await nftMarketplace.getListing(basicNft.target,TOKEN_ID)
       expect(listing.price).to.be.equal(PRICE);
       expect(listing.seller).to.be.equal(deployer.address);
    })



    it("should allow buying an NFT", async function () {
      await expect(
        nftMarketplace.connect(user1).buyItem(basicNft.target, TOKEN_ID, { value: PRICE })
      ).to.emit(nftMarketplace, "ItemBought");

      expect(await basicNft.ownerOf(TOKEN_ID)).to.equal(user1.address);
    });

    it("should revert if not listed", async function () {
      await expect(
        nftMarketplace.connect(user1).buyItem(basicNft.target, TOKEN_ID_TWO, { value: PRICE })
      ).to.be.revertedWithCustomError(nftMarketplace, "NftMarketplace__NotListed");
    });

    it("should revert if price not met", async function () {
      await expect(
        nftMarketplace.connect(user1).buyItem(basicNft.target, TOKEN_ID, { value: ethers.parseEther("0.05") })
      ).to.be.revertedWithCustomError(nftMarketplace, "nftMarketplace__PriceNotMet");
    });
  });

  describe("cancelListing", function () {
    beforeEach(async function () {
      await basicNft.approve(nftMarketplace.target, TOKEN_ID);
      await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE);
    });

    it("should allow canceling a listing", async function () {
      await expect(
        nftMarketplace.cancelListing(basicNft.target, TOKEN_ID)
      ).to.emit(nftMarketplace, "ItemCanceled");

      const listing = await nftMarketplace.getListing(basicNft.target, TOKEN_ID);
      expect(listing.price).to.equal(0);
    });

    it("should revert if not owner", async function () {
      await expect(
        nftMarketplace.connect(user1).cancelListing(basicNft.target, TOKEN_ID)
      ).to.be.revertedWithCustomError(nftMarketplace, "NftMarketplace__NotOwner");
    });
  });

  describe("updateListing", function () {
    const NEW_PRICE = ethers.parseEther("0.2");

    beforeEach(async function () {
      await basicNft.approve(nftMarketplace.target, TOKEN_ID);
      await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE);
    });

    it("should allow updating listing price", async function () {
      await expect(
        nftMarketplace.updateListing(basicNft.target, TOKEN_ID, NEW_PRICE)
      ).to.emit(nftMarketplace, "listedItems");

      const listing = await nftMarketplace.getListing(basicNft.target, TOKEN_ID);
      expect(listing.price).to.equal(NEW_PRICE);
    });

    it("should revert if not owner", async function () {
      await expect(
        nftMarketplace.connect(user1).updateListing(basicNft.target, TOKEN_ID, NEW_PRICE)
      ).to.be.revertedWithCustomError(nftMarketplace, "NftMarketplace__NotOwner");
    });
  });

  describe("withdrawProceeds", function () {
    beforeEach(async function () {
      await basicNft.approve(nftMarketplace.target, TOKEN_ID);
      await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE);
      await nftMarketplace.connect(user1).buyItem(basicNft.target, TOKEN_ID, { value: PRICE });
    });

    it("should allow withdrawing proceeds", async function () {
      const initialBalance = await ethers.provider.getBalance(deployer.address);
      const proceeds = await nftMarketplace.getProceeds(deployer.address);

      const tx = await nftMarketplace.withdrawProceeds();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const finalBalance = await ethers.provider.getBalance(deployer.address);
      expect(finalBalance).to.equal(initialBalance + proceeds - gasUsed);
    });

    it("should revert if no proceeds", async function () {
      await expect(
        nftMarketplace.connect(user1).withdrawProceeds()
      ).to.be.revertedWithCustomError(nftMarketplace, "NftMarketPlace_NoProceeds");
    });
  });

//   describe("Reentrancy Protection", function () {
//     it("should prevent reentrancy attacks", async function () {
//       // Deploy malicious contract
//       const ReentrancyAttacker = await ethers.getContractFactory("ReentrancyAttacker");
//       const attacker = await ReentrancyAttacker.deploy(nftMarketplace.target);

//       // Mint NFT to attacker and list it
//       await basicNft.mintNft();
//       await basicNft.transferFrom(deployer.address, attacker.target, TOKEN_ID);
//       await basicNft.connect(attacker).approve(nftMarketplace.target, TOKEN_ID);
//       await attacker.listItem(basicNft.target, TOKEN_ID, PRICE);

//       // Attempt attack
//       await expect(
//         attacker.attack({ value: PRICE })
//       ).to.be.reverted;
//     });
//   });
});