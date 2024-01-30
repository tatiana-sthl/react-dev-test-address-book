import React from "react";
import PropTypes from "prop-types";

import $ from "./Form.module.css";

const Form = ({ onSubmit, legend, children }) => {
  return (
    <form onSubmit={onSubmit} className={$['form']}>
      <fieldset>
        {legend && <legend>{legend}</legend>}
        {children}
      </fieldset>
    </form>
  );
};

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  legend: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Form;
