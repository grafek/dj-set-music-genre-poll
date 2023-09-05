import { useState, useEffect, useCallback } from "react";
import sanityClient from "../sanityClient";
import type { PollItem } from "../types";
import Layout from "../Layout";
import { dateFormatter } from "../helpers";

const query = `*[_type == "poll"]{
  djSetDate,
  _id
}`;

export default function Home() {
  const [pollItems, setPollItems] = useState<PollItem[]>([]);

  const fetchPollOptions = useCallback(async () => {
    try {
      const data = await sanityClient.fetch(query);
      setPollItems(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchPollOptions();
  }, [fetchPollOptions]);

  const previousEvents = pollItems?.filter(
    (item) => new Date(item?.djSetDate) < new Date()
  );

  const futureEvents = pollItems?.filter(
    (item) => new Date(item?.djSetDate) > new Date()
  );

  return (
    <Layout>
      <div className="text-center">
        <h2 className="text-xl font-medium">
          {futureEvents.length > 1 ? "Next polls" : "Next poll"}
        </h2>
        {futureEvents.map((item, i) => (
          <a href={`/polls/${item._id}`} key={i}>
            {dateFormatter(new Date(item?.djSetDate))}
          </a>
        ))}
      </div>
      <div className="text-center">
        <h2 className="text-xl font-medium">Previous polls</h2>
        <ul className="italic">
          {previousEvents.map((item, i) => (
            <li key={i}>
              <a href={`/polls/${item._id}`}>
                {dateFormatter(new Date(item?.djSetDate))}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
