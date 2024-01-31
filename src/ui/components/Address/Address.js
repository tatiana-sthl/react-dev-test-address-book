// Address.js

import React from "react";
import $ from "./Address.module.css";

const Address = ({ address }) => {
  return (
    <address className={$.address}>
      {address.housenumber} {address.street} , {address.postcode} {address.city}
    </address>
  );
};

export default Address;
