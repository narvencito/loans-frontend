import React, { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { EquipmentFeature, equipmentFeatureApi } from '@/features/equipment-feature/api/equipment-feature-api';

interface Props {
  selected: string[];
  onChange: (ids: string[]) => void;
}

const EquipmentFeatureSelectCheckboxList = ({ selected, onChange }: Props) => {
  const [features, setFeatures] = useState<EquipmentFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await equipmentFeatureApi.getAllActive();
      setFeatures(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleToggle = (id: string) => {
    console.log("id de los features en el componente",id);
    if (selected.includes(id)) {
      onChange(selected.filter((fid) => fid !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Cargando características...</p>;

  return (
    <div className="flex flex-wrap gap-3">
      {features.map((feature) => (
        <label key={feature.id} className="flex items-center gap-2">
          <Checkbox
            checked={selected.includes(feature.id)}
            onCheckedChange={() => handleToggle(feature.id)}
          />
          <span className="text-sm">{feature.name}</span>
        </label>
      ))}
    </div>
  );
};

export default EquipmentFeatureSelectCheckboxList;