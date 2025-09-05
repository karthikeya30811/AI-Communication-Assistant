import React from 'react';
import { EmailStats as EmailStatsType } from '../types/email';
import { Mail, Clock, CheckCircle, AlertCircle, TrendingUp, Smile, Frown, Minus } from 'lucide-react';

interface EmailStatsProps {
  stats: EmailStatsType;
}

export const EmailStats: React.FC<EmailStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Emails',
      value: stats.totalEmails,
      icon: Mail,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Last 24 Hours',
      value: stats.emailsLast24h,
      icon: Clock,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Resolved',
      value: stats.emailsResolved,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending',
      value: stats.emailsPending,
      icon: AlertCircle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Sentiment Analysis</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Positive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(stats.sentimentBreakdown.positive / stats.totalEmails) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-green-600">{stats.sentimentBreakdown.positive}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Frown className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-gray-700">Negative</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(stats.sentimentBreakdown.negative / stats.totalEmails) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-red-600">{stats.sentimentBreakdown.negative}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Minus className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Neutral</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-500 h-2 rounded-full" 
                    style={{ width: `${(stats.sentimentBreakdown.neutral / stats.totalEmails) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-600">{stats.sentimentBreakdown.neutral}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Priority Distribution</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Urgent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(stats.priorityBreakdown.urgent / stats.totalEmails) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-red-600">{stats.priorityBreakdown.urgent}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Normal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(stats.priorityBreakdown.normal / stats.totalEmails) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-blue-600">{stats.priorityBreakdown.normal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};