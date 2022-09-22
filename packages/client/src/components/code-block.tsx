import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwlLight";
import dynamic from "next/dynamic";

const Mermaid = dynamic<any>(
  () => import("./mermaid"),
  {
    ssr: false,
  }
);

const CodeBlock = ({
  children,
  className: lang = "",
}: {
  className;
  children;
}) => {
  if(lang === "language-mermaid"){
    console.log({children});
    return <Mermaid name="diagram">
      {children}
    </Mermaid>
  }
  return (
  <Highlight
    {...defaultProps}
    theme={theme}
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
            }

export default CodeBlock;
