import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import {
  Icon16BookmarkOutline,
  Icon16Bookmark,
  Icon16New,
  Icon20Attach,
  Icon20PictureOutline,
  Icon20DocumentOutline,
  Icon20TableHeaderOutline
} from '@vkontakte/icons';
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
  List,
  Text,
  ViewWidth,
  Checkbox,
  Button,
  ScreenSpinner,
  ModalPage,
  ModalPageHeader,
  ModalRoot,
  Card,
  CardGrid,
  Appearance
} from '@vkontakte/vkui';
import { TextTooltip, RichTooltip } from '@vkontakte/vkui/dist/unstable';

import { mailsApi } from '../../store/services/mails';

import inboxStyles from './inbox.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks/use-store';
import { setMails, updateMail, updateMails } from '../../store/reducers/mailsSlice';
import { NotDefaultTheme, setTheme } from '../../store/reducers/settingsSlice';
import AdditionalIcons from '../additional-icons/additionalIcons';
import Menu from '../menu/menu';

const Inbox = withAdaptivity(
  ({ viewWidth }) => {
    const [patchMail] = mailsApi.usePatchMailMutation();
    const [patchMails] = mailsApi.usePatchMailsMutation();
    const [activeMail, setActiveMail] = useState(-1);
    const [hoveredMail, setHoveredMail] = useState(-1);
    const [selectedMail, setSelectedMail] = useState<number[]>([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [prevCategory, setPrevCategory] = useState('all');
    const [popout, setPopout] = useState<any>(null);
    const [modal, setModal] = useState('');
    const [offset, setOffset] = useState(0);
    const [prevOffset, setPrevOffset] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    const { data, isLoading, isFetching, refetch } = mailsApi.useFetchMailsQuery({
      category: activeCategory,
      offset: offset,
      limit: 20
    });
    const platform = usePlatform();
    const dispatch = useAppDispatch();
    const mails = useAppSelector((state) => state.mails);
    const scrollRef = useRef<any>(null);

    const hasHeader = platform !== VKCOM;
    const isDesktop = (viewWidth || 0) >= ViewWidth.TABLET;

    useEffect(() => {
      if (data) {
        if (scrollRef?.current) {
          if (!isLoading && !isFetching) {
            if (prevCategory !== activeCategory) {
              scrollRef.current.scrollTop = 0;
            } else if (offset > prevOffset) {
              scrollRef.current.scrollTop = scrollTop;
            } else {
              scrollRef.current.scrollTop = scrollRef.current.clientHeight + scrollTop;
            }
          }
        }
        dispatch(setMails({ mails: data, insert: offset > prevOffset, clear: prevCategory !== activeCategory }));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, dispatch]);

    useEffect(() => {
      if (offset > prevOffset && offset === 1) {
        setScrollTop(scrollRef.current.scrollTop);
      }
      refetch();
    }, [offset, prevOffset, refetch]);

    useEffect(() => {
      if (isLoading || isFetching) {
        setPopout(<ScreenSpinner />);
      } else {
        setPopout(null);
      }
    }, [isLoading, isFetching]);

    useEffect(() => {
      if (scrollRef?.current) {
        scrollRef.current.addEventListener('scroll', async () => {
          setPrevCategory(activeCategory);
          if (scrollRef?.current) {
            if (scrollRef.current.scrollTop + scrollRef.current.clientHeight >= scrollRef.current.scrollHeight) {
              if (mails.mails.length === 40 || offset === 0) {
                setPrevOffset(offset);
                setOffset(offset + 1);
              }
            }
            if (scrollRef.current.scrollTop === 0) {
              setPrevOffset(offset);
              setOffset(offset === 0 ? 0 : offset - 1);
            }
          }
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mails.mails.length, offset, scrollRef]);

    const getMails = useCallback(async (category = 'all') => {
      setSelectedMail([]);
      setActiveMail(-1);
      setOffset(0);
      setPrevOffset(0);
      setPrevCategory(activeCategory);
      setActiveCategory(category);
      // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const modalRoot = (
      <ModalRoot activeModal={modal}>
        <ModalPage id="settings" onClose={() => setModal('')} header={<ModalPageHeader>Настройки</ModalPageHeader>}>
          <Group>
            <CardGrid size="s" style={{ padding: '10px' }}>
              <Card style={{ backgroundColor: '#F5F5F5' }} onClick={() => dispatch(setTheme(Appearance.LIGHT))}>
                <div style={{ height: 96, color: 'black' }}>Светлая тема</div>
              </Card>
              <Card style={{ backgroundColor: '#232324' }} onClick={() => dispatch(setTheme(Appearance.DARK))}>
                <div style={{ height: 96, color: 'white' }}>Темная тема</div>
              </Card>
              <Card style={{ backgroundColor: 'white' }} onClick={() => dispatch(setTheme(NotDefaultTheme.MONOCHROME))}>
                <div style={{ height: 96, color: 'black' }}>Монохромная тема</div>
              </Card>
              <Card
                style={{
                  backgroundImage:
                    'url(https://img.imgsmail.ru/pkgs/themes.outsource/1.15.0/t2068/images/bg/vk_all/1440x900.jpg)',
                    backgroundSize: 'cover'
                }}
                onClick={() => dispatch(setTheme(NotDefaultTheme.DOG))}
              >
                <div style={{ height: 96, color: 'white' }}>Собачья тема</div>
              </Card>
              <Card style={{
                  backgroundImage:
                    'url(https://s1.hostingkartinok.com/uploads/images/2022/07/9fa633d1ac363e876b5740f9c331c6ed.png)',
                    backgroundSize: 'cover'
                }} onClick={() => dispatch(setTheme(NotDefaultTheme.CAT))}>
                <div style={{ height: 96, color: 'black' }}>Кошачья тема</div>
              </Card>
            </CardGrid>
          </Group>
        </ModalPage>
      </ModalRoot>
    );

    return (
      <SplitLayout
        style={{ justifyContent: 'space-between' }}
        header={hasHeader && <PanelHeader separator={false} />}
        popout={popout}
        modal={modalRoot}
      >
        <SplitCol fixed width={isDesktop ? 170 : 50} maxWidth={isDesktop ? 170 : 50} spaced>
          <Menu activeCategory={activeCategory} getMails={getMails} setModal={setModal} />
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
            <Group className={inboxStyles.group} mode="plain">
              <div
                ref={scrollRef}
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
                            <Avatar size={28} src={mail.author.avatar} />
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
                        <TextTooltip text={mail.author.email}>
                          <Text weight={mail.read ? '3' : '1'} className={inboxStyles.author}>
                            {mail.author.name}
                          </Text>
                        </TextTooltip>
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
                        {mail.attach && mail.attach.length > 0 && (
                          <RichTooltip
                            arrow={false}
                            placement="left"
                            content={
                              <List>
                                {mail.attach.map((content, key) => (
                                  <RichTooltip
                                    arrow={false}
                                    placement="left"
                                    key={key}
                                    content={
                                      content.type === 'image' ? (
                                        <img className={inboxStyles.img} src={content.src} alt={content.name} />
                                      ) : (
                                        <span />
                                      )
                                    }
                                  >
                                    <Cell
                                      expandable
                                      before={
                                        content.type === 'image' ? (
                                          <Icon20PictureOutline />
                                        ) : content.type === 'doc' ? (
                                          <Icon20DocumentOutline />
                                        ) : content.type === 'xlsx' ? (
                                          <Icon20TableHeaderOutline />
                                        ) : (
                                          <Icon20Attach />
                                        )
                                      }
                                    >
                                      {content.name}
                                    </Cell>
                                  </RichTooltip>
                                ))}
                              </List>
                            }
                          >
                            <Icon20Attach />
                          </RichTooltip>
                        )}
                        <Text weight="3" className={inboxStyles.time}>
                          {mail.dateTime}
                        </Text>
                        <AdditionalIcons mail={mail} />
                      </div>
                    </Cell>
                  ))}
                </List>
              </div>
            </Group>
          </Panel>
        </SplitCol>
      </SplitLayout>
    );
  },
  {
    viewWidth: true
  }
);

export default Inbox;
