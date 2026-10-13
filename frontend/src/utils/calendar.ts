/**
 * Generates and triggers download of a standardized RFC 5545 iCalendar (.ics) file.
 */
export function downloadIcsCalendarEvent(
  title: string,
  description: string,
  location: string,
  startTime?: Date,
  endTime?: Date
) {
  const start = startTime || new Date(Date.now() + 3600 * 1000 * 2);
  const end = endTime || new Date(start.getTime() + 3600 * 1000 * 1.5);

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cadence Campus Pulse//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:cadence-${Date.now()}@campus.edu`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:${title.replace(/\n/g, ' ')}`,
    `DESCRIPTION:${description.replace(/\n/g, ' ')}`,
    `LOCATION:${location.replace(/\n/g, ' ')}`,
    'STATUS:CONFIRMED',
    'CLASS:PUBLIC',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: ' + title,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  const safeFilename = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().substring(0, 30);
  link.setAttribute('download', `${safeFilename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
