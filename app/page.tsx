import Step1ProjectId from "@/components/steps/step1-project-id";
import Step2AccessToken from "@/components/steps/step2-access-token";
import Step3GitHubSecrets from "@/components/steps/step3-github-secrets";
import Step4YamlGenerator from "@/components/steps/step4-yaml-generator";
import { PipelineProvider } from "@/contexts/pipeline-context";

export default function Home() {
  return (
    <PipelineProvider>
      <div className="min-h-screen bg-black">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold text-white">
              Pushly CI/CD Pipeline Builder
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Create automated deployment pipelines for your projects with GitHub Actions.
              Follow these simple steps to set up continuous deployment.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            <Step1ProjectId />
            <Step2AccessToken />
            <Step3GitHubSecrets />
            <Step4YamlGenerator />
          </div>

          {/* Footer */}
          <div className="mt-16 border-t border-gray-900 pt-8 text-center">
            <p className="text-sm text-gray-500">
              Need help? Check out our{" "}
              <a
                href="https://docs.pushly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                documentation
              </a>
              {" "}or{" "}
              <a
                href="https://support.pushly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                contact support
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </PipelineProvider>
  );
}
