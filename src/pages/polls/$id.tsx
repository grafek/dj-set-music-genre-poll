import { useParams } from "react-router-dom";
import Layout from "../../Layout";
import type { PollItem } from "../../types";
import { useState, useCallback, useEffect } from "react";
import sanityClient from "../../sanityClient";
import { dateFormatter } from "../../helpers";
import PollOptionList from "../../components/PollOptionList";
import { TextSkeleton } from "../../components/Skeletons";

const PollItemPage = () => {
  const { id } = useParams();
  const [pollItem, setPollItem] = useState<PollItem | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPollOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await sanityClient.fetch(
        `*[_type == 'poll' && _id == $id][0]{ pollOptions, djSetDate, _id }`,
        { id }
      );

      setPollItem(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPollOptions();
  }, [fetchPollOptions]);

  if (isLoading) {
    return (
      <Layout>
        <div className="mr-96 mt-5">
          <TextSkeleton />
        </div>
        <TextSkeleton height={4.5} width={34} />
        <TextSkeleton height={4.5} width={34} />
        <TextSkeleton height={4.5} width={34} />
        <TextSkeleton height={4.5} width={34} />
      </Layout>
    );
  }

  if (!pollItem?.pollOptions.options) {
    return "No poll yet for selected date";
  }

  const isExpired = new Date(pollItem?.djSetDate as string) < new Date();

  return (
    <Layout className="pb-4 relative">
      <div className="pt-8"/>
      <a href="/" className="absolute px-3 top-5 flex-1 py-1 border border-primary-200 block rounded transition-colors duration-200 hover:bg-primary-400">
        Home
      </a>
      <div className="bg-primary-600 relative rounded-md border border-primary-400 shadow-2xl p-4 w-full max-w-xl">
        <h1 className="inline-block pb-4 text-lg">
          {dateFormatter(new Date(pollItem?.djSetDate))} Poll
        </h1>
        <PollOptionList
          isExpired={isExpired}
          options={pollItem.pollOptions.options}
          id={id}
        />
        {isExpired ? (
          <div className="italic text-sm pt-2 text-gray-400">
            This poll has expired
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default PollItemPage;
