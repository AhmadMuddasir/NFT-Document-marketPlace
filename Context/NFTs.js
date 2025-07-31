"use client";

import React, { useState, useEffect, useContext, createContext } from "react";
import dotenv from "dotenv";
import axios from "axios";
import { ethers } from "ethers"; // Correct import for ethers v6.14.4
import toast from "react-hot-toast";
import ABI from "../ContractABI/ABI.json";

dotenv.config();

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [loading, setLoading] = useState(false);

    const connect = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }
      console.log("Requesting MetaMask connection...");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      await initializeEthers();
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const initializeEthers = async () => {
    try {
    if (!window.ethereum) {
      console.warn("MetaMask not detected");
      return;
    }
      
      console.log("Contract address:", contractAddress);
      const provider = new ethers.BrowserProvider(window.ethereum);
      // const network = await provider.getNetwork();
      // console.log("Connected network:", network.name, network.chainId);
      // if (network.chainId !== 11155111n) {
      //   try {
      //     await window.ethereum.request({
      //       method: "wallet_switchEthereumChain",
      //       params: [{ chainId: "0xaa36a7" }], // Sepolia chainId
      //     });
      //   } catch (switchError) {
      //     toast.error("Please switch MetaMask to the Sepolia network");
      //     return;
      //   }
      // }
      const signer = await provider.getSigner();
      if (!contractAddress || !ABI.abi) {
        throw new Error("Contract address or ABI is missing");
      }
      const contract = new ethers.Contract(contractAddress, ABI.abi, signer);
      setProvider(provider);
      setSigner(signer);
      setContract(contract);
      setAddress(await signer.getAddress());

      const handleAccountChanged = async (accounts) => {
        if (accounts.length === 0) {
          setAddress(null);
          setUserBalance(null);
        } else {
          setAddress(accounts[0]);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountChanged);
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountChanged);
      };
    } catch (error) {
      console.error("Error initializing ethers:", error);
    }
  };

  // Connect Wallet


  // Disconnect Wallet
  const disconnect = async () => {
    try {
      if (window.ethereum && window.ethereum.selectedAddress) {
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
        setAddress(null);
        setUserBalance(null);
        toast.success("Wallet disconnected successfully!");
      }
    } catch (error) {
      console.error("Disconnection error:", error);
      toast.error(`Disconnection error: ${error.message}`);
    }
  };

  // Fetch User Balance
  const fetchData = async () => {
    try {
      if (signer && address) {
        const provider = signer.provider;
        const balance = await provider.getBalance(address);
        const formattedBalance = ethers.formatEther(balance);
        setUserBalance(formattedBalance);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error(`Error fetching balance: ${error.message}`);
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

  // Contract Functions
  const UploadImage = async (imageInfo) => {
    const { title, description, email, category, image, pdf, price } =
      imageInfo;
    try {
      setLoading(true);
      const listingPrice = await contract.listingPrice();
      console.log("listing price", listingPrice);
      const tx = await contract.uploadIPFS(
        address,
        image,
        pdf,
        title,
        description,
        email,
        category,
        price,
        {
          value: listingPrice,
        }
      );

      await tx.wait();

      // Store data in the API

      const response = await axios({
        method: "POST",
        url: "/api/v1/NFTs",
        data: {
          title,
          description,
          image,
          address,
          email,
        },
      });

      console.log(response);
      console.info("Contract call successful", tx);
      setLoading(false);
      window.location.reload();
    } catch (error) {}
  };

const getUploadedImages = async () => {
  try {
    const images = await contract.getAllNFTs();
    const totalUploaded = await contract.imagesCount();
    const listingPrice = await contract.listingPrice();
    
    console.log("Raw contract data:", images);

    const allImages = images.map((image) => {
      // Convert BigInt values to regular numbers
      const price = ethers.formatEther(image[4].toString());
      const timestamp = Number(image[8]);
      const id = Number(image[9]);
      
      return {
        owner: image[5], // creator address
        title: image[0],
        description: image[1],
        email: image[2],
        category: image[3],
        price: price,
        image: image[6],
        pdf: image[7],
        imageId: id,
        createdAt: timestamp,
        listedAmount: ethers.formatEther(listingPrice.toString()),
        totalUploaded: Number(totalUploaded)
      };
    });
    
    return allImages;
  } catch (error) {
    console.error("Error fetching uploaded images:", error);
    toast.error(`Error fetching images: ${error.message}`);
    return [];
  }
};

  const singleImage = async (id) => {
    try {
      if (isNaN(id) || id <= 0) {
        throw new Error("Invalid image ID");
      }
      
      const data = await contract.getImage(id);
      return {
        title: data[0],
        description: data[1],
        email: data[2],
        category: data[3],
        price: ethers.formatEther(data[4].toString()),
        creator: data[5],
        imageURL: data[6],
        pdfURL: data[7],
        createdAt: Number(data[8]),
        imageId:  Number(data[9]),
      };
    } catch (error) {
      console.error("Error fetching single image:", error);
      toast.error(`Error fetching image: ${error.message}`);
      return null;
    }
  };

  const buyDocument = async (id, price) => {
    try {
      setLoading(true);
      const priceinWei = ethers.parseEther(price)
      console.log("price in Wei",priceinWei);
      const tnx = await contract.purchaseDocument(id, {
        value: priceinWei,
      });
      await tnx.wait();
      toast.success("Document purchased successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error purchasing document:", error);
      toast.error(`Purchase failed: ${error.reason || "cannot buy your own Document"}`);
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentPrice = async (price, id) => {
    try {
      setLoading(true);
      const tnx = await contract.updateBuyingPrice(price, id);
      await tnx.wait();
      toast.success("Document price updated successfully!");
    } catch (error) {
      console.error("Error updating document price:", error);
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateListingPrice = async (price) => {
    try {
      setLoading(true);
      const tnx = await contract.updateListingPrice(price);
      await tnx.wait();
      toast.success("Listing price updated successfully!");
    } catch (error) {
      console.error("Error updating listing price:", error);
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getAllNFTsAPI = async () => {
    try {
      const response = await axios.get("/api/v1/NFTs");
      return response.data;
    } catch (error) {
      console.error("Error fetching NFTs from API:", error);
      toast.error(`Error fetching NFTs: ${error.message}`);
      return [];
    }
  };

  const getSingleNFTsAPI = async (id) => {
    try {
      const response = await axios.get(`/api/v1/NFTs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching single NFT from API:", error);
      toast.error(`Error fetching NFT: ${error.message}`);
      return null;
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        userBalance,
        connect,
        disconnect,
        UploadImage,
        getUploadedImages,
        singleImage,
        buyDocument,
        updateDocumentPrice,
        updateListingPrice,
        getAllNFTsAPI,
        getSingleNFTsAPI,
        loading,
        setLoading,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
