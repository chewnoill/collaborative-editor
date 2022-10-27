import React from "react";
import mermaid from "mermaid";
import { useMediaQuery } from "@mui/material";

let mermaidId = 0;

const Mermaid = ({ name, children: code }) => {
  const [html, setHtml] = React.useState("");
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  React.useEffect(() => {
    mermaid.mermaidAPI.initialize({
      securityLevel: "loose",
      theme: prefersDarkMode ? "dark" : "light",
    });
    mermaidId += 1;
    mermaid.mermaidAPI.render(`${name}-${mermaidId}`, code, (html) =>
      setHtml(html)
    );
  }, [prefersDarkMode]);
  return (
    <div className="mermaid" dangerouslySetInnerHTML={{ __html: html }}></div>
  );
};

export default Mermaid;
