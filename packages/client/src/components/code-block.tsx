import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import darkTheme from "prism-react-renderer/themes/nightOwl";
import lightTheme from "prism-react-renderer/themes/nightOwlLight";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@mui/material";

const Mermaid = dynamic<any>(() => import("./mermaid"), {
  ssr: false,
});

const CodeBlock = ({
  children,
  className: lang = "",
}: {
  className;
  children;
}) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  if (lang === "language-mermaid") {
    return <Mermaid name="diagram">{children}</Mermaid>;
  }
  return (
    <Highlight
      {...defaultProps}
      theme={prefersDarkMode ? darkTheme : null}
      code={children}
      language={lang.split("language-")[1] || "text"}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, overflow: "hidden" }}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default CodeBlock;
