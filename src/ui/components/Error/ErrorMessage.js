import React from 'react';
import $ from "./ErrorMessage.module.css";

const ErrorMessage = ({ message }) => {

  return (
    <div className={$['error-message']}>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
