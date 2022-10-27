import styled from "@emotion/styled";

const Span = styled.span`
  align-self: center;
  font-family: system-ui;
  line-height: 1.5;
  font-size: 15px;
  font-weight: 100;

  & > .primary {
    color: #333333; /* dark gray not black */
    font-weight: 900;
  }
  @media (prefers-color-scheme: dark) {
    & {
      color: white;
    }
    & > .primary {
      color: white; /* dark gray not black */
      font-weight: 900;
    }
  }
`;

export default function Logo() {
  return (
    <Span>
      <span className="primary">Will</span>Docs
    </Span>
  );
}
