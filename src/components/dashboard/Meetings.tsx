import React from 'react';
import { Calendar, Clock, Video, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Meetings() {
  const meetings = [
    {
      type: 'Kickoff Meeting',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      duration: '60 min',
      status: 'upcoming'
    },
    {
      type: 'Results Presentation',
      date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      duration: '90 min',
      status: 'upcoming'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Meetings</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Schedule Meeting</span>
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700">
        {meetings.map((meeting, index) => (
          <div key={index} className={`p-6 ${index !== meetings.length - 1 ? 'border-b border-gray-700' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-gray-100">{meeting.type}</h3>
                <div className="flex items-center space-x-4 text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(meeting.date, 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{format(meeting.date, 'h:mm a')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{meeting.duration}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-blue-400 hover:bg-gray-800 rounded-lg transition">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg transition">
                  <Edit2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="font-semibold mb-4 text-gray-100">Meeting Guidelines</h2>
        <ul className="space-y-2 text-gray-400">
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Meetings are conducted via Google Meet</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>You'll receive calendar invites with meeting links</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Reschedule at least 24 hours in advance</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
