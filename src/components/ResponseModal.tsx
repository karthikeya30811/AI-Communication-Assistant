import React, { useState } from 'react';
import { Email } from '../types/email';
import { X, Send, Edit3, Copy, Check } from 'lucide-react';

interface ResponseModalProps {
  email: Email | null;
  isOpen: boolean;
  onClose: () => void;
  onSendResponse: (emailId: string, response: string) => void;
}

export const ResponseModal: React.FC<ResponseModalProps> = ({ 
  email, 
  isOpen, 
  onClose, 
  onSendResponse 
}) => {
  const [response, setResponse] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (email?.aiResponse) {
      setResponse(email.aiResponse);
      setIsEditing(false);
    }
  }, [email]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    if (email) {
      onSendResponse(email.id, response);
      onClose();
    }
  };

  if (!isOpen || !email) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">AI Generated Response</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Original Email */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Original Email</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>From:</strong> {email.sender}</p>
              <p><strong>Subject:</strong> {email.subject}</p>
              <p><strong>Priority:</strong> 
                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                  email.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {email.priority.toUpperCase()}
                </span>
              </p>
              <p><strong>Sentiment:</strong> 
                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                  email.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                  email.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {email.sentiment.toUpperCase()}
                </span>
              </p>
            </div>
            <div className="mt-3 p-3 bg-white rounded border">
              <p className="text-sm text-gray-700">{email.body}</p>
            </div>
          </div>

          {/* AI Response */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">AI Generated Response</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  {isEditing ? 'Preview' : 'Edit'}
                </button>
              </div>
            </div>

            {isEditing ? (
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Edit the AI response..."
              />
            ) : (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {response}
                </pre>
              </div>
            )}
          </div>

          {/* Extracted Information */}
          {email.extractedInfo.requirements.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Extracted Key Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {email.extractedInfo.requirements.length > 0 && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">Requirements</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {email.extractedInfo.requirements.map((req, index) => (
                        <li key={index} className="truncate">• {req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {email.extractedInfo.sentimentIndicators.length > 0 && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-800 mb-2">Sentiment Indicators</h4>
                    <div className="flex flex-wrap gap-1">
                      {email.extractedInfo.sentimentIndicators.map((indicator, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          {indicator}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="w-4 h-4" />
            Send Response
          </button>
        </div>
      </div>
    </div>
  );
};