import {
  Header,
  Game,
  GameSection,
  WordError,
  TileContainer,
  TileRow,
  Tile,
  KeyboardSection,
  KeyboardRow,
  KeyboardButton,
  Flex,
  ShareModal,
  Heading,
  Row,
  ModalHeader,
  ModalCloseButton,
  ShareButton,
} from './styled';
import { FaBackspace, FaTimes } from 'react-icons/fa';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { WORDS } from "./words.js";

const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

const keyboardRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
];

const allKeys = keyboardRows.flat();

const wordLength = 5;
const allowedGuesses = 6;

const newGame = {
  0: Array.from({ length: wordLength }).fill(''),
  1: Array.from({ length: wordLength }).fill(''),
  2: Array.from({ length: wordLength }).fill(''),
  3: Array.from({ length: wordLength }).fill(''),
  4: Array.from({ length: wordLength }).fill(''),
  5: Array.from({ length: wordLength }).fill(''),
};

const fetchWord = (word) => {
  return fetch(`${API_URL}/${word}`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((res) => Array.isArray(res))
    .catch((err) => {console.log('err:', err)});
};

function App() {
  const wordOfTheDay = 'money';
  // const wordOfTheDay = WORDS[Math.floor(Math.random() * WORDS.length)];

  const [guesses, setGuesses] = useState({ ...newGame });
  const [markers, setMarkers] = useState({
    0: Array.from({ length: wordLength }).fill(''),
    1: Array.from({ length: wordLength }).fill(''),
    2: Array.from({ length: wordLength }).fill(''),
    3: Array.from({ length: wordLength }).fill(''),
    4: Array.from({ length: wordLength }).fill(''),
    5: Array.from({ length: wordLength }).fill(''),
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isErrorVisible, setErrorVisible] = useState(false);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [presentLetters, setPresentLetters] = useState([]);
  const [absentLetters, setAbsentLetters] = useState([]);
  const [winner, setWinner] = useState(false);

  let letterIndex = useRef(0);
  let round = useRef(0);

  const win = () => {
    document.removeEventListener('keydown', handleKeyDown);
    setModalVisible(true);
  };

  const lose = () => {
    document.removeEventListener('keydown', handleKeyDown);
    setModalVisible(true);
  };

  const submit = () => {
    const _round = round.current;
    const updatedMarkers = {
      ...markers,
    };

    const tempWord = wordOfTheDay.split('');

    const leftoverIndices = [];

    // Prioritize the letters in the correct spot
    tempWord.forEach((letter, index) => {
      const guessedLetter = guesses[_round][index];

      if (guessedLetter === letter) {
        updatedMarkers[_round][index] = 'green';
        tempWord[index] = '';
        setCorrectLetters(correctLetters => [...correctLetters, letter]);
      } else {
        // We will use this to mark other letters for hints
        leftoverIndices.push(index);
      }
    });

    if (updatedMarkers[_round].every((guess) => guess === 'green')) {
      setMarkers(updatedMarkers);
      setWinner(true);
      win();
      return;
    }
    

    // Then find the letters in wrong spots
    if (leftoverIndices.length) {
      leftoverIndices.forEach((index) => {
        const guessedLetter = guesses[_round][index];
        const correctPositionOfLetter = tempWord.indexOf(guessedLetter);

        if (
          tempWord.includes(guessedLetter) &&
          correctPositionOfLetter !== index
        ) {
          // Mark yellow when letter is in the word of the day but in the wrong spot
          updatedMarkers[_round][index] = 'yellow';
          tempWord[correctPositionOfLetter] = '';
          setPresentLetters(presentLetters => [...presentLetters, guessedLetter]);
        } else {
          // This means the letter is not in the word of the day.
          updatedMarkers[_round][index] = 'grey';
          setAbsentLetters(absentLetters => [...absentLetters, guessedLetter]);
        }
      });
    }

    setMarkers(updatedMarkers);
    round.current = _round + 1;
    letterIndex.current = 0;

    if (round.current === allowedGuesses) {
      lose();
      setWinner(false);
      return;
    }
  };

  const erase = () => {
    const _letterIndex = letterIndex.current;
    const _round = round.current;

    if (_letterIndex !== 0) {
      setGuesses((prev) => {
        const newGuesses = { ...prev };
        newGuesses[_round][_letterIndex - 1] = '';
        return newGuesses;
      });

      letterIndex.current = _letterIndex - 1;
    }
  };

  const publish = (pressedKey) => {
    const _letterIndex = letterIndex.current;
    const _round = round.current;

    if (_letterIndex < wordLength) {
      setGuesses((prev) => {
        const newGuesses = { ...prev };
        newGuesses[_round][_letterIndex] = pressedKey.toLowerCase();
        return newGuesses;
      });

      letterIndex.current = _letterIndex + 1;
    }
  };

  const enterGuess = async (pressedKey) => {
  

    if (pressedKey === 'enter' && !guesses[round.current].includes('')) {
      const validWord = await fetchWord(guesses[round.current].join(''));
      if (validWord) {
        submit();
      } else {
        handleValidation();
      }
    } else if (pressedKey === 'backspace') {
      erase();
    } else if (pressedKey !== 'enter') {
      publish(pressedKey);
    }
  };

  const handleValidation = () => {
    const reset = guesses;
    reset[round.current] = Array.from({ length: wordLength }).fill('');
    setErrorVisible(true);

    setTimeout(() => {
      setErrorVisible(false);
      setGuesses({...reset});
      letterIndex.current = 0;
    }, 1500);
  }

  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const handleClick = (key) => {
    const pressedKey = key.toLowerCase();
    enterGuess(pressedKey);
  };

  const copyMarkers = () => {
    let shareText = `Wordle ${getDayOfYear()}`;
    let shareGuesses = '';

    const amountOfGuesses = Object.entries(markers)
      .filter(([_, guesses]) => !guesses.includes(''))
      .map((round) => {
        const [_, guesses] = round;

        guesses.forEach((guess) => {
          if (guess === 'green') {
            shareGuesses += '🟩';
          } else if (guess === 'yellow') {
            shareGuesses += '🟨';
          } else {
            shareGuesses += '⬛️';
          }
        });

        shareGuesses += '\n';

        return '';
      });

    shareText += ` ${amountOfGuesses.length}/6\n${shareGuesses}`;

    navigator.clipboard.writeText(shareText);
    setIsShared(true);
  };

  const handleKeyDown = (e) => {
    const pressedKey = e.key.toLowerCase();

    if (allKeys.includes(pressedKey)) {
      enterGuess(pressedKey);
    }
  };

  const getType = (key) => {
    if (correctLetters.length && correctLetters.includes(key)) {
      return 'green';
    }
    if (presentLetters.length && presentLetters.includes(key)) {
      return 'yellow';
    }
    if (absentLetters.length && absentLetters.includes(key)) {
      return 'grey';
    }

    return '';
  }

  useEffect(() => {
    Modal.setAppElement('#share');

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Header>WORDLE</Header>
      
      <Game>
        <GameSection>
          {isErrorVisible && 
            <WordError>Oops, not a word boo..</WordError>
          }
          <TileContainer>
            {Object.values(guesses).map((word, wordIndex) => (
              <TileRow key={wordIndex}>
                {word.map((letter, i) => (
                  <Tile key={i} hint={markers[wordIndex][i]}>
                    {letter}
                  </Tile>
                ))}
              </TileRow>
            ))}
          </TileContainer>
        </GameSection>
        <KeyboardSection>
          {keyboardRows.map((keys, i) => (
            <KeyboardRow key={i}>
              {i === 1 && <Flex item={0.5} />}
              {keys.map((key) => (
                <KeyboardButton
                  key={key}
                  onClick={() => handleClick(key)}
                  flex={['enter', 'backspace'].includes(key) ? 1.5 : 1}
                  type={getType(key)}
                >
                  {key === 'backspace' ? <FaBackspace /> : key}
                </KeyboardButton>
              ))}
              {i === 1 && <Flex item={0.5} />}
            </KeyboardRow>
          ))}
        </KeyboardSection>
      </Game>
      <div id="share">
        <Modal
          isOpen={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
            },
          }}
          contentLabel="Share"
        >
          <ShareModal>
            <ModalHeader>
              <ModalCloseButton onClick={() => setModalVisible(false)}>
                <span className="sr-only">Close</span>
                <FaTimes />
              </ModalCloseButton>
            </ModalHeader>
            {winner ? 
              <>
              <Heading>You win!</Heading>
              <Row>
                <h3>Share</h3>
                <ShareButton onClick={copyMarkers} disabled={isShared}>
                  {isShared ? 'Copied!' : 'Share'}
                </ShareButton>
              </Row>
              </>
            : <>
            <Heading>You lose!</Heading>
            <Row>
              <h3>Correct word was {wordOfTheDay.toUpperCase()}</h3>
            </Row>
            </>}
          </ShareModal>
        </Modal>
      </div>
    </>
  );
}

export default App;
