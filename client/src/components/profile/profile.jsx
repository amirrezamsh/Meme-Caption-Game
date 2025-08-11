import React, { useState, useEffect } from "react";
// bootstrap components
import NavBar from "../navbar/navbar";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import Collapse from "react-bootstrap/Collapse";
import Card from "react-bootstrap/Card";
import Pagination from "react-bootstrap/Pagination";

import { useLocation } from "react-router-dom";
// context
import { useAuth } from "../../contexts/AuthContext";
// API
import { getGames, getRounds } from "../../API/API";
// styles
import "./profile.css";

function Profile() {
  const { username } = useAuth();
  const [games, setGames] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [openGameDetails, setOpenGameDetails] = useState(null);
  const [paginations, setPaginations] = useState([]);
  const [selectedPagination, setSelectedPagination] = useState(0);
  const [isRotated, setIsRotated] = useState(false);
  const [totalScore, setTotalScore] = useState();
  const location = useLocation();

  const load_games = async (offset = 0) => {
    try {
      const response = await getGames(offset);
      if (response.status === "successful") {
        setGames(response.data.games);
        setTotalScore(response.data.total_score);
        const pag_numbers = Math.ceil(response.data.total_length / 10);
        setPaginations([...Array(pag_numbers).keys()]);
        setSelectedPagination(offset / 10);
      } else {
        console.error("Failed to load games:", response.message);
      }
    } catch (err) {
      console.error("Error loading games:", err);
    }
  };

  useEffect(() => {
    load_games(); // Call loadGames when component mounts
  }, [location]);

  useEffect(() => {}, [games]); // Dependency array ensures this runs whenever games changes

  const toggleGameDetails = async (gameId) => {
    setIsRotated(!isRotated);
    const response = await getRounds(gameId);
    if (response.status == "successful") {
      setRounds(response.data);
    }
    setOpenGameDetails(openGameDetails === gameId ? null : gameId);
  };

  return (
    <>
      <NavBar />
      {username ? (
        <div className="custom-container">
          <div className={totalScore ? "" : "no-games"}>
            <p className="total-score">
              {totalScore
                ? `Total Score ${totalScore}`
                : "You have no games yet!"}
            </p>
          </div>
          <ListGroup>
            {games.map((game) => (
              <ListGroup.Item key={game.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span>{game.created_at}</span>
                    <span style={{ marginLeft: "10px" }}>
                      Score: {game.score}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleGameDetails(game.id)}
                    aria-controls={`game-details-${game.id}`}
                    aria-expanded={openGameDetails === game.id}
                    variant="secondary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`size-6 ${
                        openGameDetails === game.id ? "rotated" : ""
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>
                </div>
                <Collapse in={openGameDetails === game.id}>
                  <div
                    id={`game-details-${game.id}`}
                    style={{ marginTop: "10px" }}
                  >
                    <Card>
                      <Card.Body>
                        <ul>
                          <div className="rounds">
                            {rounds.map((round) => {
                              return (
                                <div key={round.id} className="round">
                                  <img
                                    className="report-img"
                                    src={`/memes/${round.imagePath}`}
                                  />
                                  <p
                                    className={
                                      round.correct == 5
                                        ? "correct-answer"
                                        : "incorrect-answer"
                                    }
                                  >
                                    {round.text
                                      ? round.text
                                      : "No caption selected"}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </ul>
                      </Card.Body>
                    </Card>
                  </div>
                </Collapse>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="pagination-wrapper">
            <Pagination>
              {paginations.map((pagination) => {
                return (
                  <Pagination.Item
                    key={pagination}
                    onClick={() => load_games(pagination * 10)}
                    active={pagination == selectedPagination}
                  >
                    {pagination + 1}
                  </Pagination.Item>
                );
              })}
            </Pagination>
          </div>
        </div>
      ) : (
        <Alert variant="danger">Unauthorized!</Alert>
      )}
    </>
  );
}

export default Profile;
