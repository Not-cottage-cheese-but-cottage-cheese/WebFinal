import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appearance } from '@vkontakte/vkui';

export enum NotDefaultTheme {
  MONOCHROME = 'monochrome',
  CAT = 'cat',
  DOG = 'dog',
}

const initialState: { theme: Appearance; notDefaultTheme: NotDefaultTheme | undefined } = {
  theme: Appearance.LIGHT,
  notDefaultTheme: undefined
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Appearance | NotDefaultTheme>) {
      if (Object.values(Appearance).includes(action.payload as Appearance)) {
        state.theme = action.payload as Appearance;
        state.notDefaultTheme = initialState.notDefaultTheme;
      } else {
        state.theme = Appearance.LIGHT;
        state.notDefaultTheme = action.payload as NotDefaultTheme;
      }
    },
    resetNotDefaultTheme(state) {
      state.notDefaultTheme = initialState.notDefaultTheme;
    }
  }
});

export const { setTheme, resetNotDefaultTheme } = settingsSlice.actions;

export default settingsSlice.reducer;
