const defaultState = {
  addresses: [],
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {

    case "address/add":
      /** TODO: Prevent duplicate addresses */
      if (!state.addresses.includes(action.payload)) {
        return { ...state, addresses: [...state.addresses, action.payload] };
      }
      return state;

    case "address/remove":
      /** TODO: Write a state update which removes an address from the addresses array. */
      const updatedAddresses = state.addresses.filter(
        (address) => address !== action.payload
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
