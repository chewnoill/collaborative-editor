import { renderToString } from "mdx-hydra/build/render-to-string";
import fm from "front-matter";
import emoji from "remark-emoji";
import logger from "../logger";
import escapeHtml from "escape-html";

function scopedMessage(txt: string, extraScope: object = {}) {
  try {
    const { body, attributes = {} } = fm<object>(txt);
    return {
      source: body,
      components: {
        // add some components
      },
      scope: {
        ...attributes,
        ...extraScope,
      },
    };
  } catch (e) {
    return {
      source: txt,
      scope: {
        error: e,
      },
    };
  }
}

export function safeRenderString(txt: string, extraScope: object) {
  const mdxContext = scopedMessage(txt, extraScope);
  try {
    return renderToString({
      ...mdxContext,
      Wrapper: ({ children }) => children,
      remarkPlugins: [emoji],
    });
  } catch (e) {
    logger({
      level: "error",
      service: "mdx renderer",
      stack: e.stack,
      name: e.name,
      error_message: e.message,
    });
    return {
      code: "",
      staticMDX: `<div><h2>Render Error</h2><pre>${txt
        .split("\n")
        .map(escapeHtml)
        .join("\n")}</pre></div>`,
      scope: {},
    };
  }
}
