import { View, Panel, AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui';
import { useEffect } from 'react';
import { useAppSelector } from '../../hooks/use-store';
import { NotDefaultTheme } from '../../store/reducers/settingsSlice';
import Inbox from '../inbox/Inbox';

const App = () => {
  const settings = useAppSelector((state) => state.settings);

  useEffect(() => {
    if (settings.notDefaultTheme) {
      document.body.classList.remove('vkui--vkBase--dark');
      if (settings.notDefaultTheme === NotDefaultTheme.MONOCHROME) {
        document.body.classList.remove('vkui--vkBase--light');
      }
      document.body.classList.remove('vkui--vkBase--monochrome');
      document.body.classList.remove('vkui--vkBase--dog');
      document.body.classList.remove('vkui--vkBase--cat');
      document.body.classList.add(`vkui--vkBase--${settings.notDefaultTheme}`);
    } else {
      document.body.classList.remove('vkui--vkBase--monochrome');
      document.body.classList.remove('vkui--vkBase--dog');
      document.body.classList.remove('vkui--vkBase--cat');
    }
  }, [settings]);

  return (
    <ConfigProvider appearance={settings.theme}>
      <AdaptivityProvider>
        <AppRoot>
          <View activePanel="inbox">
            <Panel id="inbox">
              <Inbox />
            </Panel>
          </View>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
