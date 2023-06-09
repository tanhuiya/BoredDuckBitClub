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
  const [feedback, setFeedback] = useState(`Click to claim your $XQDOG`);
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


  const Stake = () => {
    if (blockchain.farmSmartContract == null) {
      return
    }
    setFeedback(`Staking`);
    blockchain.farmSmartContract.methods
    .stake()
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

    // var totalvalue = String(data.cost * mintAmount)

    blockchain.smartContract.methods
      .mint(10)
      .send({
        // gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        // value: totalvalue,
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
            >{CONFIG.NFT_NAME}
            </s.TextTitle>
            <s.TextTitle
              style={{ textAlign: "left", fontSize: 60, fontWeight: "bold", color: "white" }}
            >PublicSale
            </s.TextTitle>
            <s.TextSubTitle
              style={{ textAlign: "left", fontSize: 25, fontWeight: "bold", color: "white" }}
            >Social-experiment
            </s.TextSubTitle>
            <s.TextSubTitle
              style={{ textAlign: "left", fontSize: 25, fontWeight: "bold", color: "white" }}
            >
            Absolutely UNFAIR way of launching.
            </s.TextSubTitle>
            <s.SpacerLarge />
            <s.Container flex={1} jc={"left"} fd={"row"} bg={"black"}>
              <s.StyledIcon style={{}} src="/config/images/twitter.svg"
              onClick={(e) => {
                const w = window.open("about:blank")
                w.location.href = "https://twitter.com/RERC_20"
              }} />
              <s.StyledIcon style={{ marginLeft: 10 }} src="/config/images/etherscan.png" 
              onClick={(e) => {
                const w = window.open("about:blank")
                w.location.href = "https://etherscan.io/address/0x7f47A3903e099989DAbdf866403CBa8EF0373019"
              }}/>
              <s.StyledIcon style={{ marginLeft: 10 }} src="/config/images/os.svg" 
              onClick={(e) => {
                const w = window.open("about:blank")
                w.location.href = "https://opensea.io/collection/r-erc"
              }}/>
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
              Price: Free
            </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "left",
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              Tickets For: {CONFIG.MAX_PER_TX}
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
                   Total: {data.totalSupply} / {CONFIG.MAX_SUPPLY}
                  </s.TextTitle>
                  <s.SpacerMedium />
                  <s.TextTitle
                    style={{
                      textAlign: "left",
                      fontSize: 30,
                      fontWeight: "bold",
                      color: "var(--accent-text)",
                    }}
                  >
                   Golden: {data.totalGoldenSupply} / 21000
                  </s.TextTitle>
                  {/* <s.Container ai={"left"} jc={"left"} fd={"row"} bg={"rgb(255 255 255/0)"}>
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
                  </s.Container> */}
                  <s.SpacerLarge />
                  <StyledButton style={{ backgroundColor: "var(--accent-text)", color: "var(--primary-text)", width: "200px", height: 50, weight: "700", font: "50px" }}
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      claimNFTs();
                      getData();
                    }}
                  >
                    {claimingNft ? "CLAIMING": "CLAIM"}
                  </StyledButton>
                </>
              )}
            </>
          </s.Container>
        </ResponsiveWrapper>


        <ResponsiveWrapper wid={"1500px"} flex={1} style={{ paddingTop: "0px" }} test>
          <s.Container
            wid={"50%"} flex={1} jc={"center"} ai={"left"} style={{
              padding: 50,
              paddingTop: 0,
              marginLeft: 180,
              marginRight: 180,
              borderRadius: 24,
            }}
          >

            <s.TextHead >Dicing Game - Not Open</s.TextHead>
            <s.SpacerMedium />
            <s.TextInput placeholder=" amount"></s.TextInput>
            <s.SpacerMedium />
            <StyledButton 
            style={{width:"200px"}}
            onClick={(e) => {
              const w = window.open("about:blank")
              w.location.href = "https://etherscan.io/block/countdown/17342000"
            }}>Snapshot</StyledButton>
            
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
