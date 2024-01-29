import { useState } from 'react';

const useFormFields = (initialFields) => {
  const [formFields, setFormFields] = useState(initialFields);

  const setFormField = (fieldName, value) => {
    setFormFields({
      ...formFields,
      [fieldName]: value,
    });
  };

  const clearFormFields = () => {
    setFormFields(initialFields);
  };

  return { formFields, setFormField, clearFormFields };
};

export default useFormFields;