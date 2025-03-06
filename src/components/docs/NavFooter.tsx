import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export const NavigationFooter = ({
  prev,
  next,
}: {
  prev?: { title: string; url: string };
  next?: { title: string; url: string };
}) => (
  <div className="flex justify-between pb-8">
    {prev ? (
      <Link to={prev.url} className="flex items-center">
        <ChevronLeft className="mr-2" />
        <span>{prev.title}</span>
      </Link>
    ) : (
      <div></div>
    )}

    {next && (
      <Link to={next.url} className="flex items-center ml-auto">
        <span>{next.title}</span>
        <ChevronRight className="ml-2" />
      </Link>
    )}
  </div>
);
