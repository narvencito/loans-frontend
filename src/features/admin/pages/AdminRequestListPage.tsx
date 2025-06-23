import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateRequestAdminDto, requestApi, RequestItem } from '@/features/request/api/request_api';
import RequestTable from '@/features/request/components/RequestTable';
import AdminRequestFormModal from '@/features/request/pages/AdminRequestFormPage';
import { RequestTypeEnum } from '@/shared/enums/request-type.enum';

const AdminRequestListPage = () => {
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<RequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');

    const loadRequests = async () => {
        setLoading(true);
        const data = await requestApi.getAll();
        setRequests(data);
        setFilteredRequests(data);
        setLoading(false);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    useEffect(() => {
        let filtered = [...requests];
        
        // Filtrar por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(request => 
                request.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.client.document.includes(searchTerm)
            );
        }
        
        // Filtrar por tipo de solicitud
        if (selectedType && selectedType !== 'all') {
            filtered = filtered.filter(request => 
                request.requestType.code === selectedType
            );
        }
        
        setFilteredRequests(filtered);
    }, [searchTerm, selectedType, requests]);

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

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">Solicitudes Registradas</h1>
                <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                    <div className="flex-1 sm:w-[300px]">
                        <Input
                            placeholder="Buscar por nombre o documento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Tipo de solicitud" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value={RequestTypeEnum.CASH}>Préstamo en efectivo</SelectItem>
                            <SelectItem value={RequestTypeEnum.EQUIPMENT_LOAN}>Préstamo de equipo</SelectItem>
                            <SelectItem value={RequestTypeEnum.EQUIPMENT_FINANCING}>Financiamiento de equipo</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                        <Button 
                            variant="secondary"
                            className="shrink-0 bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => {
                                // La búsqueda ya se realiza automáticamente por el useEffect
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            Buscar
                        </Button>
                        <Button onClick={() => setShowModal(true)}>
                            Crear Solicitud
                        </Button>
                    </div>
                </div>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : filteredRequests.length === 0 ? (
                <p className="text-center text-muted-foreground">No hay solicitudes que coincidan con los filtros.</p>
            ) : (
                <div className="overflow-x-auto">
                    <RequestTable requests={filteredRequests} onView={handleView} />
                </div>
            )}

            <AdminRequestFormModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={handleCreate}
            />
        </div>
    );
};

export default AdminRequestListPage;
