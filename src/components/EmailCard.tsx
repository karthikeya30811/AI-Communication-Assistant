import React from 'react';
import { Email } from '../types/email';
import { Clock, User, AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';

interface EmailCardProps {
  email: Email;
  onStatusChange: (id: string, status: 'pending' | 'resolved') => void;
  onViewResponse: (email: Email) => void;
}

export const EmailCard: React.FC<EmailCardProps> = ({ email, onStatusChange, onViewResponse }) => {
  const priorityColor = email.priority === 'urgent' ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50';
  const sentimentColor = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  }[email.sentiment];

  const statusColor = email.status === 'resolved' ? 'text-green-600' : 'text-orange-600';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{email.sender}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColor}`}>
              {email.priority === 'urgent' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
              {email.priority.toUpperCase()}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{email.subject}</h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">{email.body}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${sentimentColor}`}>
          {email.sentiment.toUpperCase()}
        </span>
        <span className="px-2 py-1 rounded-full text-xs font-medium text-purple-600 bg-purple-50">
          {email.category}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor} bg-opacity-10`}>
          {email.status === 'resolved' && <CheckCircle className="w-3 h-3 inline mr-1" />}
          {email.status.toUpperCase()}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{new Date(email.sentDate).toLocaleString()}</span>
        </div>
      </div>

      {email.extractedInfo.requirements.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Requirements:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {email.extractedInfo.requirements.slice(0, 2).map((req, index) => (
              <li key={index} className="truncate">• {req}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onViewResponse(email)}
          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          <MessageSquare className="w-4 h-4" />
          View AI Response
        </button>
        <button
          onClick={() => onStatusChange(email.id, email.status === 'pending' ? 'resolved' : 'pending')}
          className={`px-3 py-2 rounded-md transition-colors text-sm ${
            email.status === 'pending'
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          {email.status === 'pending' ? 'Mark Resolved' : 'Mark Pending'}
        </button>
      </div>
    </div>
  );
};