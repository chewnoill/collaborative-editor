import * as React from "react";
import Box from "@mui/system/Box";
import { useSelector } from "react-redux";
import { selectYDocumentAwareness } from "ducks/appState/y-doc";
import styled from "@emotion/styled";

const Peer = styled.span(
  ({ color }) => `
background-color: ${color};
color: white;
padding: 2px 10px;
margin: 2px;
`
);

export default function WhosHere({ document_id }) {
  const awareness = useSelector((store) =>
    selectYDocumentAwareness(store, { id: document_id })
  );
  const [peers, setPeers] = React.useState([]);
  React.useEffect(() => {
    if (!awareness) return;
    function TrackWhosHere() {
      const users = [];
      awareness.getStates().forEach((state) => {
        if (state.user) users.push(state.user);
      });
      setPeers(users);
    }
    awareness.on("change", TrackWhosHere);
    return () => {
      awareness.off("change", TrackWhosHere);
    };
  }, [awareness]);
  return (
    <Box sx={{ alignItems: "center", display: "flex" }}>
      {peers.map(({ name, color }, i) => (
        <Peer key={`${name}-${i}`} color={color}>
          {name}
        </Peer>
      ))}
    </Box>
  );
}
