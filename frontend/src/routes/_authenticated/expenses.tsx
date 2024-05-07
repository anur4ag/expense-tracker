import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
});

function Expenses() {
  return (
    <div className="flex flex-col max-w-lg mx-auto my-5">
      <Card >
        <CardHeader className="flex items-center w-full justify-center">
          <CardTitle>Expenses</CardTitle>
          <CardDescription>Here are your expenses</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      <ExpenseList />
    </div>
  );
}

function ExpenseList() {
  const { isPending, data, error } = useQuery({
    queryKey: ["get-all-expenses"],
    queryFn: getAllExpenses,
  });
  if (error) return "An error has occurred: " + error.message;
  return (
    <div className="w-full m-auto">
      {isPending ? (
        "..."
      ) : (
        <Table>
          <TableCaption>A list of all your recent expenses.</TableCaption>
          <TableHeader>
            <TableRow className="">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.id}</TableCell>
                <TableCell>{expense.title}</TableCell>
                <TableCell className="text-right">{expense.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">
                $
                {/* {data?.expenses.reduce(
                  (total, expense) => total + expense.amount,
                  0
                )} */}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
}

async function getAllExpenses() {
  const res = await api.expenses.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch expenses");
  }
  const data = await res.json();
  return data;
}
