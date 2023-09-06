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
