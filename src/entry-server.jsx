import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import Head from "./components/Head";
import { metaData } from "./meta/index.js";

export async function render(url) {
  const route = url === "/" ? "home" : url.replace("/", "");
  const meta = metaData[route] || metaData["home"];

  const appHtml = renderToString(<App />);
  const headTags = Head(meta);

  return {
    html: `
      <!DOCTYPE html>
      <html lang="uk">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          ${headTags}
        </head>
        <body>
          <div id="root">${appHtml}</div>
        </body>
      </html>
    `,
  };
}

