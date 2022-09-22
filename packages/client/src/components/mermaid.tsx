import React from "react";
import mermaid from "mermaid";

const Mermaid = ({ name, children: code }) => {
  const [html, setHtml] = React.useState("");
  React.useEffect(() => {
    mermaid.mermaidAPI.render(name, code, (html) => setHtml(html));
  }, []);
  return (
    <div className="mermaid" dangerouslySetInnerHTML={{ __html: html }}></div>
  );
};

export default Mermaid;
