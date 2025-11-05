"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { Copy } from "lucide-react";
import { usePipeline } from "@/contexts/pipeline-context";

export default function Step1ProjectId() {
  const { projectId, setProjectId } = usePipeline();
  const [inputValue, setInputValue] = useState("");
  const [showToast, setShowToast] = useState(false);

  const extractSubdomain = (url: string): string => {
    // Extract subdomain from various URL formats
    // Examples: 
    // - https://focus-flow.wareality.tech → focus-flow
    // - focus-flow.wareality.tech → focus-flow
    // - https://your-project.pushly.com → your-project
    // - your-project.pushly.com → your-project
    
    // Try to match wareality.tech first (current domain)
    let pattern = /(?:https?:\/\/)?(?:www\.)?([^.]+)\.wareality\.tech/i;
    let match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
    
    // Fallback to pushly.com (legacy domain)
    pattern = /(?:https?:\/\/)?(?:www\.)?([^.]+)\.pushly\.com/i;
    match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
    
    // If it's just a subdomain without domain, return as is
    // But if it contains a dot, try to extract the first part
    const trimmed = url.trim();
    if (trimmed.includes(".") && !trimmed.includes("http")) {
      const parts = trimmed.split(".");
      // If it looks like a domain (has more than one part), return first part
      if (parts.length >= 2) {
        return parts[0];
      }
    }
    
    return trimmed;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // If it looks like a URL or contains a domain, extract subdomain
    if (value.includes("wareality.tech") || value.includes("pushly.com") || value.includes("http") || (value.includes(".") && value.split(".").length >= 2)) {
      const extracted = extractSubdomain(value);
      setProjectId(extracted);
      // Only update input if we successfully extracted something different
      if (extracted && extracted !== value) {
        setInputValue(extracted);
      }
    } else {
      setProjectId(value);
    }
  };

  const handleCopy = () => {
    if (projectId) {
      navigator.clipboard.writeText(projectId);
      setShowToast(true);
    }
  };

  return (
    <Card className="border-gray-800 bg-gray-950">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            1
          </div>
          <div>
            <CardTitle className="text-xl">Get Your Project ID</CardTitle>
            <CardDescription className="text-gray-400">
              Your Project ID is your Pushly subdomain
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="project-id" className="text-sm font-medium text-gray-300">
            Project ID (Subdomain)
          </label>
          <div className="flex gap-2">
            <Input
              id="project-id"
              type="text"
              placeholder="focus-flow.wareality.tech or focus-flow"
              value={inputValue}
              onChange={handleInputChange}
              className="flex-1"
            />
            {projectId && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="border-gray-700 hover:bg-gray-800"
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Paste your Pushly dashboard URL or subdomain. We'll automatically extract the Project ID.
            For example: <code className="text-gray-400">focus-flow.wareality.tech</code> or <code className="text-gray-400">focus-flow</code>.
          </p>
          {projectId && (
            <div className="rounded-lg border border-green-900/50 bg-green-950/30 p-3">
              <p className="text-xs text-green-300">
                <strong className="text-green-200">✓ Project ID detected:</strong> <code className="text-green-400">{projectId}</code>
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <Toast
        message="project-id received"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </Card>
  );
}

