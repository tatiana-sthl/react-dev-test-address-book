import { useState } from "react";

const useFormFields = () => {
  const [fields, setFields] = useState({
    zipCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });

  const handleChange = (name, value) => {
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  return { fields, handleChange };
};

export default useFormFields;
