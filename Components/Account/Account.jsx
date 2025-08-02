"use client";

import React, { useEffect, useState } from "react";
import { useStateContext } from "../../Context/NFTs"; // Adjust path to your context
import { Card } from ".."; // Adjust path to your Card component
import styles from "./Account.module.css"; // CSS module for styling
import { toast } from "react-hot-toast";

const Profile = () => {
  const { address, getUploadedImages, getSingleNFTsAPI } = useStateContext();
  const [nfts, setNfts] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "Anonymous", email: "No email provided" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch all NFTs from the blockchain
        const allNFTs = await getUploadedImages();
        // Filter NFTs by the connected address
        const userNFTs = allNFTs.filter(
          (nft) => nft.owner.toLowerCase() === address.toLowerCase()
        );
        console.log("User NFTs:", userNFTs); // Debug log

        setNfts(userNFTs);
        // Fetch user info from API for the first NFT, if available
        // if (userNFTs.length > 0) {
        //   const nftData = await getSingleNFTsAPI(userNFTs[0].imageId);
        //   console.log("nftData",nftData)
        //   if (nftData) {
        //     setUserInfo({
        //       name: nftData.title,
        //       email: nftData.email,
        //     });
        //   } else {
        //     console.warn("No NFT data found from API, using defaults");
        //   }
        // }

      } catch (error) {
        console.error("Error fetching user NFTs:", error);
        toast.error("Failed to load NFTs");
      } finally {
        setLoading(false);
      }
    };

    fetchUserNFTs();
  }, [address, getUploadedImages, getSingleNFTsAPI]);
  console.log("this are the nfts", nfts)
  return (
    <div className={styles.accountContainer}>
      <h1 className={styles.title}>My Account</h1>
      {address ? (
        <div className={styles.userInfo}>
          <p>
            <strong>Address:</strong> {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>
      ) : (
        <p className={styles.warning}>Please connect your wallet to view your account.</p>
      )}

      <h2 className={styles.subtitle}>All your  NFTs</h2>
      {loading ?  (
        <div className={styles.nftGrid}>
          {nfts.map((nft, index) => (
          
            <Card key={nft.imageId} image={nft} index={index} />
          ))}
        </div>
      ) : (
        <p className={styles.warning}>No NFTs found for this address.</p>
      )}
    </div>
  );
};

export default Profile;