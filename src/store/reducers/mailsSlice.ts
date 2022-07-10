import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mail } from '../../interface/mail';

const initialState: { mails: mail.Mail[] } = {
  mails: []
};

export const mailsSlice = createSlice({
  name: 'base',
  initialState,
  reducers: {
    setMails(state, action: PayloadAction<{ mails: mail.Mail[]; insert: boolean; clear: boolean }>) {
      if (action.payload.clear) {
        state.mails = action.payload.mails;
      } else if (state.mails.length === 0) {
        state.mails = action.payload.mails;
      } else if (state.mails.length === 20) {
        state.mails = action.payload.insert
          ? [...state.mails, ...action.payload.mails]
          : [...action.payload.mails, ...state.mails];
      } else if (state.mails.length === 40) {
        state.mails = action.payload.insert
          ? [...state.mails.slice(20, 40), ...action.payload.mails]
          : [...action.payload.mails, ...state.mails.slice(20, 40)];
      }
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
