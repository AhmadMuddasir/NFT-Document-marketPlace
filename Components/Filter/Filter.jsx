import React, { useEffect, useState } from 'react'
import Image from "next/image";
import styles from "./Filter.module.css";
import { FiSearch } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";

import images from "../Image/index";



const Filter = ({
  activeSelect,
  setActiveSelect,
  imagesCopy,
  setAllImages,
  oldImages
}) => {

  const [search,setSearch] = useState(" ");
  const [toggle,setToggle] = useState(false);
  const [debounchedSearch,setDebounchedSearch] = useState(search)

  //search 
  const onHandSearch = (value) =>{
    const filteredImages = imagesCopy.filter(({owner})=>{
      owner.toLowerCase().includes(value.toLowerCase())
    }
  );
  setAllImages(filteredImages.length > 0 ? filteredImages : imagesCopy);
  };

  const onClearSearch = ()=>{
    setAllImages(imagesCopy);
  };

  useEffect(()=>{
    const timer = setTimeout(()=>setSearch(debounchedSearch),1000);
    return () => clearTimeout(timer);
  },[debounchedSearch]);

  useEffect(()=>{
    if(search){
      onHandSearch(search)
    }else{
      onClearSearch();
    }
  },[search]);

   useEffect(()=>{
    if(activeSelect === "Old Images"){
      setAllImages([...oldImages]);
    }else{
      setAllImages([...oldImages].reverse());
    }
  },[activeSelect,oldImages]);

  const filter = [
    {name:"Old Images"},
    {name:"Recent Images"},
  ]

  return (
    <div className={styles.filter}>
      <div className={styles.filter_box}>
        
        <input type="text"
        placeholder='search address'
        onChange={(e)=>setDebounchedSearch(e.target.value)}
        value={debounchedSearch}
        />
      <FiSearch style={{ padding:"2px", margin: "6px",fontSize:"22px" }} />
      </div>
      <div className={styles.filter_select}
      onClick={()=>setToggle(!toggle)}
      >
        <h4>{activeSelect}</h4>
      <FiChevronDown style={{ padding:"2px", margin: "6px",fontSize:"22px" }} />
      {toggle && (
        <div className={styles.filter_dropdown}>
          {filter.map((item,i)=>(
            <p
            key={i}
            onClick={()=>{setActiveSelect(false)}}
            >{item.name}</p>
          ))}
        </div>
      )}
      </div>

    </div>
  )
}

export default Filter