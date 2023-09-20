export type PollItem = {
  _id: string;
  slug: {
    current: string;
    _type: "slug";
  };
  djSetDate: string;
  pollOptions: {
    options: PollOption[];
  };
};

export type PollOption = {
  option: string;
  votes: number;
  _key: string;
};

export type TransitionStyle = {
  entering: {
    [transitionState: string]: number;
  };
  entered: {
    [transitionState: string]: number;
  };
  exiting: {
    [transitionState: string]: number;
  };
  exited: {
    [transitionState: string]: number;
  };
  unmounted?: {
    [transitionState: string]: number;
  };
};

export type DefaultStyle = {
  [prop: string]: string | number;
};
