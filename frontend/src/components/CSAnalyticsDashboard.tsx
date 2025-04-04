import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDown, ArrowUp, Minus, Filter } from 'lucide-react';

// Interfaces for our data types
interface AgentRatingData {
    agentId: string;
    agentName: string;
    averageRating: number;
    moodChanges: {
    positive: number;
    neutral: number;
    negative: number;
    };
    totalInteractions: number;
    ratingDistribution: number[]; // Index corresponds to rating (1-5)
}

interface CSAnalyticsDashboardProps {
    agentData?: AgentRatingData[];
    timeframe?: string;
}

const CSAnalyticsDashboard = ({ 
    agentData = [], 
    timeframe = "Last 30 days" 
}: CSAnalyticsDashboardProps) => {
    const [selectedMetric, setSelectedMetric] = useState<'rating' | 'mood'>('rating');
    const [sortBy, setSortBy] = useState<'name' | 'rating' | 'interactions'>('rating');

  // Use empty array as fallback to ensure agentData is always iterable
    const safeAgentData = Array.isArray(agentData) ? agentData : [];

  // Sort the data based on the current sort selection
    const sortedData = [...safeAgentData].sort((a, b) => {
    if (sortBy === 'name') return a.agentName.localeCompare(b.agentName);
    if (sortBy === 'rating') return b.averageRating - a.averageRating;
    if (sortBy === 'interactions') return b.totalInteractions - a.totalInteractions;
    return 0;
    });

  // Prepare data for the rating distribution chart
    const ratingDistributionData = sortedData.map(agent => {
    const data: any = { name: agent.agentName };
    for (let i = 1; i <= 5; i++) {
        data[`rating${i}`] = agent.ratingDistribution[i-1] || 0;
    }
    return data;
    });

  // Prepare data for the mood change chart
    const moodChangeData = sortedData.map(agent => {
    return {
        name: agent.agentName,
        positive: agent.moodChanges.positive,
        neutral: agent.moodChanges.neutral,
        negative: agent.moodChanges.negative
    };
    });

  // Calculate team-wide averages
    const teamAverageRating = sortedData.length ? 
    sortedData.reduce((sum, agent) => sum + agent.averageRating, 0) / sortedData.length : 0;

    const totalMoodChanges = sortedData.reduce((total, agent) => {
    return {
        positive: total.positive + agent.moodChanges.positive,
        neutral: total.neutral + agent.moodChanges.neutral,
        negative: total.negative + agent.moodChanges.negative
    };
    }, { positive: 0, neutral: 0, negative: 0 });

    const totalInteractions = sortedData.reduce((sum, agent) => sum + agent.totalInteractions, 0);
    const positiveRatio = totalInteractions ? totalMoodChanges.positive / totalInteractions : 0;
    const negativeRatio = totalInteractions ? totalMoodChanges.negative / totalInteractions : 0;

  // Sample data for demonstration when no data is provided
    const sampleData = sortedData.length === 0 ? [
    {
        agentId: "sample1",
        agentName: "Alex Smith",
        averageRating: 4.2,
        moodChanges: { positive: 42, neutral: 30, negative: 8 },
        totalInteractions: 80,
        ratingDistribution: [2, 5, 15, 38, 20]
    },
    {
        agentId: "sample2",
        agentName: "Jamie Lee",
        averageRating: 3.8,
        moodChanges: { positive: 35, neutral: 42, negative: 13 },
        totalInteractions: 90,
        ratingDistribution: [5, 10, 20, 30, 25]
    },
    {
        agentId: "sample3",
        agentName: "Chris Wong",
        averageRating: 4.5,
        moodChanges: { positive: 55, neutral: 25, negative: 5 },
        totalInteractions: 85,
        ratingDistribution: [1, 3, 10, 30, 41]
    }
    ] : [];

  // Use sample data if no real data is provided
    const displayData = sortedData.length ? sortedData : sampleData;
    const displayRatingData = sortedData.length ? ratingDistributionData : sampleData.map(agent => {
    const data: any = { name: agent.agentName };
    for (let i = 1; i <= 5; i++) {
        data[`rating${i}`] = agent.ratingDistribution[i-1] || 0;
    }
    return data;
    });
    const displayMoodData = sortedData.length ? moodChangeData : sampleData.map(agent => ({
    name: agent.agentName,
    positive: agent.moodChanges.positive,
    neutral: agent.moodChanges.neutral,
    negative: agent.moodChanges.negative
    }));

    return (
    <div className="bg-white rounded-lg shadow p-6 max-w-6xl w-full">
        <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Customer Service Performance Analytics</h2>
        <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{timeframe}</span>
            <div className="flex items-center border rounded p-2 bg-gray-50">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <select 
                className="bg-transparent text-sm border-none focus:outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
            >
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
                <option value="interactions">Sort by Volume</option>
            </select>
            </div>
        </div>
        </div>

      {/* Summary Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Team Average Rating</p>
            <div className="flex items-center">
            <p className="text-2xl font-bold">{sortedData.length ? teamAverageRating.toFixed(2) : "4.2"}</p>
            <p className="text-sm ml-2 text-gray-500">/ 5.0</p>
            </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Positive Mood Impact</p>
            <div className="flex items-center">
            <p className="text-2xl font-bold text-green-600">
              {sortedData.length ? (positiveRatio * 100).toFixed(1) : "50.0"}%
            </p>
            <ArrowUp className="ml-2 h-5 w-5 text-green-600" />
            </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Negative Mood Impact</p>
            <div className="flex items-center">
            <p className="text-2xl font-bold text-red-600">
              {sortedData.length ? (negativeRatio * 100).toFixed(1) : "10.0"}%
            </p>
            <ArrowDown className="ml-2 h-5 w-5 text-red-600" />
            </div>
        </div>
        </div>

      {/* Chart Toggle */}
        <div className="flex space-x-4 mb-4">
        <button 
            className={`px-4 py-2 rounded-md text-sm ${selectedMetric === 'rating' ? 
            'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setSelectedMetric('rating')}
        >
            Rating Distribution
        </button>
        <button 
            className={`px-4 py-2 rounded-md text-sm ${selectedMetric === 'mood' ? 
            'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setSelectedMetric('mood')}
        >
            Mood Change Impact
        </button>
        </div>

      {/* Main Chart */}
        <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
            {selectedMetric === 'rating' ? (
            <BarChart data={displayRatingData} barGap={2} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rating1" name="1 Star" fill="#f87171" />
                <Bar dataKey="rating2" name="2 Stars" fill="#fbbf24" />
                <Bar dataKey="rating3" name="3 Stars" fill="#a3e635" />
                <Bar dataKey="rating4" name="4 Stars" fill="#34d399" />
                <Bar dataKey="rating5" name="5 Stars" fill="#0ea5e9" />
            </BarChart>
            ) : (
            <BarChart data={displayMoodData} barGap={2} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="positive" name="Positive" fill="#34d399" />
                <Bar dataKey="neutral" name="Neutral" fill="#9ca3af" />
                <Bar dataKey="negative" name="Negative" fill="#f87171" />
            </BarChart>
            )}
        </ResponsiveContainer>
        </div>

      {/* Agent Performance Table */}
        <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Agent Performance Details</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interactions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mood Impact</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {displayData.map((agent) => {
                const positivePercentage = agent.totalInteractions ? 
                  (agent.moodChanges.positive / agent.totalInteractions * 100).toFixed(1) : '0.0';
                const negativePercentage = agent.totalInteractions ? 
                  (agent.moodChanges.negative / agent.totalInteractions * 100).toFixed(1) : '0.0';
                
                return (
                    <tr key={agent.agentId}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{agent.agentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                        <span className="font-medium">{agent.averageRating.toFixed(2)}</span>
                        <span className="ml-2 text-sm text-gray-500">/5</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.totalInteractions}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                            <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                            <span>{positivePercentage}%</span>
                        </div>
                        <div className="flex items-center">
                            <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
                            <span>{negativePercentage}%</span>
                        </div>
                        </div>
                    </td>
                    </tr>
                );
                })}
            </tbody>
            </table>
        </div>
        </div>
    </div>
    );
};

export default CSAnalyticsDashboard;
