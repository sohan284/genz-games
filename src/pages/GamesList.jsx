import { Link } from "react-router-dom";

const games = [
  {
    id: 1,
    name: "Game 1",
    image: "https://via.placeholder.com/150", // Replace with actual image
    url: "https://html5.gamedistribution.com/788f89d325d840f391139ce0e1212c46/",
  },
  {
    id: 2,
    name: "Game 2",
    image: "https://via.placeholder.com/150",
    url: "https://html5.gamedistribution.com/3c2a5af31a50409da0e7df5742fcf05b/",
  },
  {
    id: 3,
    name: "Moto X3M",
    image:
      "https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=94,height=94,fit=cover,f=auto/2c6d5a46cdbceada277c870ce1c389ee.jpg",
    url: "https://html5.gamedistribution.com/ea1e352d227b4291baf854c2fa0f2e48/",
  },
];

function GamesList() {
  return (
    <div className="bg-white p-4 px-10">
      <h1 className="text-xl font-bold">Games List</h1>
      <div className="grid grid-cols-7 lg:grid-cols-12 gap-1">
        {games.map((game) => (
          <Link key={game.id} to={`/game/${game.id}`} className="block">
            <div className="group relative border rounded-lg shadow hover:shadow-lg w-[100px] h-[100px] overflow-hidden">
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute pt-10 inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h2 className="text-white text-md font-semibold">
                  {game.name}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GamesList;
