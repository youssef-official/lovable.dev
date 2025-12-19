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

  // Clean paths first to ensure detection works correctly
  const sandpackFiles = Object.entries(files).reduce((acc, [path, content]) => {
    // Remove leading slash if present to match Sandpack's relative path expectation
    // e.g. "/src/App.jsx" -> "src/App.jsx"
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    if (content) {
      acc[cleanPath] = content;
    }
    return acc;
  }, {} as Record<string, string>);

  if (!activeTemplate) {
      if (sandpackFiles['package.json'] && sandpackFiles['package.json'].includes('"next"')) {
          activeTemplate = "nextjs";
      } else if (sandpackFiles['tsconfig.json']) {
          activeTemplate = "vite-react-ts";
      } else {
          activeTemplate = "vite-react";
      }
  }

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
            },
            activeFile: activeTemplate === 'nextjs' ? '/pages/index.js' : '/src/App.jsx'
        }}
        theme="dark"
        customSetup={{
            dependencies: {
            "lucide-react": "latest",
            "react-router-dom": "latest",
            "clsx": "latest",
            "tailwind-merge": "latest",
            "framer-motion": "latest",
            "recharts": "latest",
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
