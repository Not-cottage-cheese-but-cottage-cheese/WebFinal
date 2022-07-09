import { useCallback, useEffect, useState } from "react";
import {
  Icon56InboxOutline,
  Icon16ReplyOutline,
  Icon16MailOutline,
  Icon16DeleteOutline,
} from "@vkontakte/icons";
import {
  withAdaptivity,
  usePlatform,
  Group,
  ViewWidth,
  VKCOM,
  SplitLayout,
  PanelHeader,
  SplitCol,
  Panel,
  Cell,
  View,
  Avatar,
  Placeholder,
  Caption,
  Div,
  List,
} from "@vkontakte/vkui";

import { useAppDispatch, useAppSelector } from "../../hooks/use-store";
import { mail } from "../../interface/mail";
import { setMails } from "../../store/reducers/mailsSlice";
// import { mailsApi } from "../../store/services/mails";

import inboxStyles from "./inbox.module.css";

const Inbox = withAdaptivity(
  ({ viewWidth }) => {
    // const { data, isFetching, isLoading } = mailsApi.useFetchMailsQuery("");
    const dispatch = useAppDispatch();
    const mails = useAppSelector((state) => state.mails);
    const [activeMail, setActiveMail] = useState(-1);

    const platform = usePlatform();
    const isDesktop = (viewWidth || 0) >= ViewWidth.TABLET;
    const hasHeader = platform !== VKCOM;

    const menuWidth = useCallback(() => {
      if ((viewWidth || 0) < ViewWidth.SMALL_TABLET) {
        return 50;
      }
      if (!isDesktop) {
        return 65;
      }
      return 170;
    }, [isDesktop, viewWidth]);

    useEffect(() => {
      const mails: mail.Mail[] = require("./small.json");
      dispatch(setMails(mails));
    }, [dispatch]);

    return (
      <SplitLayout
        style={{ justifyContent: "space-between" }}
        header={hasHeader && <PanelHeader separator={false} />}
      >
        <SplitCol fixed width={menuWidth()} maxWidth={menuWidth()}>
          <Panel>
            <PanelHeader />
            <Group mode="plain">
              <List>
                <Cell
                  expandable
                  before={<Icon16MailOutline />}
                  style={{
                    backgroundColor: "var(--button_secondary_background)",
                    borderRadius: 8,
                  }}
                >
                  <Caption level="1">Входящие</Caption>
                </Cell>
                <Cell expandable before={<Icon16ReplyOutline />}>
                  <Caption level="1">Отправленные</Caption>
                </Cell>
                <Cell expandable before={<Icon16DeleteOutline />}>
                  <Caption level="1">Корзина</Caption>
                </Cell>
              </List>
            </Group>
          </Panel>
        </SplitCol>
        {isDesktop && (
          <SplitCol fixed width={300} maxWidth={300}>
            <Panel>
              {hasHeader && <PanelHeader />}
              <Group
                mode="plain"
                style={{
                  overflow: "scroll",
                  height:
                    "calc(100vh - var(--panelheader_height) - var(--formitem_padding))",
                }}
              >
                <List>
                  {mails?.shortMails?.map((mail, mailIndex) => (
                    <Cell
                      key={mailIndex}
                      disabled={mailIndex === activeMail}
                      className={inboxStyles.cell}
                      style={
                        mailIndex === activeMail
                          ? {
                              backgroundColor:
                                "var(--button_secondary_background)",
                              borderRadius: 8,
                            }
                          : {
                              backgroundColor: "var(--background_content)",
                              borderRadius: 8,
                            }
                      }
                      onClick={() => setActiveMail(mailIndex)}
                    >
                      <Div className={inboxStyles.top}>
                        <Caption level="1">{mail.author.name}</Caption>
                        <Caption
                          level="1"
                          style={{ color: "var(--vkui--color_text_secondary)" }}
                        >
                          {mail.dateTime}
                        </Caption>
                      </Div>
                      <Div className={inboxStyles.bottom}>
                        <Caption level="1" className={inboxStyles.overflow}>
                          {mail.title}
                        </Caption>
                        <Caption
                          level="2"
                          className={inboxStyles.overflow}
                          style={{ color: "var(--vkui--color_text_secondary)" }}
                        >
                          {mail.text}
                        </Caption>
                      </Div>
                    </Cell>
                  ))}
                </List>
              </Group>
            </Panel>
          </SplitCol>
        )}

        <SplitCol animate={!isDesktop} spaced={true}>
          <View activePanel="mailContent">
            <Panel id="mailContent">
              <PanelHeader after={<Avatar size={36} />}>
                Panel Header
              </PanelHeader>
              <Group>
                <Placeholder
                  icon={<Icon56InboxOutline />}
                  header="Скоро здесь будет содержимое письма :)"
                />
              </Group>
            </Panel>
          </View>
        </SplitCol>
      </SplitLayout>
    );
  },
  {
    viewWidth: true,
  }
);

export default Inbox;
