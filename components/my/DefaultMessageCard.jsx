import { Inbox } from "lucide-react"

function DefaultMessageCard() {
  return (
    <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border border-dashed border-border/60 rounded-2xl bg-card/20 backdrop-blur-sm">
      <Inbox className="size-10 text-muted-foreground/50 mb-3" />
      <h3 className="font-bold text-base mb-1">
        No messages to display
      </h3>
      <p className="text-xs text-muted-foreground max-w-xs">
        Share your unique link on social media to start receiving
        anonymous feedback!
      </p>
    </div>
  )
}

export default DefaultMessageCard
