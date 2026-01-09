"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PipelineContextType {
  projectId: string;
  setProjectId: (id: string) => void;
  projectSubdomain: string;
  setProjectSubdomain: (subdomain: string) => void;
  accessToken: string;
  setAccessToken: (token: string) => void;
  slackWebhookUrl: string;
  setSlackWebhookUrl: (url: string) => void;
  slackEnabled: boolean;
  setSlackEnabled: (enabled: boolean) => void;
}

const PipelineContext = createContext<PipelineContextType | undefined>(undefined);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [projectId, setProjectId] = useState("");
  const [projectSubdomain, setProjectSubdomain] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [slackEnabled, setSlackEnabled] = useState(false);

  return (
    <PipelineContext.Provider
      value={{
        projectId,
        setProjectId,
        projectSubdomain,
        setProjectSubdomain,
        accessToken,
        setAccessToken,
        slackWebhookUrl,
        setSlackWebhookUrl,
        slackEnabled,
        setSlackEnabled,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipeline() {
  const context = useContext(PipelineContext);
  if (context === undefined) {
    throw new Error("usePipeline must be used within a PipelineProvider");
  }
  return context;
}

