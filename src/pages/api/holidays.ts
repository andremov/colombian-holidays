export default function handler(req, res) {
  const holidays = [
    { date: '2023-01-01', name: 'Año Nuevo' },
    { date: '2023-01-09', name: 'Día de los Reyes Magos' },
    { date: '2023-03-20', name: 'Día de San José' },
    { date: '2023-04-06', name: 'Jueves Santo' },
    { date: '2023-04-07', name: 'Viernes Santo' },
    { date: '2023-05-01', name: 'Día del Trabajo' },
    { date: '2023-05-22', name: 'Día de la Ascensión' },
    { date: '2023-06-12', name: 'Día del Sagrado Corazón' },
    { date: '2023-06-19', name: 'Día de la Independencia' },
    { date: '2023-07-20', name: 'Día de la Batalla de Boyacá' },
    { date: '2023-08-07', name: 'Día de la Independencia' },
    { date: '2023-08-21', name: 'Día de la Asunción' },
    { date: '2023-10-16', name: 'Día de la Raza' },
    { date: '2023-11-06', name: 'Día de Todos los Santos' },
    { date: '2023-11-13', name: 'Independencia de Cartagena' },
    { date: '2023-12-08', name: 'Inmaculada Concepción' },
    { date: '2023-12-25', name: 'Navidad' },
  ];

  res.status(200).json(holidays);
}