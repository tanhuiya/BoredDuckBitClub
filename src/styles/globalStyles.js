import styled from "styled-components";

// Used for wrapping a page component
export const Screen = styled.div`
  background-color: var(--primary);
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Used for providing space between components
export const SpacerXSmall = styled.div`
  height: 8px;
  width: 8px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 16px;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 24px;
  width: 24px;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height: 32px;
  width: 32px;
`;

// Used for providing a wrapper around a component
export const Container = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ bg }) => (bg ? bg: "white")};
  width: ${({ wid }) => (wid ? wid: "100%")};
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
`;

export const TextHead = styled.p`
  color: var(--primary-text);
  font-size: 30px;
  font-weight: 700;
  line-height: 1.8;
`;

export const TextTitle = styled.p`
  color: var(--primary-text);
  font-size: 22px;
  font-weight: 500;
  line-height: 1.6;
`;

export const TextSubTitle = styled.p`
  color: var(--primary-text);
  font-size: 18px;
  line-height: 1.6;
`;

export const TextDescription = styled.p`
  color: var(--primary-text);
  font-size: 16px;
  line-height: 1.6;
`;

export const TextInput = styled.input`
  color: var(--primary-text);
  font-size: 18px;
  line-height: 1.6;
  height: 40px;
  border: 3px solid #ccc;
  border-radius: 3px;
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.6;
  }
`;

export const StyledIcon = styled.img`
  width: 50px;
  @media (min-width: 50px) {
    width: 50px;
  }
  border-radius: 25px;
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImgButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  // padding: 10px;
  // font-weight: bold;
  // font-size: 25px;
  // color: var(--primary-text);
  // width: 30px;
  // height: 30px;
  // cursor: pointer;
  // display: flex;
  // align-items: center;
  // justify-content: center;
`;