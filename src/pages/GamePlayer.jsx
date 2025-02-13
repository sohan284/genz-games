import { useParams, useNavigate } from "react-router-dom";

const games = [
  {
    id: 1,
    name: "Game 1",
    url: "https://html5.gamedistribution.com/788f89d325d840f391139ce0e1212c46/",
    width: 800,
    height: 600,
  },
  {
    id: 2,
    name: "Game 2",
    url: "https://html5.gamedistribution.com/3c2a5af31a50409da0e7df5742fcf05b/",
    width: 1336,
    height: 540,
  },
  {
    id: 3,
    name: "Game 3",
    url: "https://html5.gamedistribution.com/ea1e352d227b4291baf854c2fa0f2e48/",
    width: 800,
    height: 600,
  },
];

function GamePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const game = games.find((g) => g.id === parseInt(id));

  if (!game) {
    return <h1 className="text-red-500 text-center">Game Not Found</h1>;
  }

  return (
    <div className="bg-white p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-black text-start px-4 py-2 rounded"
      >
        Back
      </button>
      <h1 className="text-2xl font-bold mb-4">{game.name}</h1>
      <iframe
        src={game.url}
        width={game.width}
        height={game.height}
        className="border rounded-lg"
      ></iframe>
    </div>
  );
}

export default GamePlayer;
