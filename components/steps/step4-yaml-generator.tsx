//  "use client";
// import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Copy, Check, Download, Sparkles } from "lucide-react";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { usePipeline } from "@/contexts/pipeline-context";

// export default function Step4YamlGenerator() {
//   const {
//     projectId,
//     projectSubdomain,
//     slackEnabled,
//     slackWebhookUrl,
//   } = usePipeline();

//   const [branch, setBranch] = useState("main");
//   const [environment, setEnvironment] = useState<"PRODUCTION" | "STAGING">(
//     "PRODUCTION"
//   );
//   const [copied, setCopied] = useState(false);

//   const generateYaml = () => {
//     const PROJECT_ID_SECRET = "${{ secrets.PROJECT_ID }}";
//     const PUSHLY_TOKEN = "${{ secrets.PUSHLY_TOKEN }}";
//     const GITHUB_SHA = "${{ github.sha }}";
//     const DEPLOYMENT_ENV_ID = "${{ env.deployment_id }}";
//     const JOB_STATUS = "${{ job.status }}";

//     // 🔥 URLs (no secrets, no leaks)
//     const productionUrl = `https://${projectSubdomain}.wareality.tech`;
//     const stagingUrl = `https://${DEPLOYMENT_ENV_ID}--${projectSubdomain}.wareality.tech`;

//     const slackStep =
//       slackEnabled && slackWebhookUrl
//         ? `
//       - name: Send Slack Notification
//         if: always()
//         run: |
//           DEPLOYMENT_STATUS="${JOB_STATUS}"
//           COMMIT_SHORT=$(echo "${GITHUB_SHA}" | cut -c1-7)
//           DEPLOYMENT_ID="${DEPLOYMENT_ENV_ID}"

//           if [ "${environment}" = "PRODUCTION" ]; then
//             DEPLOYMENT_URL="${productionUrl}"
//           else
//             DEPLOYMENT_URL="${stagingUrl}"
//           fi

//           if [ "$DEPLOYMENT_STATUS" = "success" ]; then
//             MESSAGE="✅ Deployment successful for ${projectSubdomain} (${environment}) | Commit: $COMMIT_SHORT | URL: $DEPLOYMENT_URL"
//           else
//             MESSAGE="❌ Deployment failed for ${projectSubdomain} (${environment}) | Commit: $COMMIT_SHORT"
//           fi

//           MESSAGE_ESC=$(echo "$MESSAGE" | sed 's/"/\\"/g')

//           curl -X POST "${slackWebhookUrl}" \\
//             -H "Content-Type: application/json" \\
//             -d "{\\"text\\": \\"$MESSAGE_ESC\\"}"
//         `
//         : "";

//     return `name: Pushly Auto Deploy (${environment})

// on:
//   push:
//     branches:
//       - ${branch}

// jobs:
//   deploy-${environment.toLowerCase()}:
//     runs-on: ubuntu-latest
//     steps:
//       - name: Checkout repository
//         uses: actions/checkout@v4

//       - name: Create Deployment
//         id: create_deployment
//         run: |
//           RESPONSE=$(curl -s -X POST "https://api.wareality.tech/api/projects/${PROJECT_ID_SECRET}/deployments" \\
//             -H "Content-Type: application/json" \\
//             -H "Authorization: Bearer ${PUSHLY_TOKEN}" \\
//             -d "{
//               \\"gitCommitHash\\": \\"${GITHUB_SHA}\\",
//               \\"gitBranch\\": \\"${branch}\\",
//               \\"environment\\": \\"${environment}\\"
//             }")

//           DEPLOYMENT_ID=$(echo $RESPONSE | jq -r '.id')

//           if [ -z "$DEPLOYMENT_ID" ] || [ "$DEPLOYMENT_ID" = "null" ]; then
//             echo "❌ Failed to create deployment"
//             exit 1
//           fi

//           echo "deployment_id=$DEPLOYMENT_ID" >> $GITHUB_ENV

