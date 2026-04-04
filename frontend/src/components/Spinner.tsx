import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;

const SpinnerContainer = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2.4rem;
`;

const Indicator = styled.div`
  width: 6.4rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(farthest-side, #2f6b3f 94%, transparent) top/10px 10px
      no-repeat,
    conic-gradient(transparent 30%, #2f6b3f);

  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 10px),
    #000 0
  );

  animation: ${rotate} 1.2s infinite linear;
`;

function Spinner() {
  return (
    <SpinnerContainer>
      <Indicator />
    </SpinnerContainer>
  );
}

export default Spinner;
