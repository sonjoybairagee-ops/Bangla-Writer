# AI Features Setup Guide

## Overview
This application uses OpenAI's GPT models for AI-powered content generation and brand analysis features.

## Required: OpenAI API Key

### Why is it needed?
- **Brand Brain**: Website scraping and brand voice analysis
- **Content Writer**: Generate blog posts, social media content
- **Hook Generator**: Create viral hooks
- **Content Planner**: AI-powered content suggestions
- **Creative Studio**: Generate creative content ideas

### How to get an OpenAI API Key:

1. **Create an OpenAI Account**
   - Visit: https://platform.openai.com/
   - Sign up or log in

2. **Add Payment Method**
   - Go to: https://platform.openai.com/account/billing
   - Add a credit card (Required for API access)
   - OpenAI charges based on usage (pay-as-you-go)

3. **Create API Key**
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Give it a name (e.g., "Bangla Creator Dev")
   - **IMPORTANT**: Copy the key immediately (you won't see it again!)

4. **Add to .env File**
   ```bash
   OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

5. **Restart Development Server**
   ```bash
   npm run dev
   ```

## Cost Estimates

OpenAI charges per token (words). Approximate costs:

| Feature | Model | Cost per Request | Est. Monthly Cost* |
|---------|-------|------------------|-------------------|
| Brand Voice Analysis | GPT-4o | $0.05 - $0.10 | $5 - $10 |
| Content Generation | GPT-4o-mini | $0.01 - $0.02 | $10 - $20 |
| Website Scraping | GPT-4o | $0.03 - $0.05 | $3 - $5 |

*Based on moderate usage (100-200 requests/month)

## Testing Without OpenAI (Free Alternative)

If you want to test without OpenAI costs, you can:

1. **Use Mock Data**: Some features have mock data fallbacks
2. **Manual Entry**: Enter brand information manually instead of scraping
3. **Skip AI Features**: Use the app without AI-powered generation

## Environment Variables

Complete `.env` setup:

```bash
# Database (Required)
DATABASE_URL="your-neon-database-url"

# NextAuth (Required for Authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OpenAI (Required for AI Features)
OPENAI_API_KEY="sk-proj-your-key-here"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Bangla Creator"
```

## Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use online generator: https://generate-secret.vercel.app/32

## Troubleshooting

### Error: "Failed to extract brand information from website"
**Cause**: OpenAI API key is missing or invalid
**Solution**: Add valid OPENAI_API_KEY to .env file

### Error: "Invalid OpenAI API key"
**Cause**: API key is incorrect or expired
**Solution**: Generate a new key from https://platform.openai.com/api-keys

### Error: "OpenAI API quota exceeded"
**Cause**: You've used up your OpenAI credits
**Solution**: Add more credits to your OpenAI account

### Error: "Failed to generate AI content"
**Cause**: OpenAI service is down or network issues
**Solution**: Check https://status.openai.com/ or try again later

## API Usage Monitoring

Monitor your OpenAI API usage:
- Dashboard: https://platform.openai.com/usage
- Set usage limits to avoid unexpected charges
- Enable email alerts for billing

## Production Deployment

For production (Vercel):

1. Add environment variable in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your production API key
   - **Important**: Use a different key for production vs development

2. Enable rate limiting to control costs

3. Monitor usage regularly

## Alternative AI Providers (Future)

The app architecture supports multiple AI providers. Future support planned for:
- Anthropic Claude
- Google Gemini
- Azure OpenAI
- Local LLMs (Ollama)

## Security Best Practices

1. **Never commit .env file** (already in .gitignore)
2. **Use different API keys** for dev and production
3. **Rotate keys regularly** (every 3-6 months)
4. **Set usage limits** in OpenAI dashboard
5. **Enable rate limiting** in production

## Getting Help

If you encounter issues:

1. Check the error message details
2. Review OpenAI status: https://status.openai.com/
3. Check API key permissions and billing
4. Review this guide
5. Contact support with error logs

## Cost Optimization Tips

1. **Use GPT-4o-mini** for most features (cheaper, faster)
2. **Use GPT-4o** only for complex analysis (brand voice)
3. **Cache results** where possible (brand profiles, templates)
4. **Set token limits** to prevent runaway costs
5. **Monitor usage** weekly

---

**Ready to start?** Add your OPENAI_API_KEY to `.env` and restart the server!
