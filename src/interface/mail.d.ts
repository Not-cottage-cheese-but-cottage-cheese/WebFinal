export namespace mail {
  export interface Mail {
    readonly author: readonly Author;
    readonly dateTime: string;
    readonly text: string;
    readonly title: string;
    newThread: boolean;
    important: boolean;
    flag: boolean;
    confidence: boolean;
    finance: boolean;
    read: boolean;
  }

  export interface Author {
    readonly name: string;
    readonly avatar: string;
    readonly email: string;
  }

  export type ShortMail = Omit<
    mail.Mail,
    "newThread" | "important" | "flag" | "confidence" | "finance" | "read"
  >;
}
