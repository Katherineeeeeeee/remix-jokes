// import { useActionData } from "@remix-run/react";
// import type { ActionArgs } from "@remix-run/node";
// import { json, redirect } from "@remix-run/node";

// import { db } from "~/utils/db.server";

// export async function action({ request }: ActionArgs) {
//   const form = await request.formData();
//   const name = form.get("name");
//   const content = form.get("content");
//   const errors = {};

//   //validation
//   if (typeof name !== "string" || name.length < 3) {
//     errors.name = "That joke's name is too short";
//   }

//   if (typeof content !== "string" || content.length < 10) {
//     errors.content = "That joke's is too short";
//   }
//   if (Object.keys(errors).length) {
//     return json(errors, { status: 422 });
//   }

//   const joke = await db.joke.create({ data: { name, content } });
//   return redirect(`/jokes/${joke.id}`);
// }

// export default function NewJokes() {
//   const errors = useActionData<typeof action>();

//   return (
//     <div>
//       <p>Add your own hilarious joke</p>
//       <form action="" method="post">
//         <div>
//           <label>
//             Name: <input type="text" name="name" />
//             {errors?.name ? <span>{errors.name}</span> : null}
//           </label>
//         </div>

//         <div>
//           <label>
//             Content: <input type="text" name="content" />
//             {errors?.content ? <span>{errors.content}</span> : null}
//           </label>
//         </div>

//         <div>
//           <button type="submit">Add</button>
//         </div>
//       </form>
//     </div>
//   );
// }

import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return `That joke is too short`;
  }
}

function validateJokeName(name: string) {
  if (name.length < 3) {
    return `That joke's name is too short`;
  }
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");
  if (typeof name !== "string" || typeof content !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
  }

  const fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content),
  };
  const fields = { name, content };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const joke = await db.joke.create({ data: fields });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            Name:{" "}
            <input
              type="text"
              defaultValue={actionData?.fields?.name}
              name="name"
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-errormessage={
                actionData?.fieldErrors?.name ? "name-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" role="alert" id="name-error">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.content) || undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.content ? "content-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              role="alert"
              id="content-error"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p className="form-validation-error" role="alert">
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
