import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link as LinkIcon, Zap, BarChart3, Lock, Share2, Clock } from "lucide-react";

export default async function Home() {
  const features = [
    {
      icon: LinkIcon,
      title: "Instant Link Shortening",
      description: "Convert long URLs into concise, shareable links in seconds",
    },
    {
      icon: BarChart3,
      title: "Analytics Tracking",
      description: "Monitor click counts, geographic data, and referral sources",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "All your links are encrypted and protected with industry-standard security",
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Generate QR codes and share links across any platform instantly",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized infrastructure ensures redirects happen in milliseconds",
    },
    {
      icon: Clock,
      title: "Link History",
      description: "Keep track of all your shortened links with detailed management tools",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
        <div className="space-y-6 text-center sm:space-y-8">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
            Shorten Your Links, <span className="text-blue-600 dark:text-blue-400">Amplify Your Reach</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Transform long, unwieldy URLs into short, memorable links. Track performance with
            advanced analytics and share with confidence.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </SignUpButton>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
        <div className="space-y-4 text-center sm:space-y-6 mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
            Powerful Features
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Everything you need to manage, track, and share your links effectively
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <div className="mb-2 inline-block rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            Ready to Shorten Your Links?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-blue-100 mb-8">
            Join thousands of users who are already using Link Shortener to manage and track their URLs
          </p>
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <Button size="lg" variant="secondary">
              Start Free Today
            </Button>
          </SignUpButton>
        </div>
      </section>

      {/* Footer Section */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p>© 2026 Link Shortener. No credit card required.</p>
        </div>
      </section>
    </div>
  );
}
