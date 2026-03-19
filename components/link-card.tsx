"use client";

import { ShortenedLink } from "@/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { useState } from "react";

interface LinkCardProps {
  link: ShortenedLink;
  baseUrl: string;
}

export function LinkCard({ link, baseUrl }: LinkCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${baseUrl}/${link.shortCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Short Link</p>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-3 py-2 rounded text-sm font-mono flex-1 truncate">
                  {baseUrl}/{link.shortCode}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  title={copied ? "Copied!" : "Copy to clipboard"}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Original URL</p>
              <div className="flex items-center gap-2">
                <a
                  href={link.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate flex-1"
                >
                  {link.originalUrl}
                </a>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Created {new Date(link.createdAt).toLocaleDateString()}
            </p>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
