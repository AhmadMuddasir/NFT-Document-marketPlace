"use client";

const { useState, useEffect, useContext, createContext } = require("react");
const dotenv = require("dotenv");
dotenv.config();
import axios from "axios";
import { ethers } from "ethers";

import ABI from "../ContractABI/ABI.json";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState();
  const [userBalance, setUserBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const initializeEthers = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, ABI.abi, signer);

        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        setAddress(signer.address);

        const handleAccountChanged = (accounts) => {
          if (accounts.length === 0) {
            setAddress(null);
            setUserBalance(null);
          } else if (accounts[0] !== address) {
            setAddress(accounts[0]);
          }
        };
        window.ethereum.on("accountsChanged", handleAccountChanged);
      } else {
        console.error("metamask error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Connect Wallet
  const connect = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("connection executed");
        console.log(signer.address);
        await initializeEthers();
        console.log("connection executed2");
      } else {
        console.error("MetaMask not installed");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnect = async () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      await window.ethereum.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      });
    }
  };

  //fetch user balance

  const fetchData = async () => {
    try {
      if (signer && address) {
        const provider = signer.provider;
        const balance = await provider.getBalance(address);
        const formattedBalance = ethers.formatEther(balance);
        setUserBalance(formattedBalance);
        console.log("balance:", formattedBalance);
      }
    } catch (err) {
      console.log(err, "signer or address err");
    }
  };

  useEffect(() => {
    initializeEthers();
  }, []);
  useEffect(() => {
    if (address && signer) {
      fetchData();
    }
  }, [address, signer]);

  //-----Contract functions----------//

  const UploadImage = async (imageImfo) => {
    const { title, description, email, category, image, pdf } = imageImfo;
    try {
      const listingPrice = await contract.listingPrice();
      const tnx = await contract.uploadIPFS(
        address,
        image,
        pdf,
        title,
        description,
        email,
        category,
        {
          value:listingPrice,
        }
      );

      await tnx.wait();

      //storing the data in API
      const response = await axios({
        method:"POST",
        url:"/api/v1/NFTs",
        data:{
          title,
          description,
          image,
          pdf,
          address,
          email,
        }
      })
      console.log(response);
      setLoading(false)
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const getUploadedImages = async () =>{
    try {
      const images = await contract.getAllNFTs();
      const totalUploaded = await contract.imagesCount();
      const listingPrice = await contract.listingPrice();

      const allImages = images.map((images,i)=>(
        {
          owner:images.creator,
          title:images.title,
          description:images.description,
          email:images.email,
          category:images.category,
          price:images.price,
          email:images.email,
          image:images.image,
          pdf:images.pdf,
          imageId:images.id.toNumber(),
          createdAt:images.timestamp.toNumber(),
          listedAmount:ethers.formatEther(listingPrice.toString()),
          totalUploade:totalUploaded.toNumber(),
        }))
        return allImages;

    }catch(err){
      console.log("Error fetching uploaded images:",err);
    }
    }

    const singleImage = async(id)=>{

      try {
        
        if(isNaN(id) || id<= 0){
          throw new Error("invalid image Id");
        }
  
        const data = await contract.getImage(id);
        const image = {
          title:data[0],
          description: data[1],
          email: data[2],
          category:data[3],
          price:data[4],
          creator:data[5],
          imageURL:data[6],
          pdfURL:data[7],
          createdAt:data[8],
          imageId:data[9],
        };
        return image;
      } catch (error) {
        console.log("Error fetching single image:",error);
      }

    }

    const buyDocument = async(id,price)=>{
      try {
        const tnx = await contract.purchaseDocument(id,{
          value:price
        });
        // const receipt = tnx.wait();
        tnx.wait();
        console.log("transation complete");
      } catch (error) {
        console.log(error)
      }
    }

    const updateDocumentPrice = async(price,id)=>{
      try {     
        const tnx = await contract.updateBuyingPrice(price,id);
        tnx.wait();
      } catch (error) {
        console.log(error);
      }
    }
    //get api data

    const getAllNFTsAPI = async()=>{
      try {
        const response = await axios({
          method:"GET",
          url:"/api/v1/NFTs",
        });
        console.log(response);
        return response.data
      } catch (error) {
        console.log(error);
      }
    }

    const getSingleNFTsAPI = async(id)=>{
      try {
        const response = await axios({
          method:"GET",
          url:`/api/v1/NFTs/${id}`
        })
        console.log("getting single api",response);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        userBalance,
        connect,
        disconnect,
        userBalance,
        UploadImage,
        getUploadedImages,
        singleImage,
        buyDocument,
        updateDocumentPrice,
        getAllNFTsAPI,
        getSingleNFTsAPI
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
