// import GameDAO from "../dao/gameDAO";
const { response } = require("express");
const GameDAO = require("../dao/gameDAO");
const {
  gameHasFinished,
  gameNotFound,
  AccessDenied,
  MemeFinished,
} = require("../errors/gameErrors");

exports.getMeme = async (memesUsed) => {
  try {
    const response = await GameDAO.getMeme(memesUsed);
    if (!response) {
      throw new MemeFinished();
    }
    return response;
  } catch (err) {
    throw err;
  }
};

exports.startGame = (userId) => {
  return GameDAO.startGame(userId);
};

exports.submitRound = async (userId, gameId, memeId, selectedCaptionId) => {
  try {
    const isOwner = await GameDAO.isUserOwnerOfGame(userId, gameId);
    if (!isOwner) {
      throw new AccessDenied();
    }
    let total_rounds;
    total_rounds = await GameDAO.toalNumRounds(gameId);

    // check if game has already finished
    if (total_rounds == 3) {
      throw new gameHasFinished();
    }
    const ans = await GameDAO.submitRound(gameId, memeId, selectedCaptionId);
    // check wheteher after submiting the round game is finished or not
    if ((ans == true || ans == false) && total_rounds == 2) {
      await GameDAO.endGame(gameId);
    }
    return ans;
  } catch (err) {
    throw err;
  }
};

exports.endGame = () => {
  return GameDAO.endGame();
};

exports.getUserGames = (userId, offset) => {
  return GameDAO.getUserGames(userId, offset);
};

exports.getUserRoundsByGame = (gameId, userId) => {
  return GameDAO.getUserRoundsByGame(gameId, userId);
};

exports.getCorrectCaptions = (memeId) => {
  return GameDAO.getCorrectCaptions(memeId);
};
