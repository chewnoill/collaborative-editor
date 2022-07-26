import * as React from "react";
import Box from "@mui/system/Box";
import { useSelector } from "react-redux";
import { selectYDocumentAwareness } from "ducks/appState/y-doc";

export default function WhosHere({ document_id }) {
  const awareness = useSelector((store) =>
    selectYDocumentAwareness(store, { id: document_id })
  );
  const [peers, setPeers] = React.useState([]);
  React.useEffect(() => {
    if (!awareness) return;
    awareness.on("change", () => {
      const users = [];
      awareness.getStates().forEach((state) => {
        if (state.user) users.push(state.user);
      });
      setPeers(users);
    });
  }, [awareness]);
  return (
    <Box>
      Who's here now?
      <ul>
        {peers.map((peer) => (
          <li key={peer.name}>{peer.name}</li>
        ))}
      </ul>
    </Box>
  );
}
