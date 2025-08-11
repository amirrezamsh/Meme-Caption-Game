const baseUrl = "http://localhost:3001";

// Login API
export const loginAPI = async (username, password) => {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  return response.json();
};
// Signup API
export const signupAPI = async (username, password) => {
  const response = await fetch(`${baseUrl}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ username, password }),
  });

  return response.json();
};
// Logout API
export const logoutAPI = async () => {
  const response = await fetch(`${baseUrl}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return response.json();
};
// API for retreiving a meme and seven captions
export const startRoundAPI = async (memesUsed) => {
  const response = await fetch(`${baseUrl}/games/meme`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ memesUsed }),
  });
  return response.json();
};
// API for retrieving correct captions for a meme
export const getCorrectCaptionsAPI = async (memeId) => {
  const response = await fetch(`${baseUrl}/games/meme/${memeId}/captions`);
  return response.json();
};
// API for submitting and recording game
export const submitGameAPI = async () => {
  const response = await fetch(`${baseUrl}/games/start`, {
    method: "POST",
    credentials: "include",
  });
  return response.json();
};
// API for recording round informations
export const submitRoundAPI = async (gameId, memeId, selectedCaptionId) => {
  let body_passed;
  if (!selectedCaptionId) {
    body_passed = JSON.stringify({ gameId, memeId });
  } else {
    body_passed = JSON.stringify({ gameId, memeId, selectedCaptionId });
  }
  const response = await fetch(`${baseUrl}/games/round`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: body_passed,
  });
  return response.json();
};
// API for retrieving games
// if offeset is not provided : it will retrieve all games for the current logged in user
// if offset is provided, it will retrieve the last 10 games starting from the given offset
export const getGames = async (offset) => {
  let sql;
  if (offset || offset === 0) {
    sql = `${baseUrl}/games?offset=${offset}`;
  } else {
    sql = `${baseUrl}/games`;
  }

  const response = await fetch(sql, {
    method: "GET",
    credentials: "include",
  });
  return response.json();
};
// API for retreving informations for a round
export const getRounds = async (gameId) => {
  const response = await fetch(`${baseUrl}/games/${gameId}/rounds`, {
    method: "GET",
    credentials: "include",
  });
  return response.json();
};
