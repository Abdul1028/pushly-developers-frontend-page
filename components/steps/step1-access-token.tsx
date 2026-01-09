"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Key, Loader2 } from "lucide-react";
import { usePipeline } from "@/contexts/pipeline-context";

export default function Step2AccessToken() {
  const { accessToken, setAccessToken } = usePipeline();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenCopied, setTokenCopied] = useState(false);

  const handleGenerateToken = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://api.wareality.tech/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to authenticate");
      }

      const data = await response.json();
      if (data.accessToken) {
        setAccessToken(data.accessToken);
      } else if (data.token) {
        setAccessToken(data.token);
      } else {
        throw new Error("No access token found in response");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate token");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToken = () => {
    if (accessToken) {
      navigator.clipboard.writeText(accessToken);
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 2000);
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
            <CardTitle className="text-xl">Login & Generate Access Token</CardTitle>
            <CardDescription className="text-gray-400">
              Create an access token via the authentication API
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-300">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGenerateToken();
                }
              }}
            />
          </div>

          <Button
            onClick={handleGenerateToken}
            disabled={loading || !email || !password}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Token...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Generate Access Token
              </>
            )}
          </Button>

          {error && (
            <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-3">
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}
        </div>

        {accessToken && (
          <div className="space-y-3 rounded-lg border border-green-900/50 bg-green-950/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-green-400" />
                <label className="text-sm font-medium text-gray-300">
                  Generated Access Token
                </label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToken}
                className="border-gray-700 hover:bg-gray-800"
              >
                {tokenCopied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Token
                  </>
                )}
              </Button>
            </div>
            <div className="rounded bg-gray-900 p-3">
              <code className="text-xs text-green-400 break-all">{accessToken}</code>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

