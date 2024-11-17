import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { format, addDays, setHours, setMinutes, startOfWeek, addWeeks } from 'date-fns';

type Props = {
  onComplete: () => void;
  onBack: () => void;
  updateData: (data: { kickoffDate: Date; presentationDate: Date }) => void;
};

type TimeSlot = {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
};

const timeSlots: TimeSlot[] = [
  { hour: 9, minute: 0, period: 'AM' },
  { hour: 10, minute: 0, period: 'AM' },
  { hour: 11, minute: 0, period: 'AM' },
  { hour: 1, minute: 0, period: 'PM' },
  { hour: 2, minute: 0, period: 'PM' },
  { hour: 3, minute: 0, period: 'PM' },
  { hour: 4, minute: 0, period: 'PM' }
];

export default function BookMeeting({ onComplete, onBack, updateData }: Props) {
  const [selectedKickoffDate, setSelectedKickoffDate] = useState<Date | null>(null);
  const [selectedKickoffTime, setSelectedKickoffTime] = useState<TimeSlot | null>(null);
  const [selectedPresentationDate, setSelectedPresentationDate] = useState<Date | null>(null);
  const [selectedPresentationTime, setSelectedPresentationTime] = useState<TimeSlot | null>(null);
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [step, setStep] = useState<'kickoff' | 'presentation'>('kickoff');
  const [showCalendar, setShowCalendar] = useState(false);

  // Pre-select dates and times for quick demo
  useEffect(() => {
    const tomorrow = addDays(new Date(), 1);
    const nextWeek = addDays(new Date(), 8);
    
    setSelectedKickoffDate(tomorrow);
    setSelectedKickoffTime({ hour: 10, minute: 0, period: 'AM' });
    setSelectedPresentationDate(nextWeek);
    setSelectedPresentationTime({ hour: 2, minute: 0, period: 'PM' });
  }, []);

  const generateWeekDays = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(startDate, i));
    }
    return days;
  };

  const handleDateSelection = (date: Date) => {
    if (step === 'kickoff') {
      setSelectedKickoffDate(date);
    } else {
      setSelectedPresentationDate(date);
    }
  };

  const handleTimeSelection = (time: TimeSlot) => {
    if (step === 'kickoff') {
      setSelectedKickoffTime(time);
    } else {
      setSelectedPresentationTime(time);
    }
  };

  const handleConfirm = () => {
    if (selectedKickoffDate && selectedKickoffTime && selectedPresentationDate && selectedPresentationTime) {
      const kickoffDateTime = setMinutes(
        setHours(selectedKickoffDate, selectedKickoffTime.hour + (selectedKickoffTime.period === 'PM' ? 12 : 0)),
        selectedKickoffTime.minute
      );
      
      const presentationDateTime = setMinutes(
        setHours(selectedPresentationDate, selectedPresentationTime.hour + (selectedPresentationTime.period === 'PM' ? 12 : 0)),
        selectedPresentationTime.minute
      );

      updateData({
        kickoffDate: kickoffDateTime,
        presentationDate: presentationDateTime
      });
      onComplete();
    }
  };

  const renderCalendar = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentWeek(addWeeks(currentWeek, -1))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="font-medium">
          {format(currentWeek, 'MMMM yyyy')}
        </span>
        <button
          onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {generateWeekDays(currentWeek).map((date, index) => (
          <button
            key={index}
            onClick={() => handleDateSelection(date)}
            className={`p-2 rounded-lg text-center transition ${
              (step === 'kickoff' ? selectedKickoffDate : selectedPresentationDate)?.toDateString() === date.toDateString()
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {format(date, 'd')}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="font-medium mb-3">Available Times</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {timeSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => handleTimeSelection(slot)}
              className={`p-2 rounded-lg text-center text-sm transition ${
                (step === 'kickoff' ? selectedKickoffTime : selectedPresentationTime)?.hour === slot.hour
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 hover:border-blue-500'
              }`}
            >
              {`${slot.hour}:${slot.minute.toString().padStart(2, '0')} ${slot.period}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Your Meetings Are Pre-Scheduled</h2>
          <p className="text-gray-600 mb-4">
            We've selected optimal times for your meetings. You can proceed with these times or adjust them to your preference.
          </p>
        </div>

        {showCalendar ? (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold mb-4">
                {step === 'kickoff' ? 'Select Kickoff Meeting Time' : 'Select Presentation Meeting Time'}
              </h3>
              {renderCalendar()}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowCalendar(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Back to Summary
              </button>
              <button
                onClick={() => {
                  if (step === 'kickoff' && selectedKickoffDate && selectedKickoffTime) {
                    setStep('presentation');
                  } else if (step === 'presentation' && selectedPresentationDate && selectedPresentationTime) {
                    setShowCalendar(false);
                  }
                }}
                disabled={!selectedKickoffDate || !selectedKickoffTime || (step === 'presentation' && (!selectedPresentationDate || !selectedPresentationTime))}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {step === 'kickoff' ? 'Next: Schedule Presentation' : 'Confirm Times'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-8">
                {/* Kickoff Meeting */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold flex items-center mb-4">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Kickoff Meeting
                  </h3>
                  <div className="text-lg">
                    <p className="mb-2">
                      {selectedKickoffDate && format(selectedKickoffDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-blue-600 font-medium">
                      {selectedKickoffTime && `${selectedKickoffTime.hour}:${selectedKickoffTime.minute.toString().padStart(2, '0')} ${selectedKickoffTime.period}`} (60 minutes)
                    </p>
                  </div>
                </div>

                {/* Presentation Meeting */}
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold flex items-center mb-4">
                    <Calendar className="h-5 w-5 mr-2 text-green-600" />
                    Results Presentation
                  </h3>
                  <div className="text-lg">
                    <p className="mb-2">
                      {selectedPresentationDate && format(selectedPresentationDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-green-600 font-medium">
                      {selectedPresentationTime && `${selectedPresentationTime.hour}:${selectedPresentationTime.minute.toString().padStart(2, '0')} ${selectedPresentationTime.period}`} (90 minutes)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowCalendar(true)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Adjust Times
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedKickoffDate || !selectedKickoffTime || !selectedPresentationDate || !selectedPresentationTime}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                Confirm Meetings
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}