import styled from 'styled-components';

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #3a3a3c;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
`;

export const Button = styled.button`
  border: none;
  background: none;
  margin: 0 20px;
`;

export const Game = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  min-height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
`;

export const GameSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  overflow: hidden;
  position: relative;
`;
export const WordError = styled.div`
  position: absolute;
  top: 50px;
  left: auto;
  right: auto;
  background: black;
  padding: 5px 10px;
  color: white;
  border-radius: 4px;
`;
export const TileContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 5px;
  padding: 10px;
  box-sizing: border-box;
  width: 300px;
  height: 360px;

  @media(max-height:600px) {
    width: 250px;
    height: 300px;
  }
`;
export const TileRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 5px;
`;
export const Tile = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #787c7e;
  font-size: 2rem;
  font-weight: bold;
  line-height: 2rem;
  text-transform: uppercase;
  transition: background-color 0.3s;
  ${({ hint }) => {
    if (hint === 'green') {
      return `background-color: #6aaa64; color:white;`;
    }
    if (hint === 'yellow') {
      return `background-color: #c9b458;color:white;`;
    }
    if (hint === 'grey') {
      return `background-color: #787c7e;color:white;`;
    }
  }}
  user-select: none;

  @media(max-height:600px) {
    font-size: 1rem;
    line-height: 1rem;
  }
`;

export const KeyboardSection = styled.section`
  height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const KeyboardRow = styled.div`
  width: 100%;
  margin: 0 auto 8px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export const KeyboardButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0 6px 0 0;
  height: 58px;
  ${({ item }) => (item ? `flex: ${item};` : `flex: 1;`)}
  border: 0;
  border-radius: 4px;
  background-color: #d3d6da;
  font-weight: bold;
  text-transform: uppercase;
  color: #000;
  cursor: pointer;
  user-select: none;
  &:last-of-type {
    margin: 0;
  }
  ${({ type }) => {
    if (type === 'green') {
      return `background-color: #6aaa64;color:white;`;
    }
    if (type === 'yellow') {
      return `background-color: #b59f3b;color:white;`;
    }
    if (type === 'grey') {
      return `background-color: #3a3a3c;color:white;`;
    }
  }}
`;

export const Flex = styled.div`
  ${({ item }) => `flex: ${item};`}
`;

export const ModalHeader = styled.header`
  display: flex;
  position: absolute;
  width:100%;
`;
export const ModalCloseButton = styled.button`
  padding: 10px;
  border: none;
  background: #000;
  color: white;
  margin-left: auto;
`;

export const ShareModal = styled.div`
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
  position: relative;
`;

export const ShareButton = styled.button`
  font-size: 18px;
  padding: 8px 16px;
  border-radius: 4px;
  border: 2px solid #3a3a3c;
  transition: background-color 0.2s ease-in;
  &:hover {
    background-color: #818384;
  }
`;

export const Heading = styled.h2`
  border-bottom: 1px solid #3a3a3c;
  padding-bottom: 8px;
  font-weight: 700;
  font-size: 2rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  margin-top: 0;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px auto;
`;
