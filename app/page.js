"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useStateContext } from "../Context/NFTs";
import images from "../Components/Image/client/index";
import { Button, Card, Filter, Footer, Header, Logo, Profile, UploadForm } from "../Components/index";
import toast from "react-hot-toast";

export default function Home() {
  const {
    address,
    contract,
    userBalance,
    connect,
    disconnect,
    getUploadedImages,
    loading,
    getAllNFTsAPI,
  } = useStateContext();

  const [openProfile, setOpenProfile] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [allImages, setAllImages] = useState([]);
  const [activeSelect, setActiveSelect] = useState("Old Images");
  const [imagesCopy, setImagesCopy] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [oldImages, setOldImages] = useState([]);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const images = await getUploadedImages();
      const newImages = Array.isArray(images) ? images : [];
      setAllImages(newImages);
      setImagesCopy(newImages);
      setOldImages(newImages);
      await getAllNFTsAPI();
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error(`Error fetching images: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contract && address) {
      fetchImages();
    }
  }, [contract, address]);

  useEffect(() => {
    if (!window.ethereum) {
      toast.error("MetaMask is not installed. Please install it to proceed.");
    }
  }, []);

  return (
    <div className="home">
      <Header />
      <div className="header">
        <h1>Upload your NFT document to share your information</h1>
      </div>
      <div className="upload-section">
        <div className="upload-info">
          <h1>Welcome to NFTs IPFS Upload</h1>
          <p>
            Our products help you securely distribute any type of media at
            scale—freeing you from restrictive platforms, middlemen, and
            algorithms that limit your creative agency
          </p>
          <div className="avatar">
            <Button
              address={address}
              disconnect={disconnect}
              connect={connect}
            />
            {address && (
              <Image
                className="avatar_img"
                src={images.client1}
                width={40}
                height={40}
                onClick={() => setOpenProfile(true)}
                alt="Profile avatar"
              />
            )}
          </div>
        </div>
        <button
          className="upload-button"
          onClick={() => setShowForm(true)}
          disabled={!address}
        >
          Upload Document
        </button>
      </div>

      <h1 className="subheading">All NFTs of Marketplace</h1>
      {isLoading ? (
        <Logo />
      ) : allImages.length === 0 ? (
        <h1>No Documents Found</h1>
      ) : (
        <>
          <Filter
            setImagesCopy={setImagesCopy}
            imagesCopy={imagesCopy}
            setAllImages={setAllImages}
            allImages={allImages}
            oldImages={oldImages}
            activeSelect={activeSelect}
            setActiveSelect={setActiveSelect}
          />
          <div className="card-grid">
            {allImages.map((image, i) => (
              <Card key={i} index={i} image={image} />
            ))}
          </div>
        </>
      )}

      <Footer />
      {openProfile && (
        <div className="profile-modal">
          <Profile
            setOpenProfile={setOpenProfile}
            userBalance={userBalance}
            address={address}
          />
        </div>
      )}
      {loading && (
        <div className="loader">
          <Logo />
        </div>
      )}
      {showForm && (
        <UploadForm
          onClose={() => setShowForm(false)}
          address={address}
          refreshData={fetchImages}
        />
      )}
    </div>
  );
}