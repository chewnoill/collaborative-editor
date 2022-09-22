import React from "react";
import mermaid from "mermaid";

let mermaidId = 0;

const Mermaid = ({ name, children: code }) => {
  const [html, setHtml] = React.useState("");
  React.useEffect(() => {
    mermaidId += 1;
    mermaid.mermaidAPI.render(`${name}-${mermaidId}`, code, (html) => setHtml(html));
  }, []);
  return (
    <div className="mermaid" dangerouslySetInnerHTML={{ __html: html }}></div>
  );
};

export default Mermaid;
