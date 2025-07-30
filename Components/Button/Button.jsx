import React from 'react'
import Style from "./Button.module.css"
//address 0x12d2 t => file upload disconnect

const Button = ({disconnect,connect,address,file}) => {
  return (
    <>
    {
      address ? (
        <button onClick={ () =>disconnect()} className={Style.button}>
          <span  className={Style.button_content}>{file ? "Upload" : "Disconnect"}</span>
        </button>
      ) : (
        <button className={Style.button} onClick={() =>connect()}>
            Connect
        </button>
      )
    }
    </>
  )
}

export default Button