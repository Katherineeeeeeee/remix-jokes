import { Outlet, Link, useLoaderData } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import jokes from "../styles/jokes.css";
import { db } from "~/utils/db.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: jokes }];
};

export const loader = async () => {
  return json({
    jokeList: await db.joke.findMany({
      take: 4,
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    }),
  });
};

export default function JokesRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {data.jokeList.map((j) => (
                <li key={j.id}>
                  <Link to={j.id}>{j.name}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
