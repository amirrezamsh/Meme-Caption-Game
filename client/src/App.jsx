import NavBar from "./components/navbar/navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import Game from "./components/game/game";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <NavBar />
      <Game />
      <Routes>
        <Route path="\login" element={<Login />}></Route>
      </Routes>
    </>
  );
}

export default App;
