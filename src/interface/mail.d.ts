export namespace mail {
  export interface Mail {
    readonly _id: string;
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
    attach?: Attach[];
  }

  export interface Author {
    readonly name: string;
    readonly avatar: string;
    readonly email: string;
  }

  export interface Attach {
    readonly name: string;
    readonly src: string;
    readonly type: string;
  }
}
