import { Email } from '../types/email';

export class EmailProcessor {
  private supportKeywords = ['support', 'query', 'request', 'help', 'issue', 'problem', 'assistance'];
  private urgentKeywords = ['urgent', 'immediately', 'critical', 'cannot access', 'down', 'emergency', 'asap', 'blocked'];
  private positiveWords = ['thank', 'appreciate', 'great', 'excellent', 'satisfied', 'happy', 'pleased'];
  private negativeWords = ['frustrated', 'angry', 'disappointed', 'terrible', 'awful', 'hate', 'worst', 'unacceptable'];

  filterSupportEmails(emails: any[]): any[] {
    return emails.filter(email => 
      this.supportKeywords.some(keyword => 
        email.subject.toLowerCase().includes(keyword) || 
        email.body.toLowerCase().includes(keyword)
      )
    );
  }

  analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const lowerText = text.toLowerCase();
    const positiveCount = this.positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = this.negativeWords.filter(word => lowerText.includes(word)).length;

    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  }

  determinePriority(text: string): 'urgent' | 'normal' {
    const lowerText = text.toLowerCase();
    return this.urgentKeywords.some(keyword => lowerText.includes(keyword)) ? 'urgent' : 'normal';
  }

  extractInformation(email: any) {
    const text = `${email.subject} ${email.body}`;
    
    // Extract contact details (simplified regex patterns)
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    
    const contactDetails = [
      ...(text.match(phoneRegex) || []),
      ...(text.match(emailRegex) || []).filter(e => e !== email.sender)
    ];

    // Extract requirements (simplified - look for question words and action verbs)
    const requirementIndicators = ['need', 'want', 'require', 'looking for', 'help with', 'issue with'];
    const requirements = requirementIndicators
      .filter(indicator => text.toLowerCase().includes(indicator))
      .map(indicator => {
        const index = text.toLowerCase().indexOf(indicator);
        return text.substring(index, index + 100).trim();
      });

    // Extract sentiment indicators
    const sentimentIndicators = [
      ...this.positiveWords.filter(word => text.toLowerCase().includes(word)),
      ...this.negativeWords.filter(word => text.toLowerCase().includes(word))
    ];

    return {
      contactDetails,
      requirements,
      sentimentIndicators,
      metadata: {
        wordCount: text.split(' ').length,
        hasAttachments: false, // Would be determined from actual email data
        responseTime: new Date().toISOString()
      }
    };
  }

  generateAIResponse(email: Email): string {
    const { sentiment, priority, extractedInfo } = email;
    
    let response = '';
    
    // Greeting based on sentiment
    if (sentiment === 'negative') {
      response += "Thank you for reaching out, and I sincerely apologize for any inconvenience you've experienced. ";
    } else if (sentiment === 'positive') {
      response += "Thank you for your message! I'm delighted to assist you. ";
    } else {
      response += "Thank you for contacting our support team. I'm here to help you. ";
    }

    // Priority acknowledgment
    if (priority === 'urgent') {
      response += "I understand this is urgent, and I'm prioritizing your request. ";
    }

    // Context-aware content based on subject and requirements
    const subject = email.subject.toLowerCase();
    if (subject.includes('login') || subject.includes('access')) {
      response += "Regarding your login/access issue, I'll help you resolve this immediately. Please verify your email address and try resetting your password using the 'Forgot Password' link. ";
    } else if (subject.includes('billing') || subject.includes('payment')) {
      response += "I'll review your billing concern right away. Our billing team will investigate any discrepancies and ensure accurate charges. ";
    } else if (subject.includes('integration') || subject.includes('api')) {
      response += "For API integration questions, I'll connect you with our technical team who can provide detailed documentation and implementation guidance. ";
    } else if (subject.includes('pricing')) {
      response += "I'd be happy to explain our pricing structure and help you find the plan that best fits your needs. ";
    } else {
      response += "I've reviewed your request and will ensure you receive the appropriate assistance. ";
    }

    // Empathetic closing based on sentiment
    if (sentiment === 'negative') {
      response += "I truly appreciate your patience, and we're committed to making this right. ";
    }

    response += "I'll follow up within 24 hours with a detailed resolution. If you need immediate assistance, please don't hesitate to reach out.\n\nBest regards,\nCustomer Support Team";

    return response;
  }

  processEmail(rawEmail: any): Email {
    const extractedInfo = this.extractInformation(rawEmail);
    const sentiment = this.analyzeSentiment(`${rawEmail.subject} ${rawEmail.body}`);
    const priority = this.determinePriority(`${rawEmail.subject} ${rawEmail.body}`);
    
    const email: Email = {
      id: rawEmail.id || Math.random().toString(36).substr(2, 9),
      sender: rawEmail.sender,
      subject: rawEmail.subject,
      body: rawEmail.body,
      sentDate: rawEmail.sent_date,
      priority,
      sentiment,
      category: this.categorizeEmail(rawEmail.subject),
      status: 'pending',
      extractedInfo,
      responseGenerated: false
    };

    email.aiResponse = this.generateAIResponse(email);
    email.responseGenerated = true;

    return email;
  }

  private categorizeEmail(subject: string): string {
    const lowerSubject = subject.toLowerCase();
    if (lowerSubject.includes('billing') || lowerSubject.includes('payment')) return 'Billing';
    if (lowerSubject.includes('login') || lowerSubject.includes('access')) return 'Account Access';
    if (lowerSubject.includes('integration') || lowerSubject.includes('api')) return 'Technical';
    if (lowerSubject.includes('pricing')) return 'Sales';
    if (lowerSubject.includes('refund')) return 'Refund';
    return 'General Support';
  }
}