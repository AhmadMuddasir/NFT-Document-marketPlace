"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { Logo} from "..";
import {toast} from "react-hot-toast";
import Account from "../Account/Account";
import { FaUserCircle } from "react-icons/fa"; // Added import for profile icon
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [signup, setSignUp] = useState(false);
  const [login, setLogin] = useState(false);
  const [token, setToken] = useState("");


  const menuList = [
    { name: "Home", link: "/" },
    { name: "About", link: "/#" },
    { name: "API", link: "/nfts-api" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const openModel = (el) => {
    if (el == "Login") {
      setLogin(true);
      setSignUp(false);
    } else if (el == "SignUp") {
      setLogin(false);
      setSignUp(true);
    } else {
      closeMenu();
    }
  };

  useEffect(()=>{
    const token = localStorage.getItem("NFTApi Token")
    setToken(token);
  },[]);

const logout = () => {
  localStorage.removeItem("NFTApi Token");
  setToken("");
  toast.success("Logged out successfully!");
  window.location.reload();
}

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Logo className={styles.logo} />
          <button className={styles.menuToggle} onClick={toggleMenu}>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
          <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : " "}`}>
            <ul className={styles.menu}>
              {menuList.map((el, i) => (
                <li key={i}>
                  <Link
                    href={el.link}
                    className={styles.link}
                    onClick={closeMenu}
                  >
                    {el.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className={styles.authButtons}>
              <Link href="/profile" className={styles.profileIcon} onClick={closeMenu}>
                <FaUserCircle size={24} />
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
