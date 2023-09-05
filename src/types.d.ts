export type PollItem = {
  _id: string;
  slug: {
    current: string;
    _type: "slug";
  };
  djSetDate: string;
  pollOptions: {
    options: PollOptions[];
  };
};

export type PollOptions = {
  option: string;
  votes: number;
  _key: string;
};
