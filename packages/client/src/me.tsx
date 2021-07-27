import React from "react";
import fetch from "node-fetch";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser } from "./redux/user";

export default function Me() {
  const me = useSelector(selectUser);
  const dispatch = useDispatch();
  React.useEffect(() => {
    fetch("/api/me")
      .then((data) => data.json())
      .then((data) => {
        if (!data.user) return;
        dispatch(login(data.user));
      });
  }, []);

  console.log({ me });
  return <label>{me?.username || "not logged in"}</label>;
}
