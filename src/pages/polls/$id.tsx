import { useParams } from "react-router-dom";
import Layout from "../../Layout";
import type { PollItem } from "../../types";
import { useState, useCallback, useEffect } from "react";
import sanityClient from "../../sanityClient";
import { dateFormatter } from "../../helpers";
import PollOptionList from "../../components/PollOptionList";

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
    <Layout className="pb-8">
      <div className="bg-primary-600 rounded-md border border-primary-400 shadow-2xl p-4 w-full max-w-xl">
        <h1 className="inline-block pb-4 text-lg">
          {dateFormatter(new Date(pollItem?.djSetDate))} Poll
        </h1>
        <PollOptionList
          isExpired={isExpired}
          options={pollItem.pollOptions.options}
          id={id}
        />
        {isExpired ? (
          <div className="italic text-sm pb-2">This poll has expired</div>
        ) : null}
      </div>
    </Layout>
  );
};

export default PollItemPage;
