import { useState, useEffect, useCallback, useMemo } from "react";
import sanityClient from "../sanityClient";
import type { PollItem } from "../types";
import Layout from "../Layout";
import Poll from "../components/Poll";
import { TextSkeleton } from "../components/Skeletons";

const query = `*[_type == "poll"]{
  djSetDate,
  _id
}`;

export default function Home() {
  const [pollItems, setPollItems] = useState<PollItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPollOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await sanityClient.fetch(query);
      setPollItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPollOptions();
  }, [fetchPollOptions]);

  const previousEvents = useMemo(
    () =>
      pollItems
        ?.filter((item) => new Date(item?.djSetDate) < new Date())
        .sort(
          (a, b) =>
            new Date(b.djSetDate).getTime() - new Date(a.djSetDate).getTime()
        ),
    [pollItems]
  );

  const futureEvents = useMemo(
    () =>
      pollItems
        ?.filter((item) => new Date(item?.djSetDate) > new Date())
        .sort(
          (a, b) =>
            new Date(b.djSetDate).getTime() - new Date(a.djSetDate).getTime()
        ),
    [pollItems]
  );

  if (isLoading) {
    return (
      <Layout>
        <TextSkeleton width={5} />
        <TextSkeleton height={2} />
        <TextSkeleton width={5} />
        <div className="flex flex-col gap-4">
          <TextSkeleton height={2} />
          <TextSkeleton height={2} />
          <TextSkeleton height={2} />
          <TextSkeleton height={2} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header>
        <h1 className="text-3xl text-center pt-2 pb-12">Music genre poll</h1>
      </header>
      <div className="text-center">
        <h2 className="text-xl font-medium">
          {futureEvents.length > 1 ? "Next polls" : "Next poll"}
        </h2>
        <div className="py-2" />
        {futureEvents.map(({ _id, djSetDate }) => (
          <Poll djSetDate={djSetDate} id={_id} key={_id} />
        ))}
      </div>
      <div className="text-center">
        <h2 className="text-xl font-medium">Previous polls</h2>
        <div className="py-2" />
        <ul className="italic flex flex-col gap-4">
          {previousEvents.map(({ _id, djSetDate }) => (
            <li key={_id}>
              <Poll
                djSetDate={djSetDate}
                id={_id}
                className="bg-gray-800/30 text-gray-400"
              />
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
