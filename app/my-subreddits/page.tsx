"use client";

import React from "react";
import { SiteHeader } from "@/components/siteheader";
import { SidebarInset } from "@/components/ui/sidebar";
import { SubredditCard } from "@/components/subreddit-card";

function getSubredditAge(utcCreated: number): string {
  const createdDate = new Date(utcCreated * 1000);
  const now = new Date();
  const years =
    (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return years.toFixed(1);
}

const MySubreddits = () => {
  const createdUtc = 1601401182;
  const subredditAge = getSubredditAge(createdUtc);

  return (
    <SidebarInset>
      <SiteHeader title="My Subreddits" />
      <section className="w-full px-4 @container/main">
        <div className="w-full py-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-gradient-to-t dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs">
          <SubredditCard
            icon="https://b.thumbs.redditmedia.com/fNB5ceBwMOjJI4OAmKRapu3w7L2LRX6zQNzo3HG34RA.png"
            name="r/n8n"
            title="n8n: Powerfully Easy Automation"
            subscribers={84760}
            description="n8n is an extendable workflow automation tool that enables you to connect anything to everything."
            subredditAge={subredditAge}
            subredditType="Public"
          />
          <SubredditCard
            icon="https://styles.redditmedia.com/t5_2su6s/styles/communityIcon_4g1uo0kd87c61.png?width=256&amp;s=3f7493995143d3cf40b1fedc582607cea194b579"
            name="r/reactjs"
            title="ReactJS"
            subscribers={4050000}
            description="A community for learning and developing web applications using React by Facebook."
            subredditAge={getSubredditAge(1300142400)} // Mar 15, 2011
            subredditType="Public"
          />

          <SubredditCard
            icon="https://styles.redditmedia.com/t5_2qs0q/styles/communityIcon_kxcmzy9bt1381.jpg?width=256&amp;s=4daf7298776111d25a50c359914d9cfaa1c10e94"
            name="r/webdev"
            title="Web Dev"
            subscribers={1250000}
            description="A community dedicated to all things web development: both front-end and back-end."
            subredditAge={getSubredditAge(1201238400)} // Jan 25, 2008
            subredditType="Public"
          />

          <SubredditCard
            icon="https://a.thumbs.redditmedia.com/zDOFJTXd6fmlD58VDGypiV94Leflz11woxmgbGY6p_4.png"
            name="r/javascript"
            title="JavaScript"
            subscribers={2800000}
            description="News, questions, and discussion about JavaScript and related technologies."
            subredditAge={getSubredditAge(1184284800)} // Jul 13, 2007
            subredditType="Public"
          />

          <SubredditCard
            icon="https://styles.redditmedia.com/t5_2sr2v/styles/communityIcon_inx7byubklb91.png?width=256&amp;s=b2e3ee8e710cea43e9086b083e7a57abaaa9d68f"
            name="r/learnprogramming"
            title="Learn Programming"
            subscribers={3300000}
            description="A subreddit for all questions related to programming in any language."
            subredditAge={getSubredditAge(1299110400)} // Mar 3, 2011
            subredditType="Public"
          />

          <SubredditCard
            icon="https://styles.redditmedia.com/t5_2v6gg/styles/communityIcon_4w7vh6c21f871.png?width=256&amp;s=e2c5fe5b2d65d48718b9b093d2cfd053c54f09d0"
            name="r/typescript"
            title="TypeScript"
            subscribers={1020000}
            description="A language for application-scale JavaScript development."
            subredditAge={getSubredditAge(1325376000)} // Jan 1, 2012
            subredditType="Public"
          />

          <SubredditCard
            icon="https://styles.redditmedia.com/t5_2s580/styles/communityIcon_fchbp8oc0mg41.png"
            name="r/frontend"
            title="Frontend"
            subscribers={900000}
            description="Frontend web development: HTML, CSS, JavaScript, frameworks, and UI/UX."
            subredditAge={getSubredditAge(1298937600)} // Mar 1, 2011
            subredditType="Public"
          />
        </div>
      </section>
    </SidebarInset>
  );
};

export default MySubreddits;
