
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Equipment {
  id: string;
  name: string;
  imageUrl?: string;
  description: string;
}

export default function RecomendacionEquipos(props: any) {
  const [equipos, setEquipos] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const steps = props.steps;
    const motivo = steps['2'].value;

    let matchKey = '';

    if (motivo === 'estudio') {
      matchKey = steps['estudio-portabilidad'].value === 'sí' ? 'ultraliviano' : 'estudio-potente';
    } else if (motivo === 'trabajo') {
      matchKey = steps['trabajo-potencia'].value === 'sí' ? 'work-pro' : 'work-basic';
    } else if (motivo === 'juegos') {
      matchKey = steps['juegos-potencia'].value === 'sí' ? 'gamer-pro' : 'gamer-lite';
    }

    axios
      .get(`/api/equipment?match=${matchKey}`)
      .then((res) => setEquipos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [props.steps]);

  if (loading) return <div>Cargando recomendaciones...</div>;

  return (
    <div className="space-y-2">
      <strong>Equipos recomendados:</strong>
      {equipos.length === 0 ? (
        <p>No se encontraron equipos con esas características.</p>
      ) : (
        equipos.map((item) => (
          <div key={item.id} className="border rounded p-2">
            <div className="font-bold">{item.name}</div>
            {item.description && <div className="text-sm text-gray-600">{item.description}</div>}
          </div>
        ))
      )}
    </div>
  );
}