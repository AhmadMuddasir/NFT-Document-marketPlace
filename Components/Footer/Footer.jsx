import React from "react";
import {RiSendPlaneFill} from "react-icons/ri";
import style from "./Footer.module.css";
import Logo from "../Logo/Logo";
import {
  TiSocialFacebook,
  TiSocialInstagram,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialLinkedin,
} from "react-icons/ti";


const Footer = () => {
  const menuList = ["Home","About","Contact","ICO","Membership"];
  return (
    <div className={style.footer}>
      <div className={style.footer_box}>
        <div className={style.footer_box_social}>
          <a href="/">
          <Logo className={style.footer_box_social_logo}/>
          </a>
          <p className={style.footer_box_social_info}>
            The world's first and largest digital marketPlace for crypto
            collectibles and non-fungible tokens (NFTs).
          </p>
          <div className={style.footer_social}>
          <a href="#">
            <TiSocialFacebook/>
          </a>
          <a href="#">
            <TiSocialLinkedin/>
          </a>
          <a href="#">
            <TiSocialTwitter/>
          </a>
          <a href="#">
            <TiSocialYoutube/>
          </a>
          <a href="#">
            <TiSocialInstagram/>
          </a>

          </div>
        </div>
      </div>
      <div className={style.footer_box_help}>
        <h3>Help Center</h3>
        <div className={style.menu}>
            {
              menuList.map((items,i)=>(
                <p key={i+1}>{items}</p>
              ))
            }
        </div>
      </div>
      <div className={style.suscribe}>
        <h3>subscribe</h3>
          <div className={style.suscribe_box}>
          <input type="email" placeholder="Enter your email *" />

              <RiSendPlaneFill className={style.subscribe_box_send}/>
          </div>
          <div className={style.suscribe_box_info}>
              <p>
                Discover collect and sell extraordinary NFTs OpenSea in the worldfirst and largest marketplace
              </p>
          </div>
          
      </div>

    </div>
  )
};

export default Footer;
