import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

function Index() {
  return (
    <div className="flex flex-col max-w-lg mx-auto my-5">
      <Card>
        <CardHeader>
          <CardTitle>Total Expense</CardTitle>
          <CardDescription>Here' your total monthly expense</CardDescription>
        </CardHeader>
        <CardContent>
          <TotalSpend />
        </CardContent>
      </Card>
    </div>
  );
}

function TotalSpend() {
  const { isPending, data, error } = useQuery({
    queryKey: ["get-total-spend"],
    queryFn: getTotalSpend,
  });
  if (error) return "An error has occurred: " + error.message;
  return <p>${isPending ? "..." : data?.total.total}</p>;
}

async function getTotalSpend() {
  const res = await api.expenses["total-spend"].$get();
  if (!res.ok) {
    throw new Error("Failed to fetch total spend");
  }
  const data = await res.json();
  return data;
}
