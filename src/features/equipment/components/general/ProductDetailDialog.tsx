import DialogAppCustom from '@/shared/components/DialogAppCustom';
import { EquipmentItem } from '../../api/equipment_api';
import { useState } from 'react';
import ImageCarousel from './ImageCarousel';

interface Props {
    open: boolean;
    onClose: () => void;
    equipment: EquipmentItem;
}

const EquipmentDetailsDialog = ({ open, onClose, equipment }: Props) => {
    const [currentImage, setCurrentImage] = useState(0);

    const handleNext = () => {
        setCurrentImage((prev) => (prev + 1) % equipment.images.length);
    };

    const handlePrev = () => {
        setCurrentImage((prev) => (prev - 1 + equipment.images.length) % equipment.images.length);
    };

    return (
        <DialogAppCustom
            open={open}
            onClose={onClose}
            title={equipment.name}
            maxWidth="4xl"
            childrenFooter={
                <button
                    onClick={onClose}
                    className="bg-indigo-600 text-white font-bold px-6 py-2 rounded hover:bg-indigo-700"
                >
                    ¡La quiero! ✔
                </button>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto">
                {/* Left: Imagen + Descripcion */}
                <div>
                    <ImageCarousel images={equipment.images} />
                    <h2 className="text-xl font-bold text-indigo-700 mt-4">{equipment.name}</h2>
                    <h3 className="text-sm font-semibold text-blue-600 mt-2">Potente y económica</h3>
                    <p className="text-sm text-gray-700 mt-2 text-justify">
                        Este equipo cuenta con excelentes especificaciones para tareas de oficina, estudio o entretenimiento. Su diseño versátil permite un uso confortable y eficiente. Incluye componentes de calidad que garantizan buen rendimiento.
                    </p>
                </div>

                {/* Right: Caracteristicas destacadas + Features */}
                <div className="border-l pl-6">
                    <h4 className="font-semibold text-blue-700 mb-3">Características destacadas</h4>
                    <div className="text-sm space-y-2">
                        <p><strong>Categoría:</strong> {equipment.categoryName}</p>
                        <p><strong>Estado:</strong> {equipment.statusName}</p>
                        <p><strong>Ubicación:</strong> {equipment.location}</p>
                        <p><strong>Serie:</strong> {equipment.serial}</p>
                        <p><strong>Precio Venta:</strong> S/ {equipment.salePrice}</p>
                    </div>

                    <h5 className="font-semibold text-blue-700 mt-6 mb-2">Características adicionales</h5>
                    {equipment.features.length === 0 ? (
                        <p className="text-gray-500 italic text-sm">No tiene características registradas.</p>
                    ) : (
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {equipment.features.map((f) => (
                                <li key={f.id}>{f.name}</li>
                            ))}
                        </ul>
                    )}


                </div>
                <p className="text-xs text-gray-500 mt-6 italic">
                    El equipo no incluye MS Office ni Antivirus.
                </p>
            </div>
        </DialogAppCustom>
    );
};

export default EquipmentDetailsDialog;
