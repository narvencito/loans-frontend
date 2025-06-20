import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreateRequestAdminDto, requestApi, RequestItem } from '@/features/request/api/request_api';
import RequestTable from '@/features/request/components/RequestTable';
import AdminRequestFormModal from '@/features/request/pages/AdminRequestFormPage';

const AdminRequestListPage = () => {
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const loadRequests = async () => {
        setLoading(true);
        const data = await requestApi.getAll();
        setRequests(data);
        setLoading(false);
    };

    const handleCreate = async (data: CreateRequestAdminDto) => {
        console.log("Creando la solicitud desde el admin");
        //await requestApi.create(data);
        //setShowModal(false);
        //loadRequests();
    };

    const handleView = (request: RequestItem) => {
        // Aquí puedes abrir un modal o redirigir a otra ruta
        console.log('Ver solicitud:', request);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h1 className="text-xl sm:text-2xl font-bold">Solicitudes Registradas</h1>
                <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
                    Crear Solicitud
                </Button>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : requests.length === 0 ? (
                <p className="text-center text-muted-foreground">No hay solicitudes registradas aún.</p>
            ) : (
                <div className="overflow-x-auto">
                    <RequestTable requests={requests} onView={handleView} />
                </div>
            )}

            <AdminRequestFormModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onCreate={handleCreate}
            />
        </div>
    );
};

export default AdminRequestListPage;
