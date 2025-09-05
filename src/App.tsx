import React, { useState, useEffect, useMemo } from 'react';
import { Email, EmailStats } from './types/email';
import { EmailProcessor } from './services/emailProcessor';
import { CSVEmailLoader } from './services/csvEmailLoader';
import { EmailCard } from './components/EmailCard';
import { EmailStats as EmailStatsComponent } from './components/EmailStats';
import { ResponseModal } from './components/ResponseModal';
import { FilterControls } from './components/FilterControls';
import { Mail, Bot, RefreshCw, Zap } from 'lucide-react';

function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'urgent' | 'normal'>('all');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  const emailProcessor = new EmailProcessor();
  const csvLoader = new CSVEmailLoader();

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const rawEmails = await csvLoader.loadEmailsFromCSV();
      const supportEmails = emailProcessor.filterSupportEmails(rawEmails);
      const processedEmails = supportEmails.map(email => emailProcessor.processEmail(email));
      
      // Sort by priority (urgent first) and then by date
      const sortedEmails = processedEmails.sort((a, b) => {
        if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
        if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
        return new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime();
      });

      setEmails(sortedEmails);
    } catch (error) {
      console.error('Error loading emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmails = useMemo(() => {
    return emails.filter(email => {
      const matchesSearch = searchTerm === '' || 
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.body.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority = priorityFilter === 'all' || email.priority === priorityFilter;
      const matchesSentiment = sentimentFilter === 'all' || email.sentiment === sentimentFilter;
      const matchesStatus = statusFilter === 'all' || email.status === statusFilter;

      return matchesSearch && matchesPriority && matchesSentiment && matchesStatus;
    });
  }, [emails, searchTerm, priorityFilter, sentimentFilter, statusFilter]);

  const stats: EmailStats = useMemo(() => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const emailsLast24h = emails.filter(email => 
      new Date(email.sentDate) >= yesterday
    ).length;

    return {
      totalEmails: emails.length,
      emailsLast24h,
      emailsResolved: emails.filter(e => e.status === 'resolved').length,
      emailsPending: emails.filter(e => e.status === 'pending').length,
      sentimentBreakdown: {
        positive: emails.filter(e => e.sentiment === 'positive').length,
        negative: emails.filter(e => e.sentiment === 'negative').length,
        neutral: emails.filter(e => e.sentiment === 'neutral').length,
      },
      priorityBreakdown: {
        urgent: emails.filter(e => e.priority === 'urgent').length,
        normal: emails.filter(e => e.priority === 'normal').length,
      }
    };
  }, [emails]);

  const handleStatusChange = (id: string, status: 'pending' | 'resolved') => {
    setEmails(prev => prev.map(email => 
      email.id === id ? { ...email, status } : email
    ));
  };

  const handleViewResponse = (email: Email) => {
    setSelectedEmail(email);
    setIsModalOpen(true);
  };

  const handleSendResponse = (emailId: string, response: string) => {
    // In a real application, this would send the email
    console.log('Sending response for email:', emailId, response);
    handleStatusChange(emailId, 'resolved');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading and processing emails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Communication Assistant</h1>
                <p className="text-gray-600">Intelligent email management and response generation</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>{emails.filter(e => e.priority === 'urgent').length} urgent emails</span>
              </div>
              <button
                onClick={loadEmails}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="mb-8">
          <EmailStatsComponent stats={stats} />
        </div>

        {/* Filter Controls */}
        <FilterControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          sentimentFilter={sentimentFilter}
          onSentimentFilterChange={setSentimentFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Email List */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Support Emails ({filteredEmails.length})
            </h2>
          </div>

          {filteredEmails.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
              <p className="text-gray-600">
                {emails.length === 0 
                  ? "No support emails to display." 
                  : "Try adjusting your filters to see more results."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEmails.map(email => (
                <EmailCard
                  key={email.id}
                  email={email}
                  onStatusChange={handleStatusChange}
                  onViewResponse={handleViewResponse}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Response Modal */}
      <ResponseModal
        email={selectedEmail}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSendResponse={handleSendResponse}
      />
    </div>
  );
}

export default App;