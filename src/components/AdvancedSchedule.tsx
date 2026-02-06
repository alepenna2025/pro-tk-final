'use client';

import { useState } from 'react';

interface AdvancedScheduleProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
  contentType: 'image' | 'video';
}

const DAYS = [
  { id: 0, name: 'Domingo', short: 'Dom' },
  { id: 1, name: 'Segunda', short: 'Seg' },
  { id: 2, name: 'Terça', short: 'Ter' },
  { id: 3, name: 'Quarta', short: 'Qua' },
  { id: 4, name: 'Quinta', short: 'Qui' },
  { id: 5, name: 'Sexta', short: 'Sex' },
  { id: 6, name: 'Sábado', short: 'Sáb' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function AdvancedSchedule({ selectedTime, onTimeChange, contentType }: AdvancedScheduleProps) {
  const [scheduleMode, setScheduleMode] = useState<'now' | 'custom' | 'weekly'>('now');
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedHour, setSelectedHour] = useState(9);
  const [customDateTime, setCustomDateTime] = useState(selectedTime);

  const handleWeeklySchedule = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const daysUntil = (selectedDay - currentDay + 7) % 7;
    const scheduledDate = new Date(now);
    scheduledDate.setDate(scheduledDate.getDate() + daysUntil);
    scheduledDate.setHours(selectedHour, 0, 0, 0);
    
    const isoString = scheduledDate.toISOString().slice(0, 16);
    onTimeChange(isoString);
  };

  const handleCustomDateTime = (dateTime: string) => {
    setCustomDateTime(dateTime);
    onTimeChange(dateTime);
  };

  return (
    <section className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 space-y-4">
      <label className="block text-white font-semibold flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Agendamento Avançado
      </label>

      <div className="space-y-4">
        {/* Schedule Mode Selection */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setScheduleMode('now')}
            className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
              scheduleMode === 'now'
                ? 'border-purple-400 bg-purple-500/20 text-white'
                : 'border-white/30 bg-white/10 text-white/70 hover:bg-white/15'
            }`}
          >
            Publicar Já
          </button>
          <button
            onClick={() => setScheduleMode('weekly')}
            className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
              scheduleMode === 'weekly'
                ? 'border-purple-400 bg-purple-500/20 text-white'
                : 'border-white/30 bg-white/10 text-white/70 hover:bg-white/15'
            }`}
          >
            Agendar Semana
          </button>
          <button
            onClick={() => setScheduleMode('custom')}
            className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
              scheduleMode === 'custom'
                ? 'border-purple-400 bg-purple-500/20 text-white'
                : 'border-white/30 bg-white/10 text-white/70 hover:bg-white/15'
            }`}
          >
            Data/Hora Customizada
          </button>
        </div>

        {/* Weekly Schedule */}
        {scheduleMode === 'weekly' && (
          <div className="space-y-4 p-4 bg-white/10 rounded-xl border border-white/20">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Selecione o Dia</label>
              <div className="grid grid-cols-4 gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDay(day.id)}
                    className={`p-2 rounded-lg border-2 transition-all text-xs font-medium ${
                      selectedDay === day.id
                        ? 'border-purple-400 bg-purple-500/20 text-white'
                        : 'border-white/30 bg-white/10 text-white/70 hover:bg-white/15'
                    }`}
                  >
                    {day.short}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Horário ({selectedHour}:00)</label>
              <input
                type="range"
                min="0"
                max="23"
                value={selectedHour}
                onChange={(e) => setSelectedHour(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="grid grid-cols-6 gap-1 mt-2">
                {HOURS.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => setSelectedHour(hour)}
                    className={`p-1 text-xs rounded transition-all ${
                      selectedHour === hour
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {hour}h
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleWeeklySchedule}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all text-sm"
            >
              Agendar para {DAYS[selectedDay].name} às {selectedHour}:00
            </button>
          </div>
        )}

        {/* Custom Schedule */}
        {scheduleMode === 'custom' && (
          <div className="space-y-3 p-4 bg-white/10 rounded-xl border border-white/20">
            <label className="block text-white text-sm font-medium">Data e Hora Customizada</label>
            <input
              type="datetime-local"
              className="w-full p-3 border-2 border-white/30 rounded-lg bg-white/10 backdrop-blur-sm text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition"
              value={customDateTime}
              onChange={(e) => handleCustomDateTime(e.target.value)}
            />
          </div>
        )}

        {scheduleMode === 'now' && (
          <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-xl">
            <p className="text-white text-sm font-medium">✓ {contentType === 'image' ? 'Imagem' : 'Vídeo'} será publicado imediatamente após confirmação</p>
          </div>
        )}

        {scheduleMode !== 'now' && selectedTime && (
          <div className="p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl">
            <p className="text-white text-sm">
              <span className="font-medium">Agendado para:</span> {new Date(selectedTime).toLocaleString('pt-BR')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
