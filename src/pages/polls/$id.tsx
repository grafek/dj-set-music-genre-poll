import { useParams } from "react-router-dom";
import Layout from "../../Layout";
import type { PollItem, PollOptions } from "../../types";
import { useState, useCallback, useEffect } from "react";
import sanityClient from "../../sanityClient";
import { dateFormatter } from "../../helpers";

const PollItemPage = () => {
  const { id } = useParams();
  const [pollItem, setPollItem] = useState<PollItem | undefined>(undefined);

  const fetchPollOptions = useCallback(async () => {
    try {
      const data = await sanityClient.fetch(
        `*[_type == 'poll' && _id == $id][0]{ pollOptions, djSetDate, _id }`,
        { id }
      );

      setPollItem(data);
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  useEffect(() => {
    fetchPollOptions();
  }, [fetchPollOptions]);

  if (!pollItem?.pollOptions.options) {
    return "No poll yet for selected date";
  }

  const isExpired = new Date(pollItem?.djSetDate as string) < new Date();

  return (
    <Layout>
      <div className="bg-neutral-700 rounded-md shadow-md p-4 w-full max-w-xl">
        <span className="inline-block pb-4 text-lg">
          {dateFormatter(new Date(pollItem?.djSetDate))} Poll
        </span>
        <OptionsList
          isExpired={isExpired}
          options={pollItem.pollOptions.options}
          id={id}
        />
        {isExpired ? (
          <div className="italic text-sm mb-2">This poll has expired</div>
        ) : null}
      </div>
    </Layout>
  );
};
export default PollItemPage;

type Props = {
  options: PollOptions[];
  isExpired: boolean;
  id: string | undefined;
};

const OptionsList = ({ options, isExpired, id }: Props) => {
  const [selectedOption, setSelectedOption] = useState<string>();

  const totalVotes = options.reduce(
    (prev, curr) => Number(prev) + Number(curr.votes),
    0
  );

  const sendVote = useCallback(async () => {
    const option = options.find((item) => item.option === selectedOption);
    const optionIndex = options.findIndex(
      (item) => item.option === selectedOption
    );

    const mutations = {
      mutations: [
        {
          patch: {
            id,
            set: {
              [`pollOptions.options[${optionIndex}].votes`]:
                Number(option?.votes) + 1,
            },
          },
        },
      ],
    };
    await fetch(
      `https://${
        import.meta.env.VITE_SANITY_PROJECT_ID
      }.api.sanity.io/v2021-06-07/data/mutate/${
        import.meta.env.VITE_SANITY_DATASET
      }`,
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SANITY_TOKEN}`,
        },
        body: JSON.stringify(mutations),
        method: "POST",
      }
    );
  }, [id, options, selectedOption]);

  useEffect(() => {
    if (selectedOption) {
      sendVote();
    }
  }, [selectedOption, sendVote]);

  return (
    <ul className="flex flex-col gap-2">
      {options.map(({ option, votes, _key }) => (
        <li
          key={_key}
          onClick={() => {
            setSelectedOption(option);
          }}
          className={`p-4 border border-neutral-600 rounded-md flex flex-col gap-4 cursor-pointer ${
            isExpired ? "hover:cursor-not-allowed" : ""
          } `}
        >
          <div className="flex justify-between">
            <div className="flex gap-2">
              <input
                type="radio"
                className={`${isExpired ? "hover:cursor-not-allowed" : ""}`}
                checked={selectedOption === option}
                disabled={isExpired}
                onChange={() => {}}
                value={option}
              />
              {option}
            </div>
            <span>{votes}</span>
          </div>
          <div className="w-full relative h-[6px] rounded-md bg-neutral-600">
            <div
              style={{ width: `${(votes / (totalVotes || 0)) * 100}%` }}
              className="h-[6px] rounded-md bg-indigo-700 absolute inset-0"
            ></div>
          </div>
        </li>
      ))}
    </ul>
  );
};
