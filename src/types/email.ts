export interface Email {
  id: string;
  sender: string;
  subject: string;
  body: string;
  sentDate: string;
  priority: 'urgent' | 'normal';
  sentiment: 'positive' | 'negative' | 'neutral';
  category: string;
  status: 'pending' | 'resolved';
  extractedInfo: {
    contactDetails: string[];
    requirements: string[];
    sentimentIndicators: string[];
    metadata: Record<string, any>;
  };
  aiResponse?: string;
  responseGenerated?: boolean;
}

export interface EmailStats {
  totalEmails: number;
  emailsLast24h: number;
  emailsResolved: number;
  emailsPending: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  priorityBreakdown: {
    urgent: number;
    normal: number;
  };
}