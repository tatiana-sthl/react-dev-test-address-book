const defaultState = {
  addresses: [],
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {

    case "address/add":
      const existingAddress = state.addresses.find(
        (address) => 
          address.lastName === action.payload.lastName && 
          address.firstName === action.payload.firstName && 
          address.houseNumber === action.payload.houseNumber && 
          address.street === action.payload.street && 
          address.postcode === action.payload.postcode && 
          address.city === action.payload.city
      );

      if (existingAddress) {
        return state;
      }

      if (!state.addresses.includes(action.payload)) {
        return { ...state, addresses: [...state.addresses, action.payload] };
      }

      return state;

    case "address/remove":
      const updatedAddresses = state.addresses.filter(
        (address) => address.id !== action.payload
      );
      return { ...state, addresses: updatedAddresses };


    case "addresses/add": {
      return { ...state, addresses: action.payload };
    }
    default:
      return state;
  }
};

export default reducer;
