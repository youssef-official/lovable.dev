# Changelog - MiniMax M2 Integration

## Changes Made

### 1. AI Model Configuration
- **Removed Models**: Groq, GPT, Claude, Gemini
- **Added Model**: MiniMax M2 (using Anthropic SDK compatibility)
- **Default Model**: `minimax/minimax-m2` → `MiniMax-M2`

### 2. Updated Files

#### Configuration Files
- `config/app.config.ts`: Updated to use only MiniMax M2 model
- `tailwind.config.ts`: Changed dark mode from "class" to "media" to prevent manual toggle
- `package.json`: Removed unused AI SDK packages (@ai-sdk/groq, @ai-sdk/google, @ai-sdk/openai, groq-sdk)

#### API Keys Management
- `lib/api-keys.ts`: Updated to support only MiniMax and E2B API keys
- `lib/api-key-utils.ts`: Simplified to handle only MiniMax and E2B
- `contexts/ApiKeysContext.tsx`: Updated validation for MiniMax API key
- `hooks/useApiRequest.ts`: Updated to send only MiniMax and E2B API keys

#### UI Components
- `components/ApiKeysSettings.tsx`: Updated form to show only MiniMax and E2B (Sandbox) API key inputs

#### API Routes
- `app/api/generate-ai-code-stream/route.ts`: Refactored to use MiniMax M2 with Anthropic SDK compatibility
- `app/api/analyze-edit-intent/route.ts`: Updated to use MiniMax M2 only
- `app/api/validate-api-key/route.ts`: Updated validation logic for MiniMax API key

### 3. MiniMax Integration Details

**API Endpoint**: `https://api.minimax.io/anthropic`

**Model Name**: `MiniMax-M2` or `MiniMax-M2-Stable`

**Features**:
- Context Length: 200k tokens
- Maximum Output: 128k tokens (including CoT)
- Agentic capabilities
- Function calling support
- Advanced reasoning
- Real-time streaming

**Authentication**: Bearer token via `Authorization` header

**Compatibility**: Uses Anthropic SDK with custom base URL

### 4. Design Improvements
- Disabled manual dark mode toggle (changed to system preference only)
- Simplified API key configuration interface
- Removed unnecessary model selection options

### 5. Required Environment Variables

```bash
MINIMAX_API_KEY=your_minimax_api_key_here
E2B_API_KEY=your_e2b_api_key_here
```

### 6. Breaking Changes
- All existing API keys for Groq, OpenAI, Anthropic, and Gemini are no longer used
- Users must obtain a MiniMax API key from: https://platform.minimaxi.com/user-center/basic-information/interface-key
- Model selection dropdown now only shows MiniMax M2

### 7. Migration Guide

**For Existing Users**:
1. Obtain a MiniMax API key from the MiniMax platform
2. Remove old API keys (Groq, OpenAI, etc.) from local storage
3. Add MiniMax API key in the settings
4. Continue using the application as before

**For Developers**:
1. Update environment variables to include `MINIMAX_API_KEY`
2. Remove unused AI SDK packages if needed: `npm install`
3. Test the application with MiniMax M2 model

## Testing Recommendations
- Test basic website generation
- Test code editing functionality
- Verify API key validation works correctly
- Check that streaming responses work properly
- Ensure E2B sandbox integration still functions

## Notes
- MiniMax M2 is compatible with Anthropic SDK, making integration seamless
- The model provides excellent code generation capabilities
- Temperature is set to 0.7 for optimal results
- All existing features should work without changes
