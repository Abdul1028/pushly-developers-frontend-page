"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check, Download, Sparkles } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Step4YamlGenerator() {
  const [branch, setBranch] = useState("main");
  const [environment, setEnvironment] = useState("PRODUCTION");
  const [copied, setCopied] = useState(false);

  const generateYaml = () => {
    const githubSecret = "${{ secrets.PROJECT_ID }}";
    const githubToken = "${{ secrets.PUSHLY_TOKEN }}";
    const githubSha = "${{ github.sha }}";
    const githubEnv = "${{ env.deployment_id }}";
    
    return `name: Pushly Auto Deploy (${environment})

on:
  push:
    branches:
      - ${branch}

jobs:
  deploy-${environment.toLowerCase()}:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Trigger Deployment Creation
        id: create_deployment
        run: |
          echo "🚀 Creating deployment record on Pushly..."
          RESPONSE=$(curl -s -X POST "https://api.wareality.tech/api/projects/${githubSecret}/deployments" \\
            -H "Content-Type: application/json" \\
            -H "Authorization: Bearer ${githubToken}" \\
            -d "{
              \\"gitCommitHash\\": \\"${githubSha}\\",
              \\"gitBranch\\": \\"${branch}\\",
              \\"environment\\": \\"${environment}\\"
            }")
          
          echo "Response: $RESPONSE"
          DEPLOYMENT_ID=$(echo $RESPONSE | jq -r '.id')
          
          if [ "$DEPLOYMENT_ID" = "null" ] || [ -z "$DEPLOYMENT_ID" ]; then
            echo "❌ Failed to create deployment"
            exit 1
          fi
          echo "✅ Deployment created with ID: $DEPLOYMENT_ID"
          echo "deployment_id=$DEPLOYMENT_ID" >> $GITHUB_ENV

      - name: Trigger Actual Deployment
        run: |
          echo "🚀 Starting deployment to ${environment} environment..."
          curl -s -X POST "https://api.wareality.tech/api/projects/${githubSecret}/deployments/${githubEnv}/deploy?environment=${environment}" \\
            -H "Authorization: Bearer ${githubToken}"
          echo "✅ Deployment triggered to ${environment}!"

      - name: Done
        run: echo "🎉 Pushly Deployment to ${environment} initiated successfully!"`;
  };

  const yaml = generateYaml();

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([yaml], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `.github/workflows/pushly-deploy-${environment.toLowerCase()}.yml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-gray-800 bg-gray-950">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            4
          </div>
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Auto-generate YAML File
            </CardTitle>
            <CardDescription className="text-gray-400">
              Generate your GitHub Actions workflow file
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="branch" className="text-sm font-medium text-gray-300">
              Branch Name
            </label>
            <Input
              id="branch"
              type="text"
              placeholder="main"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="environment" className="text-sm font-medium text-gray-300">
              Environment
            </label>
            <Select value={environment} onValueChange={setEnvironment}>
              <SelectTrigger id="environment">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRODUCTION">PRODUCTION</SelectItem>
                <SelectItem value="STAGING">STAGING</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-300">Generated Workflow</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="border-gray-700 hover:bg-gray-800"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy YAML
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="border-gray-700 hover:bg-gray-800"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <SyntaxHighlighter
              language="yaml"
              style={vscDarkPlus}
              customStyle={{
                borderRadius: "0.5rem",
                padding: "1rem",
                fontSize: "0.875rem",
                margin: 0,
                maxHeight: "600px",
                overflow: "auto",
              }}
            >
              {yaml}
            </SyntaxHighlighter>
          </div>

          <div className="rounded-lg border border-amber-900/50 bg-amber-950/30 p-4">
            <p className="text-xs text-amber-300">
              <strong className="text-amber-200">📝 Next Steps:</strong> Save this file as <code className="text-amber-400">.github/workflows/pushly-deploy-{environment.toLowerCase()}.yml</code> in your repository root.
              Make sure you've completed Steps 1-3 before using this workflow!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

