"use client"
import React, { useState } from "react";
import axios from "axios";
import style from "./SignUp.module.css";
import { FormSVG } from "../SVG";
import toast from "react-hot-toast";
const SignUp = ({setLogin, setSignUp}) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleFieldChange = (fieldName, e) => {
    setUser({ ...user, [fieldName]: e.target.value });
  };

  const createAccount = async (e) => {
    if (!user.name || !user.password || !user.email || !user.confirmPassword) {
      console.log("please Provide all the details");
      toast("please provide all the fields", {
        duration: 6000,
      });
    }

    try {
      const response = await axios({
        method: "POST",
        url: "/api/v1/user/signup",
        withCredentials: true,
        data: {
          name: user.name,
          email: user.email,
          password: user.password,
          passwordConfirm: user.confirmPassword,
        },
      });
      if (response.data.status == "success") {
        toast.success("signup successful")
        console.log("account is successfully created");
        localStorage.setItem("NFTApi Token", response.data.token);
        setSignUp(false);
        window.location.reload();
      } else {
        console.log("something went wrong try again later");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style.card}>
      <div className={style.card2}>
        <form className={style.form}>
          <p id="heading" className={style.heading}>
            SignUp
          </p>
          <div className={style.field}>
            <FormSVG stylClass={style.input_icon} />
            <input
              type="text"
              className={style.input_field}
              placeholder="name"
              onChange={(e) => {
                handleFieldChange("name", e);
              }}
            />
          </div>
          <div className={style.field}>
            <FormSVG stylClass={style.input_icon} />
            <input
              type="text"
              className={style.input_field}
              placeholder="email"
              autoComplete="on"
              onChange={(e) => {
                handleFieldChange("email", e);
              }}
            />
          </div>
          <div className={style.field}>
            <FormSVG stylClass={style.input_icon} />
            <input
              type="text"
              className={style.input_field}
              placeholder="password"
              autoComplete="on"
              onChange={(e) => {
                handleFieldChange("password", e);
              }}
            />
          </div>
          <div className={style.field}>
            <FormSVG stylClass={style.input_icon} />
            <input
              type="text"
              className={style.input_field}
              placeholder="confirmPassword"
              autoComplete="off"
              onChange={(e) => {
                handleFieldChange("confirmPassword", e);
              }}
            />
          </div>
          <div className={style.btn}>
             <button
             className={style.button1}
             onClick={()=>(setLogin(true),setSignUp(false))}
             >Login</button>
             <button
             className={style.button2}
             onClick={()=>{setSignUp(false)}}
             >Close</button>
          </div>
          <button className={style.button3}
          onClick={(e)=>{createAccount(e)}}
          >
            SignUp
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
