import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwlLight";

const HighlightHistory = ({
  code,
  username,
  timeslice,
}: {
  code: string;
  username;
  timeslice;
}) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>{username}</span> <span>{timeslice}</span>
    </div>
    <Highlight {...defaultProps} theme={theme} code={code} language="diff">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
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
  </div>
);

export default HighlightHistory;
