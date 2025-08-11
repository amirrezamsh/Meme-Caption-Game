import React, { useState, useEffect } from "react";
// context
import { useAuth } from "../../contexts/AuthContext";
// API
import {
  startRoundAPI,
  submitGameAPI,
  submitRoundAPI,
  getCorrectCaptionsAPI,
} from "../../API/API";

// react components
import Report from "../report/report";

// bootstrap components
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Alert from "react-bootstrap/Alert";
// styles
import "./game.css";

function Game() {
  const { username } = useAuth();
  const [round, setRound] = useState(0);
  const [memes, setMemes] = useState([]);
  const [memesPath, setMemesPath] = useState([]);
  const [meme, setMeme] = useState();
  const [captions, setCaptions] = useState([]);
  const [selectedCaptions, setSelectedCaptions] = useState([]);
  const [selectedCaptionsText, setSelectedCaptionsText] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState([]);
  const [correctCaptions, setCorrectCaptions] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [roundSubmit, SetRoundSubmit] = useState(true);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [needsReset, setNeedsReset] = useState(false);
  const [timer, setTimer] = useState(30); // Initial timer value in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [show, setShow] = useState(false);
  const [showGameReport, setShowGameReport] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);

  useEffect(() => {}, [memes]);
  useEffect(() => {}, [round]);
  useEffect(() => {}, [showResult]);
  useEffect(() => {
    if (timerActive && timer > 0) {
      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(timerInterval); // Cleanup interval on component unmount or timerActive change
    } else if (timer === 0) {
      handleTimeout();
    }
  }, [timerActive, timer]);

  const startGame = async () => {
    if (needsReset) {
      resetGame();
      setNeedsReset(false);
    }
    setFirstVisit(false);
    setTimerActive(true); // Start the timer
    setTimer(30);

    setShowResult(false);
    const response = await startRoundAPI(memes);
    if (response.status == "successful") {
      setRound((previousRound) => {
        const total_rounds = previousRound + 1;
        return total_rounds;
      });

      setMemes((previousMemes) => {
        const memes_used = [...previousMemes, response.data.meme.id];
        return memes_used;
      });
      setMemesPath((previousMemesPath) => {
        const memes_used = [...previousMemesPath, response.data.meme.imagePath];
        return memes_used;
      });
      setMeme(response.data.meme.imagePath);
      setCaptions(response.data.captions);
      SetRoundSubmit(false);
    }
  };

  const submitAnswer = async (captionId, captionText) => {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);
    try {
      setTimerActive(false);
      setSelectedCaption(captionId);
      setSelectedCaptions((previousCaptions) => [
        ...previousCaptions,
        captionId,
      ]);

      const response = await getCorrectCaptionsAPI(memes[memes.length - 1]);
      if (response.status == "successful") {
        const correctCaptionIds = response.data.map((caption) => caption.id);
        if (correctCaptionIds.includes(captionId)) {
          setSelectedCaptionsText((previousCaptionsText) => [
            ...previousCaptionsText,
            { text: captionText, correct: true },
          ]);
        } else {
          setSelectedCaptionsText((previousCaptionsText) => [
            ...previousCaptionsText,
            {
              text: captionText ? captionText : "No caption selected",
              correct: false,
            },
          ]);
        }
        const round_score = correctCaptionIds.includes(captionId) ? 5 : 0;

        setScore((previousScore) => previousScore + round_score);

        setCorrect(correctCaptionIds.includes(captionId));
        setCorrectCaptions(correctCaptionIds);
        setShowResult(true);
        if (round == 3) {
          setMemes([]);
          setRound(0);
          setShowResult(true);
          setNeedsReset(true);
          setShowGameReport(true);
          const response = await submitGameAPI();
          if (response.status == "successful") {
            const gameId = response.gameId;
            const selected_captions = [...selectedCaptions, captionId];
            for (let i = 0; i < 3; i++) {
              await submitRoundAPI(gameId, memes[i], selected_captions[i]);
            }
          }
        } else if (round == 1 && !username) {
          setMemes([]);
          setMemesPath([]);
          setRound(0);
          setShowResult(true);
          setNeedsReset(true);
          setShow(true);
        }
        SetRoundSubmit(true);
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetGame = () => {
    setRound(0);
    setMemes([]);
    setMemesPath([]);
    setMeme();
    setCaptions([]);
    setSelectedCaptions([]);
    setSelectedCaptionsText([]);
    setSelectedCaption(null);
    setCorrectCaptions([]);
    setCorrect(false);
    setScore(0);
    SetRoundSubmit(true);
    setShowResult(false);
    setShowGameReport(false);
    setShow(false);
    setTimerActive(false);
  };

  const handleTimeout = async () => {
    await submitAnswer(null);
  };

  const handleShowGameReport = () => {
    setShowGameReport((previous) => {
      return !previous;
    });
  };

  const exitGame = () => {
    setFirstVisit(true);
    resetGame();
  };

  return (
    <>
      {show && (
        <div className="alert-container">
          <Alert variant="danger" onClose={() => setShow(false)} dismissible>
            <Alert.Heading>Oops, guests can play only one round</Alert.Heading>
            <p>
              Login to experience a full game and benefit from all
              functionalities of a logged in user
            </p>
          </Alert>
        </div>
      )}
      <div className="game">
        {showGameReport && (
          <Report
            score={score}
            imagePaths={memesPath}
            selectedCaptionsText={selectedCaptionsText}
            handleClick={handleShowGameReport}
          />
        )}
        <div className="game-header">
          {(timerActive || showResult) && (
            <img className="meme-image mb-3" src={`/memes/${meme}`} />
          )}
          {timerActive && (
            <div className="timer-body">
              <h3 className="timer-count">{timer}</h3>
            </div>
          )}

          {showResult && !showGameReport && <h3>Score : {score}</h3>}
        </div>
        {firstVisit && <h1 className="main-title">What do you Meme</h1>}
        <hr className="custom" />
        <div className="game-body">
          <ListGroup>
            {captions.map((caption) => {
              const isSelected = selectedCaption === caption.id;
              const isCorrectCaption = correctCaptions.includes(caption.id);

              let className = "list-group-item";
              if (roundSubmit) {
                if (isSelected) {
                  className += correct ? " correct" : " incorrect";
                } else if (!isSelected && !correct && isCorrectCaption) {
                  className += " correct";
                }
              }
              return (
                <ListGroup.Item
                  className={`mb-2 ${className}`}
                  key={caption.id}
                  action
                  onClick={() => submitAnswer(caption.id, caption.text)}
                  disabled={roundSubmit}
                >
                  {`${caption.text}`}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      </div>

      <div className="center-container">
        <Button
          size="lg"
          className="mt-4"
          onClick={startGame}
          variant="success"
          disabled={!roundSubmit}
        >
          {round == 0 ? "Start new Game" : "Next round"}
        </Button>
        {!firstVisit && (
          <Button
            size="lg"
            className="mt-4 exit-game"
            onClick={() => {
              exitGame();
            }}
            variant="warning"
          >
            Exit Game
          </Button>
        )}
      </div>
    </>
  );
}

export default Game;
