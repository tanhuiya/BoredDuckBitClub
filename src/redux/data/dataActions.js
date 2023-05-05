// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      console.log("####################")
      let claimed = await store
        .getState()
        .blockchain.smartContract.methods.claimed(account)
        .call();
      let canClaim = await store
        .getState()
        .blockchain.smartContract.methods.canmint(account)
        .call();
      console.log("canclaimeddx:", canClaim)
      dispatch(
        fetchDataSuccess({
          claimed,
          canClaim,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
