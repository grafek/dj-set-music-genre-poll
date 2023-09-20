import type { PollOption } from "../types";
import { toast } from "react-hot-toast";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { CSSTransition } from "react-transition-group";
import { useRef, useCallback, useState, useEffect } from "react";
import Tooltip from "./Tooltip";
type PollOptionListProps = {
  options: PollOption[];
  isExpired: boolean;
  id: string | undefined;
};

const sanityApiMutateURL = `https://${
  import.meta.env.VITE_SANITY_PROJECT_ID
}.api.sanity.io/v2021-06-07/data/mutate/${import.meta.env.VITE_SANITY_DATASET}`;

const PollOptionList = ({ options, isExpired, id }: PollOptionListProps) => {
  const [selectedOption, setSelectedOption] = useState<PollOption | null>();
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCounts, setVoteCounts] = useState<{ [key: string]: number }>({});
  const [alreadyVotedOption, setAlreadyVotedOption] = useState<string>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isTooltipVisisble, setIsTooltipVisible] = useState(false);

  useOnClickOutside(tooltipRef, () => {
    setTimeout(() => {
      setSelectedOption(null);
      setIsTooltipVisible(false);
    }, duration);
  });

  useEffect(() => {
    const hasVotedLocal = localStorage.getItem(`${id}-has-voted`);
    const votedOptionLocal = localStorage.getItem(`${id}-option`);
    if (hasVotedLocal === "true" && votedOptionLocal?.length) {
      setAlreadyVotedOption(votedOptionLocal);
      setHasVoted(true);
    }
  }, [id]);

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
              [`pollOptions.options[${optionIndex}].votes`]: Number(
                selectedOption?.votes
              ),
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
    if (selectedOption && !hasVoted && !isTooltipVisisble) {
      setVoteCounts((prevVoteCounts) => {
        return {
          ...prevVoteCounts,
          [selectedOption.option]: prevVoteCounts[selectedOption.option] + 1,
        };
      });

      setSelectedOption({ ...selectedOption, votes: ++selectedOption.votes });
      setHasVoted(true);
      setAlreadyVotedOption(selectedOption.option);

      localStorage.setItem(`${id}-has-voted`, "true");
      localStorage.setItem(`${id}-option`, selectedOption?.option);

      toast.success(`Voted for ${selectedOption.option}`);

      sendVote().then((res) => {
        if (!res.ok) {
          toast.error("Just kidding, something went wrong");
          setVoteCounts((prevVoteCounts) => {
            return {
              ...prevVoteCounts,
              [selectedOption.option]: --prevVoteCounts[selectedOption.option],
            };
          });
          setSelectedOption((prevOption) => {
            if (prevOption) return { ...prevOption, votes: --prevOption.votes };
          });
          setHasVoted(false);
          localStorage.removeItem(`${id}-option`);
        }
      });
    }
  }, [hasVoted, id, isTooltipVisisble, selectedOption, sendVote]);

  const duration = 150;
  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
  };
  const tooltipTransitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
  };

  return (
    <>
      {hasVoted && alreadyVotedOption ? (
        <span className="inline-block pb-2 text-sm w-full italic">
          You already voted for {alreadyVotedOption}
        </span>
      ) : null}
      <ul className="flex flex-col gap-4 relative">
        {options.map((option, i) => (
          <div
            className={`border relative border-primary-300 rounded-md cursor-pointer ${
              isExpired || hasVoted ? "hover:cursor-not-allowed" : "hover:bg-primary-400 transition-colors"
            }`}
            key={option._key}
          >
            <CSSTransition
              nodeRef={tooltipRef}
              timeout={duration}
              unmountOnExit
              in={isTooltipVisisble && selectedOption === option}
              onEnter={() => setIsTooltipVisible(true)}
              onExit={() => setIsTooltipVisible(false)}
            >
              {(state) => (
                <Tooltip
                  ref={tooltipRef}
                  transitionState={state}
                  defaultStyle={defaultStyle}
                  transitionStyles={tooltipTransitionStyles}
                >
                  <span>
                    You're about to vote on{" "}
                    <span className="px-1 font-medium">
                      {options[i].option}
                    </span>
                  </span>
                  <div className="flex items-center justify-between">
                    <button
                      className="px-2 py-1 bg-green-700 border border-green-600 transition-colors duration-200 rounded font-medium hover:bg-transparent hover:text-green-600"
                      onClick={() => {
                        if (isExpired || hasVoted) return;
                        setIsTooltipVisible(false);
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      className="px-2 py-1 text-red-600 font-medium border transition-colors duration-200 border-red-500 rounded hover:bg-red-600 hover:text-inherit"
                      onClick={() => {
                        setSelectedOption(null);
                        setIsTooltipVisible(false);
                      }}
                    >
                      Discard
                    </button>
                  </div>
                </Tooltip>
              )}
            </CSSTransition>
            <li
              key={option._key}
              className="p-4 flex flex-col gap-4 "
              onClick={() => {
                if (isExpired || hasVoted) return;
                setIsTooltipVisible(true);
                setSelectedOption(option);
              }}
            >
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <input
                    type="radio"
                    className={`${isExpired ? "hover:cursor-not-allowed" : ""}`}
                    checked={
                      alreadyVotedOption
                        ? alreadyVotedOption === option.option
                        : selectedOption === option
                    }
                    disabled={isExpired}
                    onChange={() => {}}
                    value={option.option}
                  />
                  {option.option}
                </div>
                <span>{voteCounts[option.option]}</span>
              </div>
              <div className="w-full relative h-[6px] rounded-md bg-gray-800/80">
                <div
                  style={{
                    width: `${(option.votes / totalVotes || 0) * 100}%`,
                  }}
                  className="h-[6px] rounded-md bg-primary-200 absolute inset-0"
                ></div>
              </div>
            </li>
          </div>
        ))}
      </ul>
    </>
  );
};
export default PollOptionList;
