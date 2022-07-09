import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Icon16BookmarkOutline, Icon16Bookmark, Icon20MailOutline, Icon16New } from '@vkontakte/icons';
import {
  withAdaptivity,
  usePlatform,
  Group,
  VKCOM,
  SplitLayout,
  PanelHeader,
  SplitCol,
  Panel,
  Cell,
  Avatar,
  Caption,
  List,
  Text,
  ViewWidth,
  Checkbox,
  Button
} from '@vkontakte/vkui';
import { TextTooltip } from '@vkontakte/vkui/dist/unstable';

import { mailsApi } from '../../store/services/mails';

import inboxStyles from './inbox.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks/use-store';
import { setMails, updateMail, updateMails } from '../../store/reducers/mailsSlice';
import AdditionalIcons from '../additional-icons/additionalIcons';

const Inbox = withAdaptivity(
  ({ viewWidth }) => {
    const { data, isLoading, isSuccess } = mailsApi.useFetchMailsQuery('');
    const [patchMail] = mailsApi.usePatchMailMutation();
    const [patchMails] = mailsApi.usePatchMailsMutation();
    const [activeMail, setActiveMail] = useState(-1);
    const [hoveredMail, setHoveredMail] = useState(-1);
    const [selectedMail, setSelectedMail] = useState<number[]>([]);
    const platform = usePlatform();
    const dispatch = useAppDispatch();
    const mails = useAppSelector((state) => state.mails);

    const hasHeader = platform !== VKCOM;
    const isDesktop = (viewWidth || 0) >= ViewWidth.TABLET;

    useEffect(() => {
      if (data) {
        dispatch(setMails(data));
      }
    }, [data, dispatch]);

    const handleIncomingClick = useCallback(() => {
      // if (!isDesktop) {
      //   setActiveCol([0]);
      //   setActiveMail(-1);
      // }
    }, []);

    const handleSelectedAll = () => {
      if (selectedMail.length === mails.mails.length) {
        setSelectedMail([]);
      } else {
        setSelectedMail([...mails.mails.map((mail, mailIndex) => mailIndex)]);
      }
    };

    const handleCheckboxCellClick = (e: SyntheticEvent, index: number) => {
      if (selectedMail.includes(index)) {
        setSelectedMail([...selectedMail.filter((mailId) => mailId !== index)]);
      } else {
        setSelectedMail([...selectedMail, index]);
      }
      e.stopPropagation();
    };

    const handleManyReadClick = async (read: boolean) => {
      const body = {
        read
      };

      const selectedMailsIds = mails.mails
        .filter((mail, mailIndex) => selectedMail.includes(mailIndex))
        .map((mail) => mail._id);

      await patchMails({ id: selectedMailsIds, body }).then((response) => {
        if ('data' in response) {
          if (response.data.isSuccess) {
            dispatch(updateMails({ index: selectedMail, data: { read } }));
            setSelectedMail([]);
          }
        }
      });
    };

    const handleReadClick = async (e: SyntheticEvent, index: number) => {
      e.stopPropagation();
      const body = {
        read: !mails.mails[index].read
      };
      await patchMail({ id: mails.mails[index]._id, body }).then((response) => {
        if ('data' in response) {
          if (response.data.isSuccess) {
            dispatch(updateMail({ index, data: { read: !mails.mails[index].read } }));
          }
        }
      });
    };

    const handleBookmarkClick = async (e: SyntheticEvent, index: number) => {
      e.stopPropagation();
      const body = {
        flag: !mails.mails[index].flag
      };
      await patchMail({ id: mails.mails[index]._id, body }).then((response) => {
        if ('data' in response) {
          if (response.data.isSuccess) {
            dispatch(updateMail({ index, data: { flag: !mails.mails[index].flag } }));
          }
        }
      });
    };

    if (isLoading) {
      return <div>Загрузка</div>;
    }

    if (isSuccess) {
      return (
        <SplitLayout
          style={{ justifyContent: 'space-between' }}
          header={hasHeader && <PanelHeader separator={false} />}
        >
          <SplitCol fixed width={isDesktop ? 170 : 50} maxWidth={isDesktop ? 170 : 50} spaced>
            <Panel>
              <PanelHeader separator={false} />
              <Group mode="plain" className={inboxStyles.group}>
                <List>
                  <Cell
                    expandable
                    before={<Icon20MailOutline />}
                    style={{
                      backgroundColor: 'var(--button_secondary_background)',
                      borderRadius: 8
                    }}
                    onClick={handleIncomingClick}
                  >
                    <Caption level="1">Входящие</Caption>
                  </Cell>
                </List>
              </Group>
            </Panel>
          </SplitCol>

          <SplitCol spaced>
            <Panel>
              {hasHeader && (
                <PanelHeader separator={false}>
                  <div className={inboxStyles.header}>
                    <Checkbox checked={selectedMail.length === mails.mails.length} onClick={handleSelectedAll}>
                      {selectedMail.length === mails.mails.length ? 'Снять все' : 'Выделить все'}
                    </Checkbox>
                    {selectedMail.length > 0 && (
                      <>
                        <Button mode="tertiary" onClick={() => handleManyReadClick(true)}>
                          Отметить прочитанными
                        </Button>
                        <Button mode="tertiary" onClick={() => handleManyReadClick(false)}>
                          Отметить непрочитанным
                        </Button>
                      </>
                    )}
                  </div>
                </PanelHeader>
              )}
              <Group
                className={inboxStyles.group}
                mode="plain"
                style={{
                  overflow: 'scroll',
                  height: 'calc(100vh - var(--panelheader_height) - var(--formitem_padding))'
                }}
              >
                <List>
                  {mails?.mails?.map((mail, mailIndex) => (
                    <Cell
                      key={mailIndex}
                      disabled={mailIndex === activeMail}
                      className={inboxStyles.cell}
                      onEnter={() => setHoveredMail(mailIndex)}
                      onLeave={() => setHoveredMail(-1)}
                      before={
                        <>
                          <TextTooltip text={mail.read ? 'Пометить непрочитаным' : 'Пометить прочитаным'}>
                            <Icon16New className={inboxStyles.new} onClick={(e) => handleReadClick(e, mailIndex)} />
                          </TextTooltip>
                          {mailIndex === hoveredMail ? (
                            <Checkbox
                              checked={selectedMail.includes(mailIndex)}
                              onClick={(e) => handleCheckboxCellClick(e, mailIndex)}
                            />
                          ) : (
                            <TextTooltip text={mail.author.email}>
                              <Avatar size={28} src={mail.author.avatar} />
                            </TextTooltip>
                          )}
                        </>
                      }
                      style={
                        selectedMail.includes(mailIndex)
                          ? {
                              backgroundColor: 'var(--button_secondary_background)',
                              borderRadius: 8
                            }
                          : {
                              backgroundColor: 'var(--background_content)',
                              borderRadius: 8
                            }
                      }
                      onClick={() => setActiveMail(mailIndex)}
                    >
                      <div className={inboxStyles.container}>
                        <Text weight={mail.read ? '3' : '1'} className={inboxStyles.author}>
                          {mail.author.name}
                        </Text>
                        <TextTooltip text={mail.flag ? 'Снять флаг' : 'Отметить флагом'}>
                          <div
                            className={`${inboxStyles.flag} ${mail.flag ? `${inboxStyles.selected}` : ''}`}
                            onClick={(e) => handleBookmarkClick(e, mailIndex)}
                          >
                            {mail.flag ? <Icon16Bookmark /> : <Icon16BookmarkOutline />}
                          </div>
                        </TextTooltip>
                        <div className={inboxStyles.title}>
                          <Text weight={mail.read ? '3' : '1'} className={inboxStyles['title--text']}>
                            {mail.title}
                          </Text>
                          <Text weight="3" className={inboxStyles['title--content']}>
                            {mail.text.slice(0, 100)}
                          </Text>
                        </div>
                        <Text weight="3" className={inboxStyles.time}>
                          {mail.dateTime}
                        </Text>
                        <AdditionalIcons mail={mail} />
                      </div>
                    </Cell>
                  ))}
                </List>
              </Group>
            </Panel>
          </SplitCol>
        </SplitLayout>
      );
    }

    return <div>Такого не должно было произойти :(</div>;
  },
  {
    viewWidth: true
  }
);

export default Inbox;
