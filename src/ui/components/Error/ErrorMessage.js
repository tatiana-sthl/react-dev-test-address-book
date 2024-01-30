import React from 'react';
import $ from "./ErrorMessage.module.css";

const ErrorMessage = ({ message }) => {
    const errorMessageClass = $['error-message'] || "";
    console.log("Styles:", $);

  return (
    <div className={errorMessageClass}>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
