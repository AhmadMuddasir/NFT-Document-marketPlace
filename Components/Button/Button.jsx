import React from 'react'
import Style from "./Button.module.css"
//address 0x12d2 t => file upload disconnect

const Button = ({disconnect,connect,address,file}) => {
  return (
    <>
    {
      address ? (
        <button onClick={ () =>console.log("disconnecet")} className={Style.button}>
          <span>{file ? "Upload" : "Disconnect"}</span>
        </button>
      ) : (
        <button onClick={() =>console.log("connecet")}>
          <span className={Style.button}>
            <span className="">Connect</span>
          </span>
        </button>
      )
    }
    </>
  )
}

export default Button