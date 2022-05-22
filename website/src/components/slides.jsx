import React from "react";
import Reveal from "reveal.js";
import Mermaid from "mermaid";
import Highlight from "reveal.js/plugin/highlight/highlight";
import Markdown from "reveal.js/plugin/markdown/markdown";
import Search from "reveal.js/plugin/search/search.js";
import Notes from "reveal.js/plugin/notes/notes.js";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/simple.css";
import "reveal.js/plugin/highlight/zenburn.css";

export default function Slides({ deckName }) {
  React.useEffect(() => {
    Mermaid.initialize({
      logLevel: "error", // [1]
      securityLevel: "loose", // [2]
      startOnLoad: true,
    });
    let deck = new Reveal({
      controls: true,
      progress: true,
      history: true,
      center: true,
      plugins: [Markdown, Highlight, Search, Notes],
    });

    deck.initialize();
    setTimeout(() => Mermaid.init({ noteMargin: 10 }, ".mermaid"), 200);
  }, []);
  return (
    <div className="reveal" style={{ height: "100vh" }}>
      <style>{`
blockquote {
  text-align: left;
}
`}</style>
      <div className="slides">
        <section
          data-markdown={`/website/decks/${deckName}.md`}
          data-separator="^\n---$"
          data-separator-vertical="^\n-v-$"
        />
      </div>
    </div>
  );
}
