import React from "react";
import Alert from "react-bootstrap/Alert";
import "./report.css";

function Report(props) {
  return (
    <div className="alert-container">
      <Alert variant="success" onClose={props.handleClick} dismissible>
        <Alert.Heading>Total Score: {props.score}</Alert.Heading>
        <p className="report-description">
          You can see memes for each round and the answers you submitted
        </p>

        {props.imagePaths.map((imagePath, index) => {
          const caption = props.selectedCaptionsText[index];

          return (
            <div key={index}>
              {index > 0 && <hr />}
              <div className="round">
                <img src={`/memes/${imagePath}`} alt={`Meme ${index + 1}`} />
                <p
                  className={
                    caption.correct ? "correct-caption" : "incorrect-caption"
                  }
                >
                  {caption.text}
                </p>
              </div>
            </div>
          );
        })}
      </Alert>
    </div>
  );
}

export default Report;
