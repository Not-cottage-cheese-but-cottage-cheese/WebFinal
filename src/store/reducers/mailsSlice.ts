import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mail } from "../../interface/mail";

const initialState: { shortMails: mail.ShortMail[]; mails: mail.Mail[] } = {
  shortMails: [],
  mails: [],
};

export const mailsSlice = createSlice({
  name: "base",
  initialState,
  reducers: {
    setMails(state, action: PayloadAction<mail.Mail[]>) {
      state.mails = action.payload;
      state.shortMails = action.payload.map((mail) => ({
        author: mail.author,
        title: mail.title,
        dateTime: mail.dateTime,
        text: mail.text.slice(0, 50),
      }));
    },
    resetMails(state) {
      state.shortMails = initialState.shortMails;
      state.mails = initialState.mails;
    },
  },
});

export const { setMails, resetMails } = mailsSlice.actions;

export default mailsSlice.reducer;
