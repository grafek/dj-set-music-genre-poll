import { useParams } from "react-router-dom";
import Layout from "../../Layout";
import type { PollItem } from "../../types";
import { useState, useCallback, useEffect } from "react";
import sanityClient from "../../sanityClient";

const DynamicDashboard = () => {
  const { id } = useParams();
  const [pollItem, setPollItem] = useState<PollItem | undefined>(undefined);
  const [isCheckedList, setIsCheckedList] = useState<boolean[]>([]);

  const slug = id?.slice(0, 10);

  const fetchPollOptions = useCallback(async () => {
    try {
      const data = await sanityClient.fetch(
        `*[_type == 'poll' && slug.current == $slug][0]{ pollOptions, djSetDate, slug }`,
        { slug }
      );

      const initialCheckedList = new Array(
        data.pollOptions.options.length
      ).fill(false);

      setPollItem(data);
      setIsCheckedList(initialCheckedList);
    } catch (e) {
      console.error(e);
    }
  }, [slug]);

  useEffect(() => {
    fetchPollOptions();
  }, [fetchPollOptions]);

  const handleCheckboxClick = (index: number) => {
    if (isExpired) return;
    const updatedIsCheckedList = [...isCheckedList];
    updatedIsCheckedList[index] = !updatedIsCheckedList[index];
    setIsCheckedList(updatedIsCheckedList);
  };
  const totalVotes = pollItem?.pollOptions.options.reduce(
    (prev, curr) => prev + curr.votes,
    0
  );

  if (!pollItem?.pollOptions.options) {
    return "No poll yet for selected date";
  }

  const isExpired = new Date(pollItem?.djSetDate as string) < new Date();
  return (
    <Layout>
      <div className="bg-neutral-700 rounded-md shadow-md p-4 w-full max-w-xl">
        <span className="inline-block pb-4 text-lg">
          {id?.slice(0, 10)} Poll
        </span>
        {isExpired ? (
          <div className="italic text-sm mb-2">This poll has expired</div>
        ) : null}
        <ul className="flex flex-col gap-2">
          {pollItem?.pollOptions.options.map(({ option, votes, _key }, i) => (
            <li
              key={_key}
              onClick={() => handleCheckboxClick(i)}
              className={`p-4 border border-neutral-600 rounded-md flex flex-col gap-4 cursor-pointer ${
                isExpired ? "hover:cursor-not-allowed" : ""
              } `}
            >
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    className="hover:cursor-not-allowed"
                    checked={isCheckedList[i]}
                    disabled={isExpired}
                    onChange={() => {}}
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
      </div>
    </Layout>
  );
};
export default DynamicDashboard;
