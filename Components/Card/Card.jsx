import React from 'react'
import Image from "next/image";
import style from "./Card.module.css";
import images from "../Image/client/index"

const Card = ({image,index}) => {
  const date = new Date(image.createdAt * 1000).toString();

  return (
    <div className={style.card}>
      <div className={style.content}>
        <a href={`/image/${image.imageId}`}>
        <img
        className={style.image}
        src={image.image} 
        alt="image" />
        </a>

        <span className={style.para}>
          <Image
          className='avatar_img'
          src={images[`client${index+1}`]}
          width={40}
          height={40}
          alt='img'
          />
          <small
          className={style.para_small}
          onClick={()=>{
            navigator.clipboard.writeText(image.owner)
          }}
          >
            {image.owner.slice(0,25)}...
            Copy Address
          </small>
        </span>
        
          CreatedAt:{date.slice(0,15)}
          <small className={style.number}>
          ID:{image.imageId}

          </small>
          <small className={style.para}>
           <span className='font-bold text-white'>Details:</span>  {image.description.slice(0,80)}
          </small>
          <button className={style.cardButton}
          onClick={()=>{
            navigator.clipboard.writeText(image.image);
          }}
          >
            Copy URL:{image.image.slice(0,10)}
          </button>
          <a href={`/image/${image.imageId}`} className={style.cardButton}>
              <button className={style.cardButton2} >
              Buy Document
              </button>
          </a>
         
          
      </div>
    </div>
  )
}

export default Card

