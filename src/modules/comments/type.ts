export namespace I_GetComment {
  export interface Query {
    pageSize?: string;
    lastValue?: string;
    id: string;
  }
}

export namespace I_CommentToGood {
  export interface Body {
    content: string;
    goodId: string;
  }
}

export namespace I_ReplyComment {
  export interface Body {
    id: string;
    content: string;
  }
}

export namespace I_DeleteComment {
  export interface Body {
    id: string;
  }
}
