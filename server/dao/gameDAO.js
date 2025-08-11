const db = require("../db/db");
const dayjs = require("dayjs");

const arrayToString = (arr) => `(${arr.join(",")})`;

exports.getMeme = (memesUsed) => {
  return new Promise((resolve, reject) => {
    let sql;
    if (memesUsed) {
      const placeholder = arrayToString(memesUsed);
      sql = `SELECT * FROM Memes WHERE id NOT IN ${placeholder} ORDER BY RANDOM() LIMIT 1`;
    } else {
      sql = "SELECT * FROM Memes ORDER BY RANDOM() LIMIT 1";
    }
    db.get(sql, (err, meme) => {
      if (err) reject(err);
      if (!meme) {
        resolve();
        return;
      }
      db.all(
        "SELECT captionId FROM MemeCaptions WHERE memeId=? ORDER BY RANDOM() LIMIT 2",
        [meme.id],
        (err, captions) => {
          if (err) reject(err);
          const captionIds = captions.map((caption) => caption.captionId);
          db.all(
            `SELECT id FROM Captions WHERE id NOT IN (? , ?)  ORDER BY RANDOM() LIMIT 5`,
            captionIds,
            (err, otherCaptions) => {
              if (err) reject(err);
              const otherCaptionsId = otherCaptions.map(
                (caption) => caption.id
              );
              const sevenCaptionIds = [...captionIds, ...otherCaptionsId];
              const placeholders = sevenCaptionIds.map((id) => "?").join(", ");
              db.all(
                `SELECT * FROM Captions WHERE id IN (${placeholders})`,
                sevenCaptionIds,
                (err, result) => {
                  if (err) reject(err);
                  resolve({
                    meme: meme,
                    captions: result,
                  });
                }
              );
            }
          );
        }
      );
    });
  });
};

exports.startGame = (userId) => {
  return new Promise((resolve, reject) => {
    const created_at = dayjs().format("YYYY-MM-DD HH:mm:ss");
    db.run(
      "INSERT INTO Games (userId, created_at) VALUES (?, ?)",
      [userId, created_at],
      function (err) {
        if (err) {
          return reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
};

exports.submitRound = (gameId, memeId, selectedCaptionId) => {
  return new Promise((resolve, reject) => {
    let correct;
    db.get(
      "SELECT COUNT(*) AS count FROM MemeCaptions WHERE memeId=? AND captionId=?",
      [memeId, selectedCaptionId],
      (err, count) => {
        if (err) reject(err);
        count.count == 1 ? (correct = 5) : (correct = 0);
        const created_at = dayjs().format("YYYY-MM-DD HH:mm:ss");
        db.run(
          "INSERT INTO Rounds (gameId,memeId,selectedCaptionId,correct,created_at) VALUES (?,?,?,?,?)",
          [gameId, memeId, selectedCaptionId, correct, created_at],
          (err) => {
            if (err) reject(err);
            const returned_result = correct == 5 ? true : false;
            resolve(returned_result);
          }
        );
      }
    );
  });
};

exports.toalNumRounds = (gameId) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COUNT(*) AS total FROM Rounds WHERE gameId=?",
      [gameId],
      (err, total) => {
        if (err) reject(err);
        resolve(total.total);
      }
    );
  });
};

exports.isUserOwnerOfGame = (userId, gameId) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COUNT(*) AS Count FROM Games WHERE id=? AND userId=?",
      [gameId, userId],
      (err, count) => {
        if (err) reject(err);
        if (count.Count == 1) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
};

exports.endGame = (gameId) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT sum(correct) AS Points FROM Rounds WHERE gameId=?",
      [gameId],
      (err, points) => {
        if (err) reject(err);
        const total_points = points.Points;
        db.run(
          "UPDATE Games SET score=? WHERE id=?",
          [total_points, gameId],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      }
    );
  });
};

const getTotalGames = (userId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT COUNT(*) AS tot,SUM(score) AS tot_score FROM Games WHERE userId=${userId}`,
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      }
    );
  });
};

exports.getUserGames = (userId, offset) => {
  return new Promise((resolve, reject) => {
    let sql;

    let offset_provided;
    if (!offset) {
      offset_provided = false;
      sql = `SELECT id,score,created_at FROM Games WHERE userId=${userId} ORDER BY created_at DESC`;
    } else {
      offset_provided = true;
      sql = `SELECT id,score,created_at FROM Games WHERE userId=${userId} ORDER BY created_at DESC LIMIT 10 OFFSET ${offset}`;
    }
    db.all(sql, async (err, games) => {
      if (err) reject(err);

      const response = await getTotalGames(userId);
      const total_games = response.tot;
      const total_score = response.tot_score;

      resolve({
        total_length: total_games,
        total_score: total_score,
        games: games,
      });
    });
  });
};

exports.getUserRoundsByGame = (gameId, userId) => {
  return new Promise(async (resolve, reject) => {
    isOwner = await this.isUserOwnerOfGame(userId, gameId);
    if (isOwner) {
      db.all(
        `SELECT 
          r.id,
          m.imagePath, 
          c.text, 
              r.correct
          FROM 
              Rounds r
          JOIN 
              Memes m ON r.memeId = m.id
          JOIN 
            Games g ON g.id = r.gameId

          LEFT JOIN 
              Captions c ON r.selectedCaptionId = c.id
          WHERE 
              r.gameId = ? AND g.userId = ?`,
        [gameId, userId],
        (err, rounds) => {
          if (err) reject(err);
          resolve(rounds);
        }
      );
    } else {
      resolve();
    }
  });
};

exports.getCorrectCaptions = (memeId) => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT captionId FROM MemeCaptions WHERE memeId=? LIMIT 2",
      [memeId],
      (err, rows) => {
        if (err) reject(err);

        const placeholder = arrayToString(rows.map((row) => row.captionId));
        db.all(
          `SELECT * FROM Captions WHERE id IN ${placeholder} LIMIT 2`,
          (err, correctCaptions) => {
            if (err) reject(err);
            resolve(correctCaptions);
          }
        );
      }
    );
  });
};
