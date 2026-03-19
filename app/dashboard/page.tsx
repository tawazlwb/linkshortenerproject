import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserLinks } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import { LinkCard } from "@/components/link-card";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const userLinks = await getUserLinks(userId);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Your Links</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your shortened links
          </p>
        </div>

        {userLinks.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>No shortened links yet. Create one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {userLinks.map((link) => (
              <LinkCard key={link.id} link={link} baseUrl={baseUrl} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
