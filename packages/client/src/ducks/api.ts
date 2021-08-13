import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserDocument } from "./types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    postDocument: builder.mutation<UserDocument, Partial<UserDocument>>({
      query: ({name}) => ({
        url: "/document",
        method: "POST",
        body: name,
      }),
      transformResponse: (response: { document: UserDocument }) =>
        response.document,
    }),
    getDocuments: builder.query<UserDocument[], void>({
      query: () => ({
        url: "/documents",
        method: "GET",
      }),
      transformResponse: (response: { documents: UserDocument[] }) =>
        response.documents,
    }),
  }),
});

export const { usePostDocumentMutation, useGetDocumentsQuery } = api;

export default api;
