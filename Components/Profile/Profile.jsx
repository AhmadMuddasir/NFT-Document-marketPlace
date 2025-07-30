import React from 'react'
import Image from "next/image";
import style from "./Profile.module.css"
import image from "../Image/index";
import { GitHub, Instagram, Twitter, YouTube } from "../SVG";

const Profile = ({setOpenProfile,userBalance,address}) => {
  return (
    <>
    <div className={style.card}>
      <div className={style.img}>
        <Image
        className="avatar_img"
        src={image.img21}
        width={100}
        height={100}
        onClick={()=>setOpenProfile(true)}
        alt='img'/>
      </div>
      <span>
        {address.slice(0,25)}
      </span>
      <p className={style.info}>
        {userBalance}Welcome to Nfts Documentation Ipfs Upload uur Products help you
      securely distribute any type of media at scale-freeing you from restrictive platforms ,middlemen and algorithms that limit your 
      creative agency
      </p>
      <div className={style.share}>
        <a href="">
          <GitHub/>
        </a>
        <a href="">
          <Twitter/>
        </a>
        <a href="">
          <Instagram/>
        </a>
        <a href="">
          <YouTube/>
        </a>
      </div>
      <button
      className={style.closeButton}
      onClick={()=>setOpenProfile(false)}
      >Close</button>
    </div>
    </>
  )
}

export default Profile