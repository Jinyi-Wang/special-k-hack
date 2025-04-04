import { StoredChatSession } from '../../services/chatStorage';
import { ApiClientInterface } from '../types';

export interface Source {
  id: string;
  title: string;
  content: string;
  category: string;
  relevance_score?: number;
  tags?: string[];
  last_updated?: string;
}

export interface Message {
  id?: number;
  chat_id?: string;
  role: 'user' | 'bot' | 'assistant' | 'system';
  content: string;
  created_at?: string;
  sources?: Source[];
  metadata?: any;
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  created_at: string;
  updated_at: string;
  closed: boolean;
  metadata: any;
}

export interface ChatMessageResponse {
  message: Message;
  response: Message;
}

export interface MessageResponse {
  message: string;
}

// Add this interface with the other interfaces
export interface ChatRating {
  rating: number;
  moodChange: number;
  is_ai_inferred?: boolean;
  metadata?: any;
}

export function createChatApi(client: ApiClientInterface) {
  return {
    async createChat(metadata?: any): Promise<ChatSession> {
      const on_error = () => {
        // Error is handled by caller
      };

      const response = await client.post<ChatSession>('/api/chats', on_error, { metadata });
      return response;
    },

    async getChat(chatId: string): Promise<ChatSession> {
      const on_error = () => {
        // Error is handled by caller
      };

      const response = await client.get<ChatSession>(`/api/chats/${chatId}`, on_error);
      return response;
    },

    async getAllChats(): Promise<StoredChatSession[]> {
      const on_error = () => {
        // Error is handled by caller
      };

      const response = await client.get<StoredChatSession[]>(`/api/chats`, on_error);
      return response;
    },

    async getChatMessages(chatId: string): Promise<Message[]> {
      const on_error = () => {
        // Error is handled by caller
      };

      const response = await client.get<{ chat_id: string, messages: Message[] }>(`/api/chats/${chatId}/messages`, on_error);
      return response.messages;
    },

    async sendMessage(chatId: string, content: string, metadata?: any): Promise<{ message: Message, response: Message }> {
      const on_error = () => {
        // Error is handled by caller
      };

      const response = await client.post<ChatMessageResponse>(
        `/api/chats/${chatId}/messages`,
        on_error,
        { content, metadata }
      );

      return {
        message: response.message,
        response: response.response
      };
    },

    async deleteChat(chatId: string): Promise<MessageResponse> {
      const on_error = () => {
        // Error is handled by caller
      };

      // Explicitly define the return type
      const response = await client.delete<MessageResponse>(`/api/chats/${chatId}`, on_error);
      return response || { message: 'Chat deleted' };
    },

    async testCompletion(prompt: string): Promise<string> {
      const on_error = () => {
        // Error is handled by caller
      };

      const response = await client.post<{message: string}>('/api/test/completion', on_error, { prompt });
      return response.message;
    },

    async searchKnowledgeBase(query: string, category?: string): Promise<Source[]> {
      const on_error = () => {
        // Error is handled by caller
      };

      // Build the URL with query parameters
      let url = `/api/knowledge-base/search?query=${encodeURIComponent(query)}`;
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }

      const response = await client.get<{ items: Source[] }>(url, on_error);
      return response.items;
    },

    async closeChat(chatId: string): Promise<MessageResponse> {
      const on_error = () => {
        // Error is handled by caller
      };

      const response = await client.post<MessageResponse>(
        `/api/chats/${chatId}/close`,
        on_error,
        {}
      );
      return response;
    },

    async setChatRating(chatId: string, rating: ChatRating): Promise<MessageResponse> {
      const on_error = () => {
        // Error is handled by caller
      };

      const response = await client.post<MessageResponse>(
        `/api/chats/${chatId}/rating`,
        on_error,
        rating
      );
      return response;
    },
  };
}
