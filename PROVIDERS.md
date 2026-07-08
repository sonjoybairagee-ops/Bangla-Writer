# AI Providers - Multi-Provider Support with Smart Routing

The application supports multiple AI providers with automatic fallback and smart routing. If one provider fails or is unavailable, the system automatically tries the next available provider.

## 🤖 Supported Providers

### 1. **OpenAI** (Primary) ⭐
- **Models**: GPT-4o, GPT-4o-mini
- **Best for**: General content generation, JSON responses, high quality
- **Speed**: Fast
- **Cost**: Moderate ($0.01-0.05 per request)
- **Setup**: https://platform.openai.com/api-keys

**Why use it:**
- Most reliable and tested
- Best JSON support
- High quality outputs
- Wide model selection

### 2. **Grok (xAI)** (Alternative)
- **Models**: Grok-beta
- **Best for**: Quick responses, casual content
- **Speed**: Very fast
- **Cost**: Low (competitive pricing)
- **Setup**: https://x.ai/api

**Why use it:**
- Fast response times
- Good for simple tasks
- X.ai integration
- OpenAI-compatible API

### 3. **Google Gemini** (Free Tier)
- **Models**: Gemini Pro, Gemini Pro Vision
- **Best for**: Free tier usage, multimodal tasks
- **Speed**: Fast
- **Cost**: FREE tier available!
- **Setup**: https://makersuite.google.com/app/apikey

**Why use it:**
- Generous free tier
- Fast and efficient
- Multimodal support (images)
- Google integration

### 4. **Anthropic Claude** (Advanced)
- **Models**: Claude 3.5 Sonnet, Claude 3.5 Haiku
- **Best for**: Complex reasoning, long context, analysis
- **Speed**: Moderate
- **Cost**: Higher ($0.03-0.15 per request)
- **Setup**: https://console.anthropic.com/

**Why use it:**
- Best reasoning capabilities
- Long context (200k tokens)
- High quality analysis
- Safe and reliable

## 🎯 How Smart Routing Works

### Priority Order (Default):
1. **OpenAI** - Tried first (most reliable)
2. **Grok** - Fast fallback
3. **Gemini** - Free tier option
4. **Claude** - Advanced fallback

### Automatic Fallback:
```
Request → Try OpenAI
         ↓ (fails)
         Try Grok
         ↓ (fails)
         Try Gemini
         ↓ (fails)
         Try Claude
         ↓ (all failed)
         Return Error
```

### Provider Selection Logic:
- ✅ API key configured
- ✅ Provider is available (reachable)
- ✅ API key is valid
- ✅ Has sufficient quota

## 🚀 Quick Setup

### Option 1: Single Provider (OpenAI)
```bash
# .env
OPENAI_API_KEY="sk-proj-your-key"
```
**Result**: Uses OpenAI only, no fallback

### Option 2: OpenAI + Gemini (Recommended for Budget)
```bash
# .env
OPENAI_API_KEY="sk-proj-your-key"
GEMINI_API_KEY="your-gemini-key"
```
**Result**: Uses OpenAI, falls back to free Gemini if OpenAI fails

### Option 3: All Providers (Maximum Reliability)
```bash
# .env
OPENAI_API_KEY="sk-proj-your-key"
GROK_API_KEY="xai-your-key"
GEMINI_API_KEY="your-gemini-key"
ANTHROPIC_API_KEY="sk-ant-your-key"
```
**Result**: Maximum uptime, automatic failover

## 📝 Usage Examples

### Basic Usage (Auto Provider Selection)
```typescript
import { generateText, generateJSON } from '@/lib/ai/openai';

// Automatically selects best available provider
const response = await generateText('Write a blog post about AI');
console.log(response.text);
console.log(response.provider); // "openai", "grok", etc.
```

### Specific Provider
```typescript
import { generateText } from '@/lib/ai/openai';

// Force specific provider
const response = await generateText('Write content', {
  provider: 'gemini',  // Use Gemini specifically
  temperature: 0.8,
});
```

### JSON Generation with Fallback
```typescript
import { generateJSON } from '@/lib/ai/openai';

const data = await generateJSON<{ title: string; content: string }>(
  'Generate a blog post structure',
  { provider: 'auto' }  // Auto fallback
);

console.log(data.title);
```

### Check Available Providers
```typescript
import { getAvailableProviders, getProviderStatus } from '@/lib/ai/openai';

// Get all working providers
const available = await getAvailableProviders();
console.log(`${available.length} providers available`);

// Get detailed status
const status = await getProviderStatus();
status.forEach(p => {
  console.log(`${p.displayName}: ${p.available ? '✓' : '✗'}`);
});
```

## 🔧 Configuration

### Environment Variables

```bash
# Primary Provider (Required for AI features)
OPENAI_API_KEY="sk-proj-..."

# Optional Fallback Providers
GROK_API_KEY="xai-..."        # Optional but recommended
GEMINI_API_KEY="..."           # Optional, has free tier
ANTHROPIC_API_KEY="sk-ant-..." # Optional
```

### Model Selection

Each provider has three model tiers:

```typescript
interface Provider {
  models: {
    fast: string;      // Quick, cheap responses
    standard: string;  // Balanced quality/speed
    advanced: string;  // Best quality, slower
  };
}
```

