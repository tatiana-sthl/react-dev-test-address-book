import React from "react";
import cx from "classnames";

import $ from "./Button.module.css";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary", // or 'secondary'
}) => {
  const buttonClass = cx($.button, {
    [$.primary]: variant === "primary",
    [$.secondary]: variant === "secondary",
  });

  return (
    <button
      className={buttonClass}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
