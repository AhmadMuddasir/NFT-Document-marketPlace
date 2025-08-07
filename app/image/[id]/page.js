"use client";
import { useEffect, useState } from "react";
import {
  FaFilePdf,
  FaLock,
  FaShoppingCart,
  FaCheck,
  FaTrash,
} from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Card, Header, Footer, Logo } from "@/Components";
import { useStateContext } from "@/Context/NFTs";
import styles from "./ImageDetail.module.css";


export default function ImageDetail() {
  const {
    address,
    contract,
    singleImage,
    getUploadedImages,
    loading,
    buyDocument,
    updateDocumentPrice,
    deleteDocument,
    userBalance,
  } = useStateContext();
  const params = useParams();
  const [nft, setNft] = useState(null);
  const [relatedNfts, setRelatedNfts] = useState([]);
  const [newPrice, setNewPrice] = useState("");

  

  const fetchData = async () => {
    try {
      const id = Number(params.id);
      console.log("this is the id ", id);
      if (!id) throw new Error("Invalid NFT ID");

      const [nftData, allNfts] = await Promise.all([
        singleImage(id),
        getUploadedImages(),
      ]);

      console.log("allNfts :", nftData);

      setNft(nftData);
      setRelatedNfts(allNfts.filter((n) => n.imageId !== id).slice(0, 4));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (contract && address) {
      if (params.id) fetchData();
    }
  }, [address, contract, params.id]);

  if (loading || !nft) {
    return (
      <div className={styles.loadingContainer}>
        <Logo />
        <p>Loading NFT details...</p>
      </div>
    );
  }

  const purchaseNFT = () => {
    try {
      const id = Number(params.id);
      console.log("check:", id, "==", nft.price);
      buyDocument(id, nft.price);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePriceUpdate = async () => {
    try {
      if (nft.creator.toLowerCase() === address.toLowerCase()) {
        await updateDocumentPrice(newPrice, nft.imageId);
        fetchData();
      } else {
        toast.error("You are not owner");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(
    "nft.creator == address:",
    nft.creator.toLowerCase() === address.toLowerCase()
  );

  const handleDeleteDocument = async () => {
    try {
      if (nft.creator.toLowerCase() === address.toLowerCase()) {
        await deleteDocument(nft.imageId);
        await fetchData();
      } else {
        toast.error("you cannot delete others document");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("error");
    }
  };

  const openPdf = () => {
    if (address == nft.creator) {
      window.open(nft.pdfURL, "_blank");
    } else {
      toast("You are not the Owner❌", {
        duration: 6000,
      });
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <h2 className={styles.description}>Account:{address.slice(0.1)}..</h2>
      <h2 className={styles.description}>
        UserBalance:{userBalance.slice(0.1)}..
      </h2>

      <main className={styles.mainContent}>
        <section className={styles.nftDetail}>
          <div className={styles.imageContainer}>
            <img
              src={nft.imageURL}
              alt={nft.title}
              className={styles.mainImage}
            />
          </div>

          <div className={styles.details}>
            <h1 className={styles.title}>Title:{nft.title}</h1>

            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <h3>Price</h3>
                <p>{nft.price} ETH</p>
              </div>
              <div className={styles.metaItem}>
                <h3>Category</h3>
                <p>{nft.category}</p>
              </div>
              <div className={styles.metaItem}>
                <h3>Owner</h3>
                <p>{nft.creator}</p>
              </div>
              <div className={styles.metaItem}>
                <h3>Created</h3>
                <p>{new Date(nft.createdAt * 1000).toLocaleDateString()}</p>
              </div>
              <div className={styles.metaItem}>
                <h3>Id:{nft.imageId}</h3>
                {/* <p>{nft.imageId}</p> */}
              </div>
            </div>

            <div className={styles.buttonStyle}>
              <button
                className={styles.purchaseButton}
                onClick={() => purchaseNFT()}
              >
                Purchase Document
                <FaShoppingCart className="text-sm" />
              </button>
              <button
                className={styles.purchaseButton}
                onClick={() => openPdf()}
              >
                Open Document
                <FaFilePdf className="text-[15px]" />
              </button>
              <button
                className={styles.purchaseButton}
                onClick={handleDeleteDocument}
              >
                Delete Documet
                <FaTrash className="text-[15px]" />
              </button>
            </div>
            <p className={styles.description}>Description: {nft.description}</p>
          </div>
        </section>
        <div className={styles.updateDocumentPrice}>
          <p>Update Document Price</p>
          <input
            type="number"
            placeholder="new ETH price"
            value={newPrice}
            onChange={(e) => {
              setNewPrice(e.target.value);
            }}
            className={styles.inputDesign}
          />
          <button onClick={handlePriceUpdate} className={styles.purchaseButton}>
            Update Price
          </button>
        </div>

        <hr className={styles.divider} />

        {relatedNfts.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>More in this collection</h2>
            <div className={styles.relatedGrid}>
              {relatedNfts.map((nft, i) => (
                <Card key={nft.imageId} image={nft} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
