// useFormFields.js
import { useState } from 'react';

const useFormFields = () => {
  const [fields, setFields] = useState({
    zipCode: '',
    houseNumber: '',
    firstName: '',
    lastName: '',
    selectedAddress: null, 
  });

  const handleChange = (fieldName, value) => {
    setFields((prevFields) => ({
      ...prevFields,
      [fieldName]: value,
    }));
  };

  return { fields, handleChange };
};

export default useFormFields;
