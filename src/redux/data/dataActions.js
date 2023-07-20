// log
import store from "../store";
import Web3 from "web3";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchFarmDataRequest = () => {
  return {
    type: "CHECK_FARM_DATA_REQUEST",
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
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();
      let cost = await store
        .getState()
        .blockchain.smartContract.methods.cost()
        .call();
        console.log("####################", totalSupply, cost)

      let depositArr = await store
      .getState()
      .blockchain.farmSmartContract.methods
        .deposited(account)
        .call()
      var deposit = depositArr.toString()
      if (deposit == "") {
        deposit = "-"
      }

      let pending1 = await store
      .getState()
      .blockchain.farmSmartContract.methods
        .pending(account)
        .call()
      let pending = Web3.utils.fromWei(pending1, 'ether');


      // let rates = await store
      // .getState()
      // .blockchain.farmSmartContract.methods
      //   .computerCurrentToken()
      //   .call()
      // let rate = Web3.utils.fromWei(rates, 'ether') + " / 30m"
      // console.log(deposit, pending, claimed, rate)

      dispatch(
        fetchDataSuccess({
          totalSupply,
          cost,

          deposit,
          pending,
          // claimed,
          // rate,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
