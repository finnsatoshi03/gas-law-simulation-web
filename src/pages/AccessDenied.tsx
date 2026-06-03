import { ShieldX } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AccessDenied() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center p-4">
      <Card className="w-full">
        <CardHeader>
          <div className="mb-3 grid size-12 place-items-center rounded-full bg-red-50 text-red-600">
            <ShieldX className="size-6" />
          </div>
          <CardTitle>Access denied</CardTitle>
          <CardDescription>
            Your account does not have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/home">Return to home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

