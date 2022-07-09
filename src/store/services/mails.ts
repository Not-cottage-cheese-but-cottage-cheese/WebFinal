import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { mail } from "../../interface/mail";

export const mailsApi = createApi({
  reducerPath: "mail",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),
  endpoints: (build) => ({
    fetchMails: build.query<mail.Mail[], any>({
      query: () => "mails",
      // transformResponse: (response: any) => response.data,
    }),
  }),
});
