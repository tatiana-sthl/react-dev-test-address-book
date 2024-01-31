import React, { useState, useEffect } from "react";

import Address from "./ui/components/Address/Address";
import AddressBook from "./ui/components/AddressBook/AddressBook";
import Button from "./ui/components/Button/Button";
import InputText from "./ui/components/InputText/InputText";
import Radio from "./ui/components/Radio/Radio";
import Section from "./ui/components/Section/Section";
import ErrorMessage from "./ui/components/Error/ErrorMessage";
import Form from "./ui/components/Form/Form";

import transformAddress from "./core/models/address";
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
  const { addAddress } = useAddressBook();

 


  // const [zipCode, setZipCode] = React.useState("");
  // const [houseNumber, setHouseNumber] = React.useState("");
  // const [firstName, setFirstName] = React.useState("");
  // const [lastName, setLastName] = React.useState("");
  // const [selectedAddress, setSelectedAddress] = React.useState("");
  /**
   * Results states
   */


  const [selectedAddress, setSelectedAddress] = useState(null);
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
      const apiUrl = `https://api-adresse.data.gouv.fr/search/?q=${fields.houseNumber}+${fields.zipCode}&limit=50`;

      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl);

      console.log("Response Status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);

        if (data.features && data.features.length > 0) {
          const addresses = data.features.map((feature) => ({
            housenumber: feature.properties.housenumber,
            street : feature.properties.street,
            postcode: feature.properties.postcode,
            city : feature.properties.city,
            id : feature.properties.id,
          }))
          .filter((address) => address.housenumber !== undefined && address.housenumber !== null);
  
          setAddresses(addresses);
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

  const handleSelectAddress = (selectedId) => {
    // const selectedAddress = addresses.find((address) => address.id === selectedId);
    // handleChange("selectedAddress", selectedId);
    // console.log("Selected Address:", selectedAddress);

    const selectedAddress = addresses.find((address) => address.id === selectedId);
    console.log()
    setSelectedAddress(selectedAddress);
    handleChange("selectedAddress", selectedId); // Mettez à jour le champ dans les états du formulaire
    console.log("Selected Address:", selectedAddress);
  };

  

  const handlePersonSubmit = (e) => {
    e.preventDefault();
    console.log("Addresses :", addresses);

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

    if (!fields.selectedAddress || !addresses.length) {
      setError("No address selected, try to select an address or find one if you haven't");
      return;
    }
  
    const foundAddress = addresses.find(
      (address) => address.id === fields.selectedAddress
    );

    console.log("Person Form Submitted:", {
      selectedAddress: foundAddress,
      firstName: fields.firstName,
      lastName: fields.lastName,
    });  

    addAddress({
      id: foundAddress.id, // Assurez-vous que la structure de l'adresse correspond à ce que votre backend ou service attend
      firstName: fields.firstName,
      lastName: fields.lastName,
    });
  };

  const handleClearForm = () => {
    handleChange("zipCode", "");
    handleChange("houseNumber", "");
    handleChange("firstName", "");
    handleChange("lastName", "");
    handleChange("selectedAddress", "");
    
    setError(undefined);
    setAddresses([]);
  };

  // console.log("Render - Fields:", fields);
  // console.log("Render - Addresses:", addresses);
  // console.log("Render - Selected Address:", selectedAddress);
  // console.log("Render - Error:", error);




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
                onChange={(e) => handleSelectAddress(address.id)}
              >
                <Address address={address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}

        {selectedAddress && (
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
          <Button type="submit" variant="primary">Add to addressbook</Button>
        </Form>
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <ErrorMessage message={error} />}

        {/* TODO: Add a button to clear all form fields. Button must look different from the default primary button, see design. */}
        <Button type="button" onClick={handleClearForm} variant="secondary">Clear all fields</Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
