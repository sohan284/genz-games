import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GamesList from "./pages/GamesList";
import GamePlayer from "./pages/GamePlayer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GamesList />} />
        <Route path="/game/:id" element={<GamePlayer />} />
      </Routes>
    </Router>
  );
}

export default App;
