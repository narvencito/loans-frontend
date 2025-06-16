// @ts-ignore
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

const steps = [
  {
    id: '1',
    message: '¡Hola! ¿Para qué necesitas el equipo?',
    trigger: '2',
  },
  {
    id: '2',
    options: [
      { value: 'estudio', label: 'Estudiar', trigger: '3-estudio' },
      { value: 'trabajo', label: 'Trabajar', trigger: '3-trabajo' },
      { value: 'juegos', label: 'Jugar', trigger: '3-juegos' },
    ],
  },
  {
    id: '3-estudio',
    message: '¿Prefieres que sea liviano y portátil?',
    trigger: 'estudio-portabilidad',
  },
  {
    id: 'estudio-portabilidad',
    options: [
      { value: 'sí', label: 'Sí', trigger: 'recomendacion-ultraliviana' },
      { value: 'no', label: 'No', trigger: 'recomendacion-potente' },
    ],
  },
  {
    id: 'recomendacion-ultraliviana',
    message: 'Te recomiendo una laptop tipo Chromebook o Ultrabook.',
    end: true,
  },
  {
    id: 'recomendacion-potente',
    message: 'Busca una laptop con buen procesador (i5/i7) y 8GB de RAM.',
    end: true,
  },
  {
    id: '3-trabajo',
    message: '¿Usarás programas pesados como AutoCAD o Adobe?',
    trigger: 'trabajo-potencia',
  },
  {
    id: 'trabajo-potencia',
    options: [
      { value: 'sí', label: 'Sí', trigger: 'trabajo-pro' },
      { value: 'no', label: 'No', trigger: 'trabajo-basico' },
    ],
  },
  {
    id: 'trabajo-pro',
    message: 'Te recomiendo una laptop con GPU dedicada y 16GB de RAM.',
    end: true,
  },
  {
    id: 'trabajo-basico',
    message: 'Con una laptop con SSD y procesador básico tendrás suficiente.',
    end: true,
  },
  {
    id: '3-juegos',
    message: '¿Te interesan juegos exigentes como FIFA o Call of Duty?',
    trigger: 'juegos-potencia',
  },
  {
    id: 'juegos-potencia',
    options: [
      { value: 'sí', label: 'Sí', trigger: 'gamer-pro' },
      { value: 'no', label: 'No', trigger: 'gamer-liviano' },
    ],
  },
  {
    id: 'gamer-pro',
    message: 'Busca una laptop gamer con tarjeta RTX y buen enfriamiento.',
    end: true,
  },
  {
    id: 'gamer-liviano',
    message: 'Una laptop con GPU integrada puede bastar para juegos casuales.',
    end: true,
  },
];

const theme = {
  background: '#f9fafb',
  fontFamily: 'Arial',
  headerBgColor: '#1E3A8A', 
  headerFontColor: '#ffffff',
  headerFontSize: '16px',
  botBubbleColor: '#1E3A8A', 
  botFontColor: '#ffffff',
  userBubbleColor: '#FACC15',
  userFontColor: '#1E3A8A',
};

export default function EquipmentChatBot() {
  return (
    <ThemeProvider theme={theme}>
      <ChatBot
        steps={steps}
        floating={true}
        headerTitle="Asistente de equipos"
        recognitionEnable={true}
      />
    </ThemeProvider>
  );
}
