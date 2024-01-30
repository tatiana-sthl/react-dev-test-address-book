import React, { useState } from "react";

import Address from "./ui/components/Address/Address";
import AddressBook from "./ui/components/AddressBook/AddressBook";
import Button from "./ui/components/Button/Button";
import InputText from "./ui/components/InputText/InputText";
import Radio from "./ui/components/Radio/Radio";
import Section from "./ui/components/Section/Section";
import ErrorMessage from "./ui/components/Error/ErrorMessage";
import Form from "./ui/components/Form/Form";

// import transformAddress from "./core/models/address";
import useAddressBook from "./ui/hooks/useAddressBook";
import useFormFields from "./ui/hooks/useFormFields";

import "./App.css";

function App() {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { zipCode: '', houseNumber: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handleZipCodeChange for example
   */

  const { fields, handleChange } = useFormFields();
  // const [zipCode, setZipCode] = React.useState("");
  // const [houseNumber, setHouseNumber] = React.useState("");
  // const [firstName, setFirstName] = React.useState("");
  // const [lastName, setLastName] = React.useState("");
  // const [selectedAddress, setSelectedAddress] = React.useState("");
  /**
   * Results states
   */
  const [error, setError] = useState(undefined);
  const [addresses, setAddresses] = useState([]);
  /**
   * Redux actions
   */
  // const { addAddress } = useAddressBook();

  /**
   * Text fields onChange handlers
   */
  // const handleZipCodeChange = (e) => setZipCode(e.target.value);

  // const handleHouseNumberChange = (e) => setHouseNumber(e.target.value);

  // const handleFirstNameChange = (e) => setFirstName(e.target.value);

  // const handleLastNameChange = (e) => setLastName(e.target.value);

  // const handleSelectedAddressChange = (e) => setSelectedAddress(e.target.value);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    /** TODO: Fetch addresses based on houseNumber and zipCode
     * - Example URL of API: http://api.postcodedata.nl/v1/postcode/?postcode=1211EP&streetnumber=60&ref=domeinnaam.nl&type=json
     * - Handle errors if they occur
     * - Handle successful response by updating the `addresses` in the state using `setAddresses`
     * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
     * - Bonus: Add a loading state in the UI while fetching addresses
     */

    setAddresses([]);
    setError(undefined);

    try {
      const apiUrl = `https://api-adresse.data.gouv.fr/search/?q=${fields.houseNumber}+${fields.zipCode}`;

      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl);

      console.log("Response Status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);

        if (data.features && data.features.length > 0) {
          const transformedAddresses = data.features.map((feature) => ({
            housenumber: feature.properties.housenumber,
            postcode: feature.properties.postcode,
          }));

          console.log("Transformed Addresses:", transformedAddresses);

          setAddresses(transformedAddresses);
        } else {
          setError("No addresses found for the given zip code and house number.");
        }
      } else {
        setError(`Failed to fetch addresses. HTTP Status: ${response.status}`);
      }
    } catch (error) {
      setError("An error occurred while fetching addresses.");
    }
  };

  const handlePersonSubmit = (e) => {
    e.preventDefault();

    // if (!selectedAddress || !addresses.length) {
    //   setError(
    //     "No address selected, try to select an address or find one if you haven't"
    //   );
    //   return;
    // }

    // const foundAddress = addresses.find(
    //   (address) => address.id === selectedAddress
    // );

    // addAddress({ ...foundAddress, firstName, lastName });
  };

  const handleClearForm = () => {
    // Réinitialisez tous les champs du formulaire en utilisant votre hook
    handleChange("zipCode", "");
    handleChange("houseNumber", "");
    handleChange("firstName", "");
    handleChange("lastName", "");
    handleChange("selectedAddress", "");
    // Réinitialisez également les états liés aux résultats
    setError(undefined);
    setAddresses([]);
  };



  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by zipcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        <Form onSubmit={handleAddressSubmit} legend="🏠 Find an address">
          <div className="form-row">
            <InputText
              name="zipCode"
              onChange={(e) => handleChange("zipCode", e.target.value)}
              placeholder="Zip Code"
              value={fields.zipCode}
            />
          </div>
          <div className="form-row">
            <InputText
              name="houseNumber"
              onChange={(e) => handleChange("houseNumber", e.target.value)}
              value={fields.houseNumber}
              placeholder="House number"
            />
          </div>
          <Button type="submit">Find</Button>
        </Form>
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={(e) => handleChange("selectedAddress", e.target.value)}
              >
                <Address address={address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {fields.selectedAddress && (
          <Form onSubmit={handlePersonSubmit} legend="✏️ Add personal info to address">
          <div className="form-row">
            <InputText
              name="firstName"
              placeholder="First name"
              onChange={(e) => handleChange("firstName", e.target.value)}
              value={fields.firstName}
            />
          </div>
          <div className="form-row">
            <InputText
              name="lastName"
              placeholder="Last name"
              onChange={(e) => handleChange("lastName", e.target.value)}
              value={fields.lastName}
            />
          </div>
          <Button type="submit">Add to addressbook</Button>
        </Form>
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <ErrorMessage message={error} />}

        {/* TODO: Add a button to clear all form fields. Button must look different from the default primary button, see design. */}
        <Button type="button" onClick={handleClearForm} variant="clear">Clear</Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
