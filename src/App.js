import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData, fetchStakeData  } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import Web3 from "web3";
import './index.css'

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 10px;
  border: 10px;
  border-color: black;
  background-color: black;
  padding: 10px;
  font-weight: 700;
  font-size: 20px;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  // box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  // -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  // -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  // :active {
  //   box-shadow: none;
  //   -webkit-box-shadow: none;
  //   -moz-box-shadow: none;
  // }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 10%;
  border: none;
  background-color: var(--accent-text);
  padding: 10px;
  font-weight: bold;
  font-size: 25px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: ${({ wid }) => (wid ? wid : "100%")};
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 150px;
  @media (min-width: 150px) {
    width: 150px;
  }
  border-radius: 10px;
  transition: width 0.5s;
  transition: height 0.5s;
`;



export const StyledHref = styled.a`
  display: block;
  font-size: 30px;
  text-align: center;
  text-decoration: underline;
`;

export const StyledImg = styled.iframe`
  // box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  // border: 4px dashed var(--secondary);
  background-color: "white";
  // border-radius: 100%;
  width: 600px;
  height: 600px;
  // transition: width 0.5s;
`;

export const StyledLink = styled.a`
  tex0color: "var(--accent-text)";
  text-decoration: none;
  font-size: 20px;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click to claim your Token`);
  const [mintAmount, setMintAmount] = useState(10);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    MAX_PER_TX: 0,
    NFT_NAME: "",
    SYMBOL: "",
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
    SAMPLE_URL: "",
    LINK_URL: ""
  });
  
  const Approve = () => {
    if (blockchain.farmSmartContract == null) {
      return
    }
    setFeedback(`Approve`);
    blockchain.smartContract.methods
    .setApprovalForAll(CONFIG.FARM_ADDRESS, true)
    .send({
      // gasLimit: String(totalGasLimit),
      to: CONFIG.CONTRACT_ADDRESS,
      from: blockchain.account,
    }).once("error", (err) => {
      console.log(err);
      setFeedback("Sorry, something went wrong please try again later.");
    })
    .then((receipt) => {
      console.log(receipt);
      setFeedback(
        `Approve Success !!!`
      );
      dispatch(fetchData(blockchain.account));
    });
  }

  const Stake = async () => {
    if (blockchain.farmSmartContract == null) {
      return
    }


    var approved = await blockchain.smartContract.methods.isApprovedForAll(blockchain.account, CONFIG.FARM_ADDRESS).call()
    console.log("approved ", approved)

    setFeedback(`Staking`);
    blockchain.farmSmartContract.methods
    .stakeAll()
    .send({
      // gasLimit: String(totalGasLimit),
      to: CONFIG.CONTRACT_FARM_ADDRESS,
      from: blockchain.account,
    }).once("error", (err) => {
      console.log(err);
      setFeedback("Sorry, something went wrong please try again later.");
    })
    .then((receipt) => {
      console.log(receipt);
      setFeedback(
        `Staking Success !!!`
      );
      dispatch(fetchData(blockchain.account));
    });
  }

  const UnStake = () => {
    if (blockchain.farmSmartContract == null) {
      return
    }
    setFeedback(`UnStaking`);
    blockchain.farmSmartContract.methods
    .unStake()
    .send({
      // gasLimit: String(totalGasLimit),
      to: CONFIG.CONTRACT_FARM_ADDRESS,
      from: blockchain.account,
    }).once("error", (err) => {
      console.log(err);
      setFeedback("Sorry, something went wrong please try again later.");
    })
    .then((receipt) => {
      console.log(receipt);
      setFeedback(
        `UnStaking Success !!!`
      );
      dispatch(fetchData(blockchain.account));
    });
  }

  const claimNFTs = () => {
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);

    var totalvalue = String(data.cost * mintAmount)
    console.log("aaaa", data)
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        // gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalvalue,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, Mint Success !!!`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const claimTokens = () => {
    setFeedback(`Claim your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    console.log("farm---", blockchain.farmSmartContract)
    blockchain.farmSmartContract.methods
      .whitelistClaim()
      .send({
        // gasLimit: String(totalGasLimit),
        to: CONFIG.FARM_ADDRESS,
        from: blockchain.account,
        value: 0,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, Mint Success !!!`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };



  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > CONFIG.MAX_PER_TX) {
      newMintAmount = CONFIG.MAX_PER_TX;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    } else {
      dispatch(connect());
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  // useEffect(() => {
  //   getData();
  // }, [blockchain.account]);

  return (
    <s.Screen>

      <s.Container
        flex={1}
        ai={"center"}
        jc={"center"}
        style={{ padding: 24, backgroundColor: "black" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg6.png" : null}
      >

        <ResponsiveWrapper wid={"1500px"} flex={1} style={{ padding: "100px" }} test>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"left"} ai={"top"} bg={"black"} style={{ marginLeft: 50 }}>
            <s.SpacerSmall />
            <StyledLogo src="/config/images/icon.jpg" />
            <s.TextTitle
              style={{ textAlign: "left", fontSize: 60, fontWeight: "bold", color: "white" }}
            >{CONFIG.NFT_NAME} PublicSale
            </s.TextTitle>
            <s.TextSubTitle
              style={{ textAlign: "left", fontSize: 25, fontWeight: "bold", color: "white" }}
            >The Most Authentic {CONFIG.NFT_NAME} Spirit on Arbitrum.
            </s.TextSubTitle>
            <s.SpacerLarge />
            <s.Container flex={1} jc={"left"} fd={"row"} bg={"black"}>
              <s.StyledIcon style={{}} src="/config/images/twitter.svg"
              onClick={(e) => {
                const w = window.open("about:blank")
                w.location.href = "https://twitter.com/oooo00oo11"
              }} />
              <s.StyledIcon style={{ marginLeft: 10 }} src="/config/images/arb.svg" 
              onClick={(e) => {
                const w = window.open("about:blank")
                w.location.href = "https://arbiscan.io/address/0x43971381e5d6493e10a3fd84784963a99f42ad40"
              }}/>
              {/* <s.StyledIcon style={{ marginLeft: 10 }} src="/config/images/os.svg" 
              onClick={(e) => {
                const w = window.open("about:blank")
                w.location.href = "https://opensea.io/collection/"
              }}/> */}
            </s.Container>

          </s.Container>
          <s.Container
            flex={1}
            bg={"rgb(255 255 255/0.1)"}
            jc={"left"}
            ai={"top"}
            style={{
              padding: 50,
              borderRadius: 24,
              margin: 80,
              marginTop: 30,
              marginBottom: 30,
              // border: "4px dashed var(--secondary)",
              // boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "left",
                fontWeight: "bold",
                color: "var(--accent-text)",
                fontSize: "35px",
              }}
            >
              {CONFIG.NFT_NAME} OG Collection
            </s.TextTitle>
            
            <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK} style={{ color: "white" }}>
              {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
            </StyledLink>
            <s.SpacerLarge />
            <></>

            <s.TextTitle
              style={{
                textAlign: "left",
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              Price: {CONFIG.DISPLAY_COST} ether
            </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "left",
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              Limit: {CONFIG.MAX_PER_TX}  Per Tx
            </s.TextTitle>
            <>
              {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                <>
                  <s.SpacerLarge />
                  <s.TextDescription
                    style={{
                      textAlign: "left",
                      color: "var(--accent-text)",
                    }}
                  >
                    Connect to the {CONFIG.NETWORK.NAME} network
                  </s.TextDescription>
                  <s.SpacerSmall />
                  <StyledButton style={{ backgroundColor: "var(--accent-text)", color: "var(--primary-text)", width: "50%", height: 50, weight: "700" }}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(connect());
                      getData();
                    }}
                  >
                    CONNECT WALLET
                  </StyledButton>
                  {blockchain.errorMsg !== "" ? (
                    <>
                      <s.SpacerSmall />
                      <s.TextDescription
                        style={{
                          textAlign: "left",
                          color: "var(--secondary)"
                        }}
                      >
                        {blockchain.errorMsg}
                      </s.TextDescription>
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  <s.TextDescription
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {feedback}
                  </s.TextDescription>
                  <s.TextTitle
                    style={{
                      textAlign: "left",
                      fontSize: 30,
                      fontWeight: "bold",
                      color: "var(--accent-text)",
                    }}
                  >
                    {data.totalSupply} / {CONFIG.MAX_SUPPLY}
                  </s.TextTitle>
                  <s.SpacerMedium />

                  <s.Container ai={"left"} jc={"left"} fd={"row"} bg={"rgb(255 255 255/0)"}>
                    <StyledRoundButton
                      style={{ lineHeight: 0.4, marginLeft: "10px" }}
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        decrementMintAmount();
                      }}
                    >
                      -
                    </StyledRoundButton>
                    <s.SpacerLarge />
                    <s.TextTitle
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {mintAmount}
                    </s.TextTitle>
                    <s.SpacerLarge />
                    <StyledRoundButton
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        incrementMintAmount();
                      }}
                    >
                      +
                    </StyledRoundButton>
                  </s.Container>
                  <s.SpacerLarge />
                  <StyledButton style={{ backgroundColor: "var(--accent-text)", color: "var(--primary-text)", width: "200px", height: 50, weight: "700", font: "50px" }}
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      claimNFTs();
                      getData();
                    }}
                  >
                    {claimingNft ? "MINTING": "NFT MINT"}
                  </StyledButton>
                  <s.SpacerLarge />
                  <StyledButton style={{ backgroundColor: "var(--accent-text)", color: "var(--primary-text)", width: "200px", height: 50, weight: "700", font: "50px" }}
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      claimTokens();
                    }}
                  >
                    Whitelist Airdrop
                  </StyledButton>
                </>
              )}
            </>
          </s.Container>
        </ResponsiveWrapper>


        <ResponsiveWrapper wid={"1500px"} flex={1} style={{ paddingTop: "0px" }} test>
          <s.Container
            wid={"50%"} flex={1} jc={"center"} ai={"center"} style={{
              padding: 50,
              marginLeft: 180,
              marginRight: 180,
              borderRadius: 24,
            }}
          >

            <s.TextHead >Stake for ${CONFIG.NFT_NAME}</s.TextHead>
            <s.Container
              flex={1} fd={"row"} jc={"center"} ai={"center"}
            >
              <s.Container
                flex={1} jc={"left"} ai={"left"} style={{ marginLeft: 130 }}
              >
                <s.TextTitle>Living Rate</s.TextTitle>
                <s.SpacerMedium></s.SpacerMedium>
                <s.TextTitle>MyDeposit NFT</s.TextTitle>
                <s.SpacerMedium></s.SpacerMedium>
                <s.TextTitle>RewardPending</s.TextTitle>
              </s.Container>

              <s.Container
                flex={1} jc={"center"} ai={"center"}
              >
                <s.TextTitle>---------</s.TextTitle>
                <s.SpacerMedium></s.SpacerMedium>
                <s.TextTitle>---------</s.TextTitle>
                <s.SpacerMedium></s.SpacerMedium>
                <s.TextTitle>---------</s.TextTitle>
              </s.Container>

              <s.Container
                flex={1} jc={"right"} ai={"right"} style={{ marginRight: 130 }}
              >
                <s.TextTitle style={{ textAlign: "right" }}>2,000,000 / Hour</s.TextTitle>
                <s.SpacerMedium></s.SpacerMedium>
                <s.TextTitle style={{ textAlign: "right" }}>{data.deposit}</s.TextTitle>
                <s.SpacerMedium></s.SpacerMedium>
                <s.TextTitle style={{ textAlign: "right" }}>{data.pending}</s.TextTitle>
              </s.Container>
            </s.Container>

            <s.SpacerMedium />
            <s.Container
              flex={1} jc={"center"} ai={"center"} fd={"row"}
            >
              <StyledButton
                disabled={blockchain.account === "" ? 1 : 0}
                onClick={(e) => {
                  e.preventDefault();
                  Approve();
                  getData();
                }}
              >Approve</StyledButton>
              <s.SpacerLarge />
              <StyledButton
                disabled={blockchain.account === "" ? 1 : 0}
                onClick={(e) => {
                  e.preventDefault();
                  Stake();
                  getData();
                }}
              >Stake</StyledButton>
              <s.SpacerLarge />
              <StyledButton
                disabled={blockchain.account === "" ? 1 : 0}
                onClick={(e) => {
                  e.preventDefault();
                  UnStake();
                  getData();
                }}
              >Claim</StyledButton>
            </s.Container>
          </s.Container>

        </ResponsiveWrapper>


        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} bg={"black"} style={{ width: "70%" }}>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "white",
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
        </s.Container>

      </s.Container>
    </s.Screen>
  );
}



export default App;
