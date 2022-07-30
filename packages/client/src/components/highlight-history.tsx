import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwlLight";

const HighlightHistory = ({
  code,
  users,
  timeslice,
}: {
  code: string;
  users;
  timeslice;
}) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>{users[0]?.name}</span>
      <span>{timeslice && new Date(timeslice).toLocaleString()}</span>
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
