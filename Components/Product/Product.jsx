import React, { useState } from "react";
import Image from "next/image";
import { saveAs } from "file-saver";

//internal import

import style from "./Product.module.css";
import BTNstyle from "../Button/Button.module.css";
import client from "../Image/client/index";

const Product = ({ image }) => {
  const handleClick = () => {
    let url = `${image?.pdfURL}`;
    saveAs(url, `${image?.title}`);
  };


  return (
    <div className={style.product}>
      <div className={style.image}>
        <img src={image?.imageURL} alt="img" className={style.image_img} />
        <img src={image?.pdfURL} alt="img" className={style.image_img} />
        {console.log("images", image?.imageURL)}
      </div>
      <div className={style.detail}>
        <div className={style.detail_box}>
          <h1>{image?.title}</h1>
          <p>{image?.description}</p>

          <p className={style.info}>
            <span>Category:{image?.category} </span>
            <span>Image Id:{image?.imageId} </span>
            <span>
              Created At:{new Date(image?.createdAt * 1000).toDateString()}
            </span>
          </p>
          <p>
            <span>Donation:{image?.fundraised}Sepolia</span>
          </p>
          <p>Contract creator:{image?.email}</p>
          <span className={style.para}>
            <Image
              className="avatar_img"
              src={client[`client${1}`]}
              width={40}
              height={40}
              alt="img"
            />
            <small
              className={style.para_small}
              onClick={() => {
                console.log("successfully copied");
                navigator.clipboard.writeText(image?.creator);
              }}
            >
              {image?.creator.slice(0, 30)}...
            </small>
          </span>
        </div>
        <div className={style.button_column}>
          <button
            className={BTNstyle.button}
            onClick={() => (
              console.log("image url copied"),
              navigator.clipboard.writeText(image?.imageURL)
            )}
          >
            <span className={BTNstyle.button_content}>Copy URL</span>
          </button>
          <span className={style.space}></span>
          <button
          className={BTNstyle.button}
          onClick={()=>{
            navigator.clipboard.writeText(console.log("thanks for downloading"));
          }}
          >
            <span
            onClick={handleClick}
            className={`${BTNstyle.button_content} ${style.btn}`}
            >
              Download Image
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
