import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mail } from '../../interface/mail';

const initialState: { mails: mail.Mail[] } = {
  mails: []
};

export const mailsSlice = createSlice({
  name: 'base',
  initialState,
  reducers: {
    setMails(state, action: PayloadAction<mail.Mail[]>) {
      state.mails = action.payload;
    },
    updateMail(state, action: PayloadAction<{ index: number; data: Partial<mail.Mail> }>) {
      state.mails[action.payload.index] = {
        ...state.mails[action.payload.index],
        ...action.payload.data
      };
    },
    updateMails(state, action: PayloadAction<{ index: number[]; data: Partial<mail.Mail> }>) {
      action.payload.index.forEach((id) => {
        state.mails[id] = {
          ...state.mails[id],
          ...action.payload.data
        };
      });
    },
    resetMails(state) {
      state.mails = initialState.mails;
    }
  }
});

export const { setMails, updateMail, updateMails, resetMails } = mailsSlice.actions;

export default mailsSlice.reducer;
