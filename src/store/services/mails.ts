import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { mail } from '../../interface/mail';

export const mailsApi = createApi({
  reducerPath: 'mailsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000'
  }),
  endpoints: (build) => ({
    fetchMails: build.query<mail.Mail[], string>({
      query: (category) => `mails/incoming/${category}`,
      transformResponse: (response: { isSuccess: boolean; data: mail.Mail[]; message?: string }) => response.data
    }),
    patchMail: build.mutation<{ isSuccess: boolean; message?: string }, { id: string; body: Partial<mail.Mail> }>({
      query: (body) => {
        return {
          url: `mails/${body.id}`,
          method: 'PATCH',
          body: { ...body.body }
        };
      }
    }),
    patchMails: build.mutation<{ isSuccess: boolean; message?: string }, { id: string[]; body: Partial<mail.Mail> }>({
      query: (body) => {
        return {
          url: 'mails',
          method: 'PATCH',
          body: { ...body }
        };
      }
    })
  })
});
