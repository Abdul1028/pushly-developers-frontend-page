"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import { usePipeline } from "@/contexts/pipeline-context";

export default function Step2ProjectId() {
  const { accessToken, projectId, setProjectId, projectSubdomain, setProjectSubdomain } = usePipeline();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Accepts:
   * - myapp
   * - myapp.wareality.tech
   * - https://myapp.wareality.tech
   */
  const extractSubdomain = (value: string) => {
    const trimmed = value.trim();

    // Full URL or domain
    const match = trimmed.match(
      /^(?:https?:\/\/)?(?:www\.)?([a-z0-9-]+)\.wareality\.tech/i
    );
    if (match?.[1]) return match[1];

    // Plain subdomain
    return trimmed;
  };

  const handleResolve = async () => {
    if (!input || !accessToken) return;

    const subdomain = extractSubdomain(input);

    try {
      setLoading(true);
      setError(null);
      setProjectId("");

      const res = await fetch(
        `https://api.wareality.tech/api/projects/resolve?subdomain=${subdomain}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Project not found or not owned by you");
      }

      const data = await res.json();
      setProjectId(data.projectId);
      setProjectSubdomain(data.subdomain);

    } catch (e: any) {
      setError(e.message || "Failed to resolve project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-gray-800 bg-gray-950">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            2
          </div>
          <div>
            <CardTitle className="text-xl">Get Project ID</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your project subdomain or URL
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="myapp or myapp.wareality.tech"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!accessToken || loading}
          />

          <Button
            onClick={handleResolve}
            disabled={!accessToken || !input || loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Get"
            )}
          </Button>
        </div>

        {!accessToken && (
          <p className="text-xs text-amber-400">
            ⚠️ Please complete Step 1 (Login) first
          </p>
        )}

        {error && (
          <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-4 space-y-2">
            <p className="text-sm font-medium text-red-300">
              ❌ Project not found
            </p>
            <p className="text-xs text-red-400">
              We couldn’t find a project with this subdomain, or you don’t have access
              to it.
            </p>
            <ul className="list-disc pl-5 text-xs text-red-400 space-y-1">
              <li>Make sure the subdomain is correct</li>
              <li>Ensure you are logged into the correct account</li>
              <li>The project must belong to you</li>
            </ul>
          </div>
        )}


        {projectId && !error && (
          <div className="flex items-center justify-between rounded border border-green-800 bg-green-950 p-3">
            <span className="text-xs text-green-300">
              ✓ Project resolved:
              <code>{projectId}</code>
              <span className="text-gray-400"> → </span>
              <code>{projectSubdomain}.wareality.tech</code>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(projectId)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
