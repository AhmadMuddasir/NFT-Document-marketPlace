import React from "react";
import { FormSVG, Lock } from "../SVG/index";
import style from "./Form.module.css";
import { CheckBox } from "../index";

const Form = ({
  setFile,
  setDisplay,
  handleFormFieldChange,
  handleSubmit,
  setCategory,
  imageInfo
}) => {
  const categories = ["Nature", "Artificial", "Animal"];

  return (
    <div className={style.card}>
      <div className={style.card2}>
        <form className={style.forms} onSubmit={handleSubmit}>
          <p id="heading" className={style.heading}>
            Upload Document Details
          </p>
          <div className={style.field}>
            <FormSVG styleClass={style.input_icon} />
            <input
              type="text"
              className={style.input_field}
              placeholder="Title"
              autoComplete="off"
              value={imageInfo.title}
              onChange={(e) => handleFormFieldChange("title", e)}
              required
            />
          </div>
          <div className={style.field}>
            <Lock styleClass={style.input_icon} />
            <textarea
              className={style.input_field}
              placeholder="Description"
              value={imageInfo.description}
              onChange={(e) => handleFormFieldChange("description", e)}
              required
            ></textarea>
          </div>
          <div className={style.field}>
            <FormSVG styleClass={style.input_icon} />
            <input
              type="email"
              className={style.input_field}
              placeholder="Email"
              autoComplete="off"
              value={imageInfo.email}
              onChange={(e) => handleFormFieldChange("email", e)}
              required
            />
          </div>
          <div className={style.field}>
            <FormSVG styleClass={style.input_icon} />
            <input
              type="number"
              className={style.input_field}
              placeholder="Price (ETH)"
              min="0"
              step="0.01"
              value={imageInfo.price}
              onChange={(e) => handleFormFieldChange("price", e)}
              required
            />
          </div>
          <p className={style.second}>Category</p>
          <div className={style.category}>
            {categories.map((category, i) => (
              <CheckBox
                key={i}
                category={category}
                isSelected={imageInfo.category === category}
                setCategory={setCategory}
              />
            ))}
          </div>
          <div className={style.btn}>
            <button
              type="button"
              className={style.button}
              onClick={() => {
                setFile(null);
                setDisplay(null);
              }}
            >
              Close
            </button>
          </div>
          <button type="submit" className={style.button3}>
            Create Document
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;