"use client";

import React, { useEffect, useState } from "react";
import { useStateContext } from "../../Context/NFTs"; 
import { Card } from ".."; 
import styles from "./Account.module.css"; 
import { toast } from "react-hot-toast";

const Profile = () => {
  const { address, getUploadedImages} = useStateContext();
  const [nfts, setNfts] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "Anonymous", email: "No email provided" });
  const [loading, setLoading] = useState(true);
  console.log(loading);

  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (!address) {
        return;
      }
       setLoading(true);

      try {
        const allNFTs = await getUploadedImages();
        const userNFTs = allNFTs.filter(
          (nft) => nft.owner.toLowerCase() === address.toLowerCase()
        );

        setNfts(userNFTs);
        

      } catch (error) {
        console.error("Error fetching user NFTs:", error);
        toast.error("Failed to load NFTs");
      } finally {
        setLoading(false);
      }
    };

    fetchUserNFTs();
  }, [address, getUploadedImages]);
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
        <p className={styles.warning}>
          Loading Nfts...
        </p>) : nfts.length > 0 ?(
        <div className={styles.nftGrid}>
          {nfts.map((nft, index) => (
          
            <Card key={nft.imageId} image={nft} index={index} />
          ))}
        </div>
        )
        : (
        <p className={styles.warning}>No NFTs found for this address.</p>
      )} 
    </div>
  );
};

export default Profile;