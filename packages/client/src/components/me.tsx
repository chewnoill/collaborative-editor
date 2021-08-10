import { useCurrentUser } from "apollo/selectors";
import React from "react";

export default function Me() {
  const user = useCurrentUser();
  return <label>{user?.name || "not logged in"}</label>;
}
