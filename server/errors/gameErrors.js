const GAME_FINISHED =
  "The game session has already finished, and new rounds cannot be submitted.";
const GAME_NOT_FOUND =
  "A game with the given id does not exist in the database";
const ACCESS_DENIED = "Access Denied";
const MEME_FINISHED = "Server ran out of memes";

class gameHasFinished extends Error {
  constructor() {
    super();
    this.message = GAME_FINISHED;
    this.statusCode = 409;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
  }
}

class gameNotFound extends Error {
  constructor() {
    super();
    this.message = GAME_NOT_FOUND;
    this.statusCode = 404;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
  }
}

class AccessDenied extends Error {
  constructor() {
    super();
    this.message = ACCESS_DENIED;
    this.statusCode = 403;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
  }
}

class MemeFinished extends Error {
  constructor() {
    super();
    this.message = MEME_FINISHED;
    this.statusCode = 404;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
  }
}

module.exports = { gameHasFinished, gameNotFound, AccessDenied, MemeFinished };
