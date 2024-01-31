import React, { useState } from "react";

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
   * Selects states
   */
  const { fields, handleChange } = useFormFields();
  const [selectedAddress, setSelectedAddress] = useState(null);
  /**
   * Results states
   */
  const [error, setError] = useState(undefined);
  const [addresses, setAddresses] = useState([]);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  /**
   * Text fields onChange handlers
   */

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    setAddresses([]);
    setError(undefined);

    try {
      const apiUrl = `https://api-adresse.data.gouv.fr/search/?q=${fields.houseNumber}+${fields.zipCode}&limit=50`;

      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const addresses = data.features.map((feature) => ({
            id : feature.properties.id,
            houseNumber: feature.properties.housenumber,
            street : feature.properties.street,
            postcode: feature.properties.postcode,
            city : feature.properties.city,
            lat: feature.properties.x,
            lon: feature.properties.y,
          }))
          .filter((address) => address.houseNumber !== undefined && address.houseNumber !== null);
  
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
    const selectedAddress = addresses.find((address) => address.id === selectedId);

    setSelectedAddress(selectedAddress);

    handleChange("selectedAddress", selectedId);
  };

  

  const handlePersonSubmit = (e) => {
    e.preventDefault();

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const transformedAddress = transformAddress({
      firstName: fields.firstName,
      lastName: fields.lastName,
      city: selectedAddress.city,
      houseNumber: selectedAddress.houseNumber,
      lat: selectedAddress.lat,
      lon: selectedAddress.lon,
      postcode: selectedAddress.postcode,
      street: selectedAddress.street,
    });

    addAddress(transformedAddress);
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

        {error && <ErrorMessage message={error} />}

        <Button type="button" onClick={handleClearForm} variant="secondary">Clear all fields</Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
