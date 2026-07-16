
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";

interface UserNotFoundProps {
  username: string;
}

function UserNotFound(props: UserNotFoundProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md border border-border/60 bg-card/85 backdrop-blur-md shadow-xl rounded-2xl p-8 text-center relative z-10">
        <CardHeader className="space-y-1.5 pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            User Not Found
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground pt-1">
            The user profile {<strong>@{props.username}</strong>} does not exist
            or is not verified yet in our database.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground mb-6">
            Would you like to register this username and create your own
            anonymous feedback box? It takes less than a minute!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserNotFound;
