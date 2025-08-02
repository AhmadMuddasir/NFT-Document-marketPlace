import React, { useEffect, useState } from "react";
import Image from "next/image"; // Add missing import
import styles from "./Filter.module.css";
import images from "../Image/index";

const Filter = ({
  activeSelect,
  setActiveSelect,
  // setImagesCopy,
  imagesCopy,
  setAllImages,
  // allImages,
  oldImages,
}) => {
  const [search, setSearch] = useState("");
  const [toggle, setToggle] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Search function
  const onHandSearch = (value) => {
    const filteredImages = imagesCopy.filter(({ owner }) =>
      owner.toLowerCase().includes(value.toLowerCase())
    );
    setAllImages(filteredImages.length > 0 ? filteredImages : imagesCopy);
  };

  const onClearSearch = () => {
    setAllImages(imagesCopy);
  };

  // Debounce search
  
  useEffect(() => {
    const timer = setTimeout(() => setSearch(debouncedSearch), 1000);
    return () => clearTimeout(timer);
  }, [debouncedSearch]);

  // Handle search and initial load

  useEffect(() => {
    if (search) {
      onHandSearch(search);
    } else {
      onClearSearch();
    }
  }, [search]);

  // Handle filter selection

  useEffect(() => {
    if (activeSelect === "Old Images") {
      setAllImages([...oldImages]); // Create a new array to avoid mutating
    } else {
      setAllImages([...oldImages].reverse());
    }
  }, [activeSelect, oldImages]);

  const filter = [
    { name: "Old Images" },
    { name: "Recent Images" },
  ];

  return (
    <div className={styles.filter}>
      <div className={styles.filter_box}>
        <Image src={images.search} width={20} height={20} alt="Search" />
        <input
          type="text"
          placeholder="Search address"
          onChange={(e) => setDebouncedSearch(e.target.value)}
          value={debouncedSearch}
          
        />
      </div>
      <div
        className={styles.filter_select}
        onClick={() => setToggle(!toggle)}
      >
        <div className={styles.filter_title}>
          <h4>{activeSelect}</h4>
          <Image src={images.arrow} width={20} height={20} alt="Arrow" />
        </div>
        {toggle && (
          <div className={styles.filter_dropdown}>
            {filter.map((item, i) => (
              <p
                key={i}
                onClick={() => setActiveSelect(item.name)}
              >
                {item.name}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;