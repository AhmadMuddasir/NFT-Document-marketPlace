const {ethers} = require("hardhat");


const script = async()=>{
     try {      
          const NFTMARKETPLACE = await ethers.getContractFactory("NftMarketPlace");
          const BASICNFT = await ethers.getContractFactory("BasicNft");
          
          const nftmarketplace = await NFTMARKETPLACE.deploy();
          const basicnft = await BASICNFT.deploy();
          await nftmarketplace.waitForDeployment();
          await basicnft.waitForDeployment();
          console.log("both contracts deployed");
          
          const mintTx = await basicnft.mintNft();
          await mintTx.wait();
          const tokenId = (await basicnft.getTokenCounter()) - 1n;
          console.log("tokenId",tokenId)
          
          const approvalTnx = await basicnft.approve(nftmarketplace.getAddress(),tokenId);
          await approvalTnx.wait();
          console.log("Listing Nft....");
          
          const price = await ethers.parseEther("0.01")
          const getBasicNftAddress = await basicnft.getAddress();
          console.log("getBasicNftAddress",getBasicNftAddress,tokenId,price);
          const tx = await nftmarketplace.listItem(getBasicNftAddress,tokenId,price);
          await tx.wait();
          console.log("listed")
          
          const contractAddress = await nftmarketplace.getAddress();
          console.log(":contractAddress:",contractAddress);
     } catch (error) {
          console.log(error);
     }
}

script();