//       - name: Trigger Deployment
//         run: |
//           curl -s -X POST "https://api.wareality.tech/api/projects/${PROJECT_ID_SECRET}/deployments/${DEPLOYMENT_ENV_ID}/deploy?environment=${environment}" \\
//             -H "Authorization: Bearer ${PUSHLY_TOKEN}"
// ${slackStep}

//       - name: Done
//         run: echo "🎉 Deployment triggered successfully"
// `;
//   };

//   const yaml = generateYaml();

//   return (
// <Card className="border-gray-800 bg-gray-950">
//   <CardHeader>
//     <div className="flex items-center gap-3">
//       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
//         4
//       </div>
//       <div>
//         <CardTitle className="text-xl flex items-center gap-2">
//           <Sparkles className="h-5 w-5" />
//           Generate GitHub Actions YAML
//         </CardTitle>
//         <CardDescription className="text-gray-400">
//           Production & Staging supported automatically
//         </CardDescription>
//       </div>
//     </div>
//   </CardHeader>

//   <CardContent className="space-y-6">
//     {/* Controls */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//       <div className="space-y-2">
//         <label className="text-sm font-medium text-gray-300">Branch</label>
//         <Input value={branch} onChange={(e) => setBranch(e.target.value)} />
//       </div>

//       <div className="space-y-2">
//         <label className="text-sm font-medium text-gray-300">Environment</label>
//         <Select
//           value={environment}
//           onValueChange={(v) => setEnvironment(v as any)}
//         >
//           <SelectTrigger>
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="PRODUCTION">PRODUCTION</SelectItem>
//             <SelectItem value="STAGING">STAGING</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//     </div>

//     {/* YAML Header */}
//     <div className="flex items-center justify-between">
//       <h4 className="text-sm font-semibold text-gray-300">
//         Generated Workflow
//       </h4>

//       <div className="flex gap-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => {
//             navigator.clipboard.writeText(yaml);
//             setCopied(true);
//             setTimeout(() => setCopied(false), 2000);
//           }}
//         >
//           {copied ? (
//             <>
//               <Check className="mr-2 h-4 w-4 text-green-500" />
//               Copied
//             </>
//           ) : (
//             <>
//               <Copy className="mr-2 h-4 w-4" />
//               Copy YAML
//             </>
//           )}
//         </Button>

//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => {
//             const blob = new Blob([yaml], { type: "text/yaml" });
//             const url = URL.createObjectURL(blob);
//             const a = document.createElement("a");
//             a.href = url;
//             a.download = `.github/workflows/pushly-deploy-${environment.toLowerCase()}.yml`;
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//             URL.revokeObjectURL(url);
//           }}
//         >
//           <Download className="mr-2 h-4 w-4" />
//           Download
//         </Button>
//       </div>
//     </div>

//     {/* YAML Preview */}
//     <div className="relative rounded-lg overflow-hidden border border-gray-800">
//       <SyntaxHighlighter
//         language="yaml"
//         style={vscDarkPlus}
//         customStyle={{
//           margin: 0,
//           padding: "1rem",
//           fontSize: "0.875rem",
//           maxHeight: "600px",
//         }}
//       >
//         {yaml}
//       </SyntaxHighlighter>
//     </div>

//     {/* Hint */}
//     <div className="rounded-lg border border-amber-900/50 bg-amber-950/30 p-4">
//       <p className="text-xs text-amber-300">
//         <strong className="text-amber-200">📝 Next step:</strong> Save this file
//         as{" "}
//         <code className="text-amber-400">
//           .github/workflows/pushly-deploy-{environment.toLowerCase()}.yml
//         </code>{" "}
//         in your repository.
//       </p>
//     </div>
//   </CardContent>
// </Card>
//   );
// }


"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check, Download, Sparkles } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { usePipeline } from "@/contexts/pipeline-context";

