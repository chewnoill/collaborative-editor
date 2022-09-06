import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwlLight";

const CodeBlock = ({
  children,
  className: lang = "",
}: {
  className;
  children;
}) => (
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

export default CodeBlock;
