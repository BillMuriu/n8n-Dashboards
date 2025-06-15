import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconUsers, IconActivity, IconCalendar } from "@tabler/icons-react";

type SubredditCardProps = {
  icon: string;
  name: string;
  title: string;
  subscribers: number;
  description: string;
  subredditAge?: string; // optional
  subredditType?: string; // optional
};

export function SubredditCard({
  icon,
  name,
  title,
  subscribers,
  description,
  subredditAge,
  subredditType,
}: SubredditCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <img src={icon} alt={`${name} icon`} className="size-6 rounded" />
          <CardDescription className="font-medium">{name}</CardDescription>
        </div>
        <CardTitle className="text-base font-semibold leading-snug @[250px]/card:text-lg">
          {title}
        </CardTitle>
        <div className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="flex items-center gap-2 font-medium">
          <IconUsers className="size-4" />
          {subscribers.toLocaleString()} subscribers
        </div>
        {subredditAge && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCalendar className="size-4" />
            {subredditAge}+ yrs old
          </div>
        )}
        {subredditType && (
          <Badge variant="outline" className="mt-2 capitalize">
            {subredditType} Subreddit
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
