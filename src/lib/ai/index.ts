import { AIProvider, AIConfig } from '@/types';
import { ClaudeProvider } from './providers/claude';
import { OpenAIProvider } from './providers/openai';
import config from '@/lib/config';

export class AIService {
  private provider: ClaudeProvider | OpenAIProvider;

  constructor(providerType?: AIProvider, aiConfig?: AIConfig) {
    const selectedProvider = providerType || config.ai.defaultProvider;

    switch (selectedProvider) {
      case 'claude':
        this.provider = new ClaudeProvider(aiConfig);
        break;
      case 'openai':
        this.provider = new OpenAIProvider(aiConfig);
        break;
      default:
        throw new Error(`Unsupported AI provider: ${selectedProvider}`);
    }
  }

  async generateArticle(
    topic: string,
    keywords: string[],
    options: {
      tone?: 'professional' | 'casual' | 'technical' | 'friendly';
      length?: 'short' | 'medium' | 'long';
      language?: string;
      brandInfo?: {
        name: string;
        description?: string;
        products?: string[];
        values?: string[];
      };
    } = {}
  ): Promise<string> {
    return this.provider.generateArticle(topic, keywords, options);
  }

  async analyzeSERP(keyword: string): Promise<any> {
    return this.provider.analyzeSERP(keyword);
  }

  async improveContent(content: string, improvements: string[]): Promise<string> {
    return this.provider.improveContent(content, improvements);
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    return this.provider.generateText(prompt, systemPrompt);
  }
}

// Convenience function to create AI service
export function createAIService(provider?: AIProvider, aiConfig?: AIConfig): AIService {
  return new AIService(provider, aiConfig);
}

export default AIService;
