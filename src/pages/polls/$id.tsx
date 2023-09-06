import { useParams } from "react-router-dom";
import Layout from "../../Layout";
import type { PollItem, PollOption } from "../../types";
import { useState, useCallback, useEffect } from "react";
import sanityClient from "../../sanityClient";
import { dateFormatter } from "../../helpers";
import { toast } from "react-hot-toast";

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

type OptionsListProps = {
  options: PollOption[];
  isExpired: boolean;
  id: string | undefined;
};

const sanityApiMutateURL = `https://${
  import.meta.env.VITE_SANITY_PROJECT_ID
}.api.sanity.io/v2021-06-07/data/mutate/${import.meta.env.VITE_SANITY_DATASET}`;

const OptionsList = ({ options, isExpired, id }: OptionsListProps) => {
  const [selectedOption, setSelectedOption] = useState<PollOption>();
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCounts, setVoteCounts] = useState<{ [key: string]: number }>({});
  const [alreadyVotedOption, setAlreadyVotedOption] = useState<string>();

  useEffect(() => {
    const hasVotedLocal = localStorage.getItem("hasVoted");
    const votedOptionLocal = localStorage.getItem("option");
    if (hasVotedLocal === "true" && votedOptionLocal?.length) {
      setAlreadyVotedOption(votedOptionLocal);
      setHasVoted(true);
    }
  }, []);

  useEffect(() => {
    const initialCounts: { [key: string]: number } = {};
    options.forEach((option) => {
      initialCounts[option.option] = option.votes;
    });
    setVoteCounts(initialCounts);
  }, [options]);

  const totalVotes = Object.values(voteCounts).reduce(
    (prev, curr) => prev + curr,
    0
  );

  const sendVote = useCallback(async () => {
    const optionIndex = options.findIndex(
      (item) => item.option === selectedOption?.option
    );
    const mutations = {
      mutations: [
        {
          patch: {
            id,
            set: {
              [`pollOptions.options[${optionIndex}].votes`]:
                Number(selectedOption?.votes) + 1,
            },
          },
        },
      ],
    };

    return await fetch(sanityApiMutateURL, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SANITY_TOKEN}`,
      },
      body: JSON.stringify(mutations),
      method: "POST",
    });
  }, [id, options, selectedOption?.option, selectedOption?.votes]);

  useEffect(() => {
    if (selectedOption && !hasVoted) {
      setVoteCounts((prevVoteCounts) => {
        return {
          ...prevVoteCounts,
          [selectedOption.option]: prevVoteCounts[selectedOption.option] + 1,
        };
      });

      localStorage.setItem("hasVoted", "true");
      localStorage.setItem("option", selectedOption?.option);
      setHasVoted(true);
      setAlreadyVotedOption(selectedOption.option)

      toast.success(`Voted for ${selectedOption.option}`);

      sendVote().then((res) => {
        if (!res.ok) {
          toast.error("Just kidding, something went wrong");
          setVoteCounts((prevVoteCounts) => {
            return {
              ...prevVoteCounts,
              [selectedOption.option]:
                prevVoteCounts[selectedOption.option] - 1,
            };
          });
        }
      });
    }
  }, [hasVoted, selectedOption, sendVote]);

  return (
    <>
      {hasVoted && alreadyVotedOption ? (
        <span className="inline-block pb-2 text-sm w-full italic">
          You already voted for {alreadyVotedOption}
        </span>
      ) : null}{" "}
      <ul className="flex flex-col gap-2">
        {options.map((option) => (
          <li
            key={option._key}
            onClick={() => {
              if (isExpired || hasVoted) return;
              setSelectedOption(option);
            }}
            className={`p-4 border border-neutral-600 rounded-md flex flex-col gap-4 cursor-pointer ${
              isExpired || hasVoted ? "hover:cursor-not-allowed" : ""
            }`}
          >
            <div className="flex justify-between">
              <div className="flex gap-2">
                <input
                  type="radio"
                  className={`${isExpired ? "hover:cursor-not-allowed" : ""}`}
                  checked={selectedOption === option}
                  disabled={isExpired}
                  onChange={() => {}}
                  value={option.option}
                />
                {option.option}
              </div>
              <span>{voteCounts[option.option]}</span>
            </div>
            <div className="w-full relative h-[6px] rounded-md bg-neutral-600">
              <div
                style={{
                  width: `${(option.votes / (totalVotes || 0)) * 100}%`,
                }}
                className="h-[6px] rounded-md bg-indigo-700 absolute inset-0"
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
