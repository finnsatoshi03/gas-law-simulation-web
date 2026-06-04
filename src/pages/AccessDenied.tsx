import { ShieldX } from "lucide-react";
import { Link } from "react-router-dom";

import { useAccessMessages } from "@/contexts/AccessMessagesContext";
import { ACCESS_MESSAGE_KEY } from "@/lib/access-messages";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AccessDenied() {
  const { getAccessMessage } = useAccessMessages();
  const message = getAccessMessage(ACCESS_MESSAGE_KEY.ACCESS_DENIED);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center p-4">
      <Card className="w-full">
        <CardHeader>
          <div className="mb-3 grid size-12 place-items-center rounded-full bg-red-50 text-red-600">
            <ShieldX className="size-6" />
          </div>
          <CardTitle>{message.title}</CardTitle>
          <CardDescription>{message.description}</CardDescription>
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
