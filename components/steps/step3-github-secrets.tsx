"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, ExternalLink, Shield } from "lucide-react";
import { usePipeline } from "@/contexts/pipeline-context";

export default function Step3GitHubSecrets() {
  const { projectId, accessToken } = usePipeline();
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [copied, setCopied] = useState({ projectIdKey: false, projectIdValue: false, tokenKey: false, tokenValue: false });

  const secretsUrl = owner && repo 
    ? `https://github.com/${owner}/${repo}/settings/secrets/actions`
    : "https://github.com/{owner}/{repo}/settings/secrets/actions";

  const handleCopy = (type: "projectIdKey" | "projectIdValue" | "tokenKey" | "tokenValue") => {
    let textToCopy = "";
    if (type === "projectIdKey") textToCopy = "PROJECT_ID";
    else if (type === "projectIdValue") textToCopy = projectId;
    else if (type === "tokenKey") textToCopy = "PUSHLY_TOKEN";
    else if (type === "tokenValue") textToCopy = accessToken;

    navigator.clipboard.writeText(textToCopy);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  return (
    <Card className="border-gray-800 bg-gray-950">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            3
          </div>
          <div>
            <CardTitle className="text-xl">Add GitHub Secrets</CardTitle>
            <CardDescription className="text-gray-400">
              Configure your repository secrets for automated deployments
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Required Secrets
          </h4>
          
          {(!projectId || !accessToken) && (
            <div className="rounded-lg border border-amber-900/50 bg-amber-950/30 p-4">
              <p className="text-xs text-amber-300">
                <strong className="text-amber-200">⚠️ Complete previous steps:</strong> Please complete Steps 1 and 2 to see the secret values here.
              </p>
            </div>
          )}

          <div className="space-y-4 rounded-lg border border-gray-800 bg-gray-900 p-4">
            {/* PROJECT_ID Secret */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Key</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="rounded bg-gray-800 px-3 py-2 text-sm font-mono text-blue-400">
                      PROJECT_ID
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy("projectIdKey")}
                      className="h-8 w-8 p-0"
                    >
                      {copied.projectIdKey ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Value</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {projectId ? (
                      <>
                        <code className="flex-1 rounded bg-gray-800 px-3 py-2 text-sm font-mono text-green-400 break-all">
                          {projectId}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy("projectIdValue")}
                          className="h-8 w-8 p-0"
                        >
                          {copied.projectIdValue ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </>
                    ) : (
                      <span className="flex-1 rounded bg-gray-800 px-3 py-2 text-sm text-gray-500 italic">
                        Not available (complete Step 1)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-800" />

            {/* PUSHLY_TOKEN Secret */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Key</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="rounded bg-gray-800 px-3 py-2 text-sm font-mono text-blue-400">
                      PUSHLY_TOKEN
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy("tokenKey")}
                      className="h-8 w-8 p-0"
                    >
                      {copied.tokenKey ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Value</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {accessToken ? (
                      <>
                        <code className="flex-1 rounded bg-gray-800 px-3 py-2 text-sm font-mono text-green-400 break-all">
                          {accessToken}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy("tokenValue")}
                          className="h-8 w-8 p-0"
                        >
                          {copied.tokenValue ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </>
                    ) : (
                      <span className="flex-1 rounded bg-gray-800 px-3 py-2 text-sm text-gray-500 italic">
                        Not available (complete Step 2)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Owner and Repository */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="owner" className="text-sm font-medium text-gray-300">
                  GitHub Owner
                </label>
                <Input
                  id="owner"
                  type="text"
                  placeholder="your-username"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="repo" className="text-sm font-medium text-gray-300">
                  Repository Name
                </label>
                <Input
                  id="repo"
                  type="text"
                  placeholder="your-repo"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                />
              </div>
            </div>
            
            {owner && repo && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-medium">
                  💡 Tip: directly add these above secrets from here
                </p>
                <a
                  href={secretsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open GitHub Secrets Page
                </a>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-blue-900/50 bg-blue-950/30 p-4">
            <p className="text-xs text-blue-300">
              <strong className="text-blue-200">💡 Tip:</strong> Copy the Key name and Value separately. In GitHub Secrets, use the Key as the secret name and paste the Value as the secret value. Both must be added exactly as shown above.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

