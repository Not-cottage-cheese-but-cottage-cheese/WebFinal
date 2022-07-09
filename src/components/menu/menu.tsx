import {
  Icon20MailOutline,
  Icon20BookmarkOutline,
  Icon20ExclamationMarkOutline,
  Icon20RoubleOutline,
  Icon20KeyOutline
} from '@vkontakte/icons';
import { Panel, PanelHeader, Group, List, Cell, Caption } from '@vkontakte/vkui';

import styles from './menu.module.css';

const Menu = ({ activeCategory, getMails }: { activeCategory: string; getMails: (category: string) => void }) => {
  return (
    <Panel>
      <PanelHeader separator={false} />
      <Group mode="plain" className={styles.group}>
        <List>
          <Cell
            className={styles.cell}
            expandable
            before={<Icon20MailOutline />}
            style={
              activeCategory === 'all'
                ? {
                    backgroundColor: 'var(--button_secondary_background)',
                    borderRadius: 8
                  }
                : {}
            }
            onClick={() => getMails('all')}
          >
            <Caption level="1">Все входящие</Caption>
          </Cell>
          <Cell
            className={styles.cell}
            expandable
            before={<Icon20BookmarkOutline />}
            style={
              activeCategory === 'flag'
                ? {
                    backgroundColor: 'var(--button_secondary_background)',
                    borderRadius: 8
                  }
                : {}
            }
            onClick={() => getMails('flag')}
          >
            <Caption level="1">С флагом</Caption>
          </Cell>
          <Cell
            className={styles.cell}
            expandable
            before={<Icon20ExclamationMarkOutline />}
            style={
              activeCategory === 'important'
                ? {
                    backgroundColor: 'var(--button_secondary_background)',
                    borderRadius: 8
                  }
                : {}
            }
            onClick={() => getMails('important')}
          >
            <Caption level="1">Важные</Caption>
          </Cell>
          <Cell
            className={styles.cell}
            expandable
            before={<Icon20RoubleOutline />}
            style={
              activeCategory === 'finance'
                ? {
                    backgroundColor: 'var(--button_secondary_background)',
                    borderRadius: 8
                  }
                : {}
            }
            onClick={() => getMails('finance')}
          >
            <Caption level="1">Финансы</Caption>
          </Cell>
          <Cell
            className={styles.cell}
            expandable
            before={<Icon20KeyOutline />}
            style={
              activeCategory === 'confidence'
                ? {
                    backgroundColor: 'var(--button_secondary_background)',
                    borderRadius: 8
                  }
                : {}
            }
            onClick={() => getMails('confidence')}
          >
            <Caption level="1">Доверенный</Caption>
          </Cell>
        </List>
      </Group>
    </Panel>
  );
};

export default Menu;
