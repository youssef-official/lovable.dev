import { SandpackProvider, SandpackLayout, SandpackPreview } from "@codesandbox/sandpack-react";

interface SandboxPreviewProps {
  files: Record<string, string>;
  template?: "vite-react" | "vite-react-ts" | "react" | "react-ts" | "nextjs";
}

export default function SandboxPreview({ 
  files,
  template
}: SandboxPreviewProps) {
  // Detect template if not provided
  // Simple heuristic: check for package.json dependencies or file extensions
  let activeTemplate = template;
  if (!activeTemplate) {
      if (files['package.json'] && files['package.json'].includes('"next"')) {
          activeTemplate = "nextjs";
      } else if (files['tsconfig.json']) {
          activeTemplate = "vite-react-ts";
      } else {
          activeTemplate = "vite-react";
      }
  }

  // Filter out any files that might cause issues or empty keys
  // and map them to what Sandpack expects
  const sandpackFiles = Object.entries(files).reduce((acc, [path, content]) => {
    if (content) {
      acc[path] = content;
    }
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="h-full w-full">
        <SandpackProvider
        template={activeTemplate as any}
        files={sandpackFiles}
        options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            classes: {
                "sp-wrapper": "h-full w-full",
                "sp-layout": "h-full w-full",
                "sp-stack": "h-full w-full",
                "sp-preview-container": "h-full w-full",
                "sp-preview-iframe": "h-full w-full",
            }
        }}
        theme="dark"
        customSetup={{
            dependencies: {
            "lucide-react": "latest",
            "react-router-dom": "latest",
            "clsx": "latest",
            "tailwind-merge": "latest",
            }
        }}
        style={{ height: '100%', width: '100%' }}
        >
        <SandpackLayout style={{ height: '100%', width: '100%', border: 'none', borderRadius: '0.5rem' }}>
            <SandpackPreview
                style={{ height: '100%', width: '100%' }}
                showOpenInCodeSandbox={false}
                showRefreshButton={true}
                showRestartButton={true}
            />
        </SandpackLayout>
        </SandpackProvider>
    </div>
  );
}
