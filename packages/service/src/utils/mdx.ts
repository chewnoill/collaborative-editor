import { renderToString } from "mdx-hydra/build/render-to-string";
import fm from "front-matter";
import emoji from "remark-emoji";
const rehypePrism = require("@mapbox/rehype-prism");

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
      rehypePlugins: [[rehypePrism, { ignoreMissing: true }]],
    });
  } catch (e) {
    return renderToString({
      source: `## rendering error\n${e}`,
      Wrapper: ({ children }) => children,
    });
  }
}
