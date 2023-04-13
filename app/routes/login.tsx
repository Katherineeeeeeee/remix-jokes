import type { LinksFunction, ActionArgs } from "@remix-run/node";
import { Link, useSearchParams, Form, useActionData } from "@remix-run/react";

import { json, redirect } from "@remix-run/node";

import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";

import styles from "~/styles/login.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

function validateUrl(url: unknown) {
  let urls = ["/jokes", "/", "https://remix.run"];
  if (urls.includes("url")) {
    return url;
  }

  return "/jokes";
}

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  const loginType = form.get("loginType");
  const redirectTo = validateUrl(form.get("redirectTo") || "/jokes");

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof loginType !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
  }

  switch (loginType) {
    case "login": {
      return badRequest({
        fieldErrors: null,
        fields: null,
        formError: `Not implemented.`,
      });
    }
    case "register": {
      const userExists = await db.user.findFirst({
        where: { username },
      });

      if (userExists) {
        return badRequest({
          fieldErrors: null,
          // fields,
          formError: `Not implemented.`,
        });
      }
    }
  }
}

export default function Login() {
  const [searchParams] = useSearchParams();

  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <Form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <fieldset>
            <legend className="sr-only">Login or Register?</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked
              />
              Login
            </label>
            <label>
              <input type="radio" name="loginType" value="register" /> Register
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">Username</label>
            <input type="text" id="username-input" name="username" />
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input id="password-input" name="password" type="password" />
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </Form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/jokes">Jokes</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