**Example:**
```typescript
// Use fast model (cheaper, quicker)
await generateText(prompt, { model: 'fast' });

// Use standard model (default)
await generateText(prompt, { model: 'standard' });

// Use advanced model (best quality)
await generateText(prompt, { model: 'advanced' });
```

## 💰 Cost Comparison

| Provider | Fast Model | Standard Model | Advanced Model | Free Tier |
|----------|-----------|----------------|----------------|-----------|
| OpenAI | $0.01/req | $0.03/req | $0.05/req | No |
| Grok | $0.008/req | $0.02/req | $0.02/req | No |
| Gemini | FREE | FREE | $0.02/req | YES ✅ |
| Claude | $0.02/req | $0.08/req | $0.15/req | No |

*Approximate costs for typical content generation (500-1000 tokens)*

### Recommended Setup for Budget:
1. **Gemini** as primary (free tier)
2. **OpenAI** as fallback for complex tasks
3. Cost: ~$5-10/month for moderate use

### Recommended Setup for Quality:
1. **OpenAI** as primary (best quality)
2. **Claude** for complex reasoning
3. **Gemini** as free backup
4. Cost: ~$20-40/month for heavy use

## 📊 Monitoring Provider Status

### In Admin Panel

Visit: `http://localhost:3000/admin/settings`
- See all configured providers
- Check availability status
- View usage statistics (coming soon)

### Via API

```bash
# Check provider status
curl http://localhost:3000/api/ai/providers

# Response:
{
  "success": true,
  "providers": [
    {
      "name": "openai",
      "displayName": "OpenAI",
      "available": true,
      "configured": true
    },
    {
      "name": "gemini",
      "displayName": "Google Gemini",
      "available": true,
      "configured": true
    },
    ...
  ],
  "availableCount": 2,
  "primaryProvider": "openai"
}
```

## 🐛 Troubleshooting

### Issue: "No AI providers are available"

**Cause**: No API keys configured or all providers are down

**Solution**:
1. Add at least one API key to `.env`
2. Restart dev server: `npm run dev`
3. Check API key validity
4. Check provider status pages

### Issue: "All AI providers failed"

**Cause**: Network issues or quota exceeded on all providers

**Solution**:
1. Check internet connection
2. Verify API keys are valid
3. Check billing/quota on provider dashboards
4. Wait a few minutes and try again

### Issue: Specific provider always fails

**Cause**: Invalid API key or quota exceeded

**Solution**:
```bash
# Check provider status
node scripts/check-providers.js

# Output shows which providers work:
✓ OpenAI: Available
✗ Grok: API key invalid
✓ Gemini: Available
✗ Claude: Not configured
```

## 🔐 Security Best Practices

1. **Never commit API keys** - Already in `.gitignore`
2. **Use environment variables** - Store keys in `.env`
3. **Rotate keys regularly** - Every 3-6 months
4. **Set usage limits** - On provider dashboards
5. **Monitor usage** - Check billing regularly
6. **Use different keys** - Dev vs Production

## 🚦 Provider Health Check

The system automatically checks provider health every 5 minutes and caches results.

**Manual health check:**
```typescript
import { clearCache, getProviderStatus } from '@/lib/ai/openai';

// Clear cache and recheck
clearCache();
const status = await getProviderStatus();
```

## 📈 Performance Optimization

### Tips for Best Performance:

1. **Use appropriate models**
   - Fast tasks → fast models
   - Complex tasks → advanced models

2. **Cache results**
   - Store frequently used generations
   - Reduce redundant API calls

3. **Set reasonable limits**
   ```typescript
   await generateText(prompt, {
     maxTokens: 500,  // Limit response length
     temperature: 0.7, // Balance creativity/consistency
   });
   ```

4. **Use streaming for long content**
   ```typescript
   const stream = await generateStream(prompt);
   // Process chunks as they arrive
   ```

## 🔄 Migration from Single Provider

If you're currently using only OpenAI:

### Before:
```typescript
import { generateCompletion } from '@/lib/ai/openai';
const text = await generateCompletion(prompt);
```

### After (with fallback):
```typescript
import { generateText } from '@/lib/ai/openai';
const response = await generateText(prompt);
const text = response.text;
console.log(`Used: ${response.provider}`);
```

**No breaking changes!** Old functions still work but new ones provide more features.

## 🎓 Best Practices

### ✅ DO:
- Configure at least 2 providers for reliability
- Use Gemini for development (free tier)
- Use OpenAI for production (best quality)
- Monitor usage and costs
- Set up alerts for quota limits
- Use appropriate models for tasks

### ❌ DON'T:
- Hardcode API keys in code
- Use advanced models for simple tasks
- Skip error handling
- Forget to clear cache in tests
- Use same API key for dev and prod

## 📚 Additional Resources

- **OpenAI Docs**: https://platform.openai.com/docs
- **Grok API**: https://docs.x.ai/
- **Gemini Docs**: https://ai.google.dev/docs
- **Claude Docs**: https://docs.anthropic.com/

## 🆘 Support

If you need help:
1. Check provider status: `/api/ai/providers`
2. Review error messages
3. Check provider dashboards for quotas
4. See AI_SETUP.md for detailed setup
5. Create GitHub issue with logs

---

**Quick Start**: Just add `OPENAI_API_KEY` to `.env` and you're ready! Add more providers for better reliability. 🚀
