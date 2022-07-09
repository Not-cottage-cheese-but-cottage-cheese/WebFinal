import { View, Panel } from "@vkontakte/vkui";
import Inbox from "../inbox/Inbox";

const App = () => {
  return (
    <View activePanel="inbox">
      <Panel id="inbox">
        <Inbox />
      </Panel>
    </View>
  );
};

export default App;
