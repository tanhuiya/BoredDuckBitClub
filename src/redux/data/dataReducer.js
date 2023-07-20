const initialState = {
  loading: false,
  cost: 0,
  deposit: "-",
  pending: "-",
  claimed: "-",
  totalSupply: "-",
  rate: "-",
  canClaim: false,
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":

      return {
        ...state,
        loading: false,
        totalSupply: action.payload.totalSupply,
        cost: action.payload.cost,

        deposit: action.payload.deposit,
        pending: action.payload.pending,
        claimed: action.payload.claimed,
        rate: action.payload.rate,

        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
