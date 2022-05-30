import * as React from "react";
import Box from "@mui/system/Box";
import useYDoc from "hooks/use-y-doc";

export default function WhosHere({ document_id }) {
  const [peers, setPeers] = React.useState([]);
  const {
    rtcProvider: { awareness },
  } = useYDoc(document_id);
  React.useEffect(() => {
    awareness.on("change", () => {
      const users = [];
      awareness.getStates().forEach((state) => {
        if (state.user) users.push(state.user);
      });
      setPeers(users);
    });
  }, []);
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
