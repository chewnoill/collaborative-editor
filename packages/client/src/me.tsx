import React from "react";
import fetch from "node-fetch";

export default function Me() {
  const [me, setMe] = React.useState(null);
  React.useEffect(() => {
    fetch("/api/me")
      .then((data) => data.json())
      .then((data) => {
        if (!data.user) return;

        setMe(data.user);
      });
  }, []);

  console.log({ me });
  return <label>{me?.username || "not logged in"}</label>;
}
