import { errorCardSchema } from "@/schemas/errorCardSchema";
import { Inbox } from "lucide-react";
import { z } from "zod";

function DefaultErrorCard(props: z.infer<typeof errorCardSchema>) {
  return (
    <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border border-dashed border-border/60 rounded-2xl bg-card/20 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-1">{props.title}</h3>
      <h1 className="text-xs text-muted-foreground max-w-xs">
        Error code: {props.code}
      </h1>
      <p className="text-xs text-muted-foreground max-w-xs mb-4">
        {props.description}
      </p>
    </div>
  );
}

export default DefaultErrorCard;
