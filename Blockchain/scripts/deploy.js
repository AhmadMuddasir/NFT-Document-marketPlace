const {ethers} = require("hardhat");


const script = async()=>{
     try {      
          const Document = await ethers.getContractFactory("DocumentMARKETPLACE");
          const document = await Document.deploy();
          await document.waitForDeployment();
          // const update = await document.updateListingPrice(ethers.parseEther("0.025"),{
          //      value:ethers.parseEther("0.015")
          // });
          // await update.wait();
          // const price =  await document.listingPrice();
          // console.log("listing price:",ethers.formatEther(price))
          // console.log("listing price uploaded")
          console.log("Contract address ",await document.getAddress() );
     } catch (error) {
          console.log(error);
     }
}

script();

//0xEBEC283Beb29eEB5D2d87D75Aa20e81cc273cf0C