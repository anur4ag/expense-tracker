import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/api";
export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions);
  if (isPending) return "Loading...";
  if (error) return "Error: " + error.message;

  return (
    <div className="flex flex-col gap-4 p-2">
      <h1>Hello, {data.user.given_name}</h1>
        <a href="/api/logout">Logout!</a>
    </div>
  );
}
