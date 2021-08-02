import { gql, useQuery } from "@apollo/client";
import React from "react";

export default function Me() {
  const { data, loading } = useQuery(gql`
    query getCurrentUser {
      me {
        id
        name
      }
    }
  `);
  if (loading) return <label> loading... </label>;
  return <label>{data?.me?.name || "not logged in"}</label>;
}