export default function Step4YamlGenerator() {
  const { projectSubdomain, slackEnabled, slackWebhookUrl } = usePipeline();

  const [branch, setBranch] = useState("main");
  const [environment, setEnvironment] =
    useState<"PRODUCTION" | "STAGING">("PRODUCTION");
  const [copied, setCopied] = useState(false);

  const generateYaml = () => {
    const PROJECT_ID_SECRET = "${{ secrets.PROJECT_ID }}";
    const PUSHLY_TOKEN = "${{ secrets.PUSHLY_TOKEN }}";
    const GITHUB_SHA = "${{ github.sha }}";
    const DEPLOYMENT_ID = "${{ env.deployment_id }}";
    const JOB_STATUS = "${{ job.status }}";

    // ✅ URL decided at generation time (NO runtime if/else)
    const deploymentUrl =
      environment === "PRODUCTION"
        ? `https://${projectSubdomain}.wareality.tech`
        : `https://${DEPLOYMENT_ID}--${projectSubdomain}.wareality.tech`;

    const slackStep =
      slackEnabled && slackWebhookUrl
        ? `
      - name: Send Slack Notification
        if: always()
        run: |
          COMMIT_SHORT=$(echo "${GITHUB_SHA}" | cut -c1-7)

          if [ "${JOB_STATUS}" = "success" ]; then
            MESSAGE="✅ Deployment successful for ${projectSubdomain} (${environment}) | Commit: $COMMIT_SHORT | URL: ${deploymentUrl}"
          else
            MESSAGE="❌ Deployment failed for ${projectSubdomain} (${environment}) | Commit: $COMMIT_SHORT"
          fi

          MESSAGE_ESC=$(echo "$MESSAGE" | sed 's/"/\\"/g')

          curl -X POST "${slackWebhookUrl}" \\
            -H "Content-Type: application/json" \\
            -d "{\\"text\\": \\"$MESSAGE_ESC\\"}"
`
        : "";

    return `name: Pushly Auto Deploy (${environment})

on:
  push:
    branches:
      - ${branch}

jobs:
  deploy-${environment.toLowerCase()}:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Create Deployment
        run: |
          RESPONSE=$(curl -s -X POST "https://api.wareality.tech/api/projects/${PROJECT_ID_SECRET}/deployments" \\
            -H "Content-Type: application/json" \\
            -H "Authorization: Bearer ${PUSHLY_TOKEN}" \\
            -d "{
              \\"gitCommitHash\\": \\"${GITHUB_SHA}\\",
              \\"gitBranch\\": \\"${branch}\\",
              \\"environment\\": \\"${environment}\\"
            }")

          DEPLOYMENT_ID=$(echo $RESPONSE | jq -r '.id')

          if [ -z "$DEPLOYMENT_ID" ] || [ "$DEPLOYMENT_ID" = "null" ]; then
            echo "❌ Failed to create deployment"
            exit 1
          fi

          echo "deployment_id=$DEPLOYMENT_ID" >> $GITHUB_ENV

      - name: Trigger Deployment
        run: |
          curl -s -X POST "https://api.wareality.tech/api/projects/${PROJECT_ID_SECRET}/deployments/${DEPLOYMENT_ID}/deploy?environment=${environment}" \\
            -H "Authorization: Bearer ${PUSHLY_TOKEN}"
${slackStep}

      - name: Done
        run: echo "🎉 Deployment triggered successfully"
`;
  };

  const yaml = generateYaml();

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
              Generate GitHub Actions YAML
            </CardTitle>
            <CardDescription className="text-gray-400">
              Environment-specific workflow (no runtime conditionals)
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300">Branch</label>
            <Input value={branch} onChange={(e) => setBranch(e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-gray-300">Environment</label>
            <Select value={environment} onValueChange={(v) => setEnvironment(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRODUCTION">PRODUCTION</SelectItem>
                <SelectItem value="STAGING">STAGING</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold text-gray-300">Generated Workflow</h4>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(yaml);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? "Copied" : "Copy YAML"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const blob = new Blob([yaml], { type: "text/yaml" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `.github/workflows/pushly-deploy-${environment.toLowerCase()}.yml`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <SyntaxHighlighter language="yaml" style={vscDarkPlus}>
            {yaml}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  );
}
