"use client";

import React, { useState } from "react";
import style from "./UploadForm.module.css";
import { useStateContext } from "../../Context/NFTs";
import { CheckBox } from "../index";
import axios from "axios";
import { ethers } from "ethers";
import toast from "react-hot-toast";

const UploadForm = ({ onClose, address, refreshData }) => {
  const { UploadImage, loading, setLoading } = useStateContext();
  const [thumbnail, setThumbnail] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploadText, setUploadText] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    email: "",
    price: "",
    category: "",
  });

  const categories = ["Nature", "Artificial", "Animal"];

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setThumbnailPreview(null);
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    setPdf(file);
    setUploadText(file ? "PDF Selected ✅" : "");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thumbnail || !pdf) {
      toast.error("Please select both thumbnail and PDF files");
      return;
    }

    if (!formData.title || !formData.description || !formData.email || !formData.price || !formData.category) {
      toast.error("Please fill out all required fields");
      return;
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      toast.error("Price must be a valid number greater than 0");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Uploading document...");

    try {
      console.log("Uploading thumbnail to Pinata...");
      const priceInWei = ethers.parseEther(formData.price.toString());
      console.log("Price in Wei:", priceInWei.toString());
      const thumbnailFormData = new FormData();
      thumbnailFormData.append("file", thumbnail);

      const thumbnailRes = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        thumbnailFormData,
        {
          headers: {
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Thumbnail uploaded:", thumbnailRes.data.IpfsHash);

      console.log("Uploading PDF to Pinata...");
      const pdfFormData = new FormData();
      pdfFormData.append("file", pdf);

      const pdfRes = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        pdfFormData,
        {
          headers: {
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("PDF uploaded:", pdfRes.data.IpfsHash);

      const imageUrl = `https://gateway.pinata.cloud/ipfs/${thumbnailRes.data.IpfsHash}`;
      const pdfUrl = `https://gateway.pinata.cloud/ipfs/${pdfRes.data.IpfsHash}`;

      console.log("Calling UploadImage with data:", {
        title: formData.title,
        description: formData.description,
        email: formData.email,
        category: formData.category,
        price: priceInWei.toString(),
        image: imageUrl,
        pdf: pdfUrl,
      });
      await UploadImage({
        ...formData,
        price: priceInWei,
        image: imageUrl,
        pdf: pdfUrl,
      });

      toast.success("Document uploaded successfully!", { id: toastId });
      refreshData();
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.formOverlay}>
      <div className={style.formContainer}>
        <div className={style.formHeader}>
          <h2>Upload Document Details</h2>
          <button className={style.closeButton} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.formSection}>
            <h3>Files</h3>
            <div className={style.fileUploadGroup}>
              <label>
                Thumbnail Image *
                {thumbnailPreview && (
                  <div className={style.thumbnailPreview}>
                    <img src={thumbnailPreview} alt="Thumbnail preview" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  required
                />
              </label>

              <label>
                PDF upload {uploadText}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  required
                />
              </label>
            </div>
          </div>

          <div className={style.formSection}>
            <h3>Document Information</h3>
            <div className={style.formGroup}>
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={style.formGroup}>
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={style.formGroup}>
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={style.formGroup}>
              <label>Price (ETH) *</label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={style.formGroup}>
              <label>Category *</label>
              <div className={style.categoryOptions}>
                {categories.map((cat) => (
                  <CheckBox
                    key={cat}
                    category={cat}
                    isSelected={formData.category === cat}
                    setCategory={(selectedCat) =>
                      setFormData({ ...formData, category: selectedCat })
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={style.formActions}>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;