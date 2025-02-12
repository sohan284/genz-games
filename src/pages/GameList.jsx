import { useState, useEffect } from "react";

function GameList({ selectGame }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch(
      "https://html5.gamedistribution.com/89eaf016e1e544ea827306680d0de0f7/?gd_sdk_referrer_url=https://gamedistribution.com/games/dynamons-10/"
    ) // Replace with actual API
      .then((res) => res.json())
      .then((data) => setGames(data.games))
      .catch((err) => console.error("Error fetching games:", err));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {games.map((game) => (
        <div
          key={game.id}
          className="border p-2 cursor-pointer"
          onClick={() => selectGame(game)}
        >
          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-40 object-cover"
          />
          <h3 className="text-center">{game.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default GameList;
