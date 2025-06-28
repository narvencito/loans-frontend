import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateRequestAdminDto, requestApi, RequestItem } from '@/features/request/api/request_api';
import { RequestTable } from '@/features/request/components/RequestTable';
import AdminRequestFormModal from '@/features/request/pages/AdminRequestFormPage';
import { RequestTypeEnum } from '@/shared/enums/request-type.enum';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/shared/components/DatePicker';
import AsyncClientCombobox from '@/features/client/components/AsyncClientCombobox';
import { setGlobalDialog, showGlobalDialog } from '@/shared/utils/global-dialog';
import Pagination from '@/shared/components/Pagination';

const AdminRequestListPage = () => {
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<RequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [fromDate, setFromDate] = useState<Date | undefined>();
    const [toDate, setToDate] = useState<Date | undefined>();
    
    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const totalPages = Math.ceil(filteredRequests.length / pageSize);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const data = await requestApi.getAll();
            setRequests(data);
            setFilteredRequests(data || []);
        } catch (error) {
            console.error('Error al cargar las solicitudes:', error);
            setFilteredRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    // Calcular elementos paginados
    const paginatedRequests = filteredRequests.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset a la primera página cuando cambia el tamaño
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const filters: {
                clientId?: string;
                type?: string;
                status?: string;
            } = {};
            
            if (selectedClientId) {
                filters.clientId = selectedClientId;
            }
            
            if (selectedType !== 'all') {
                filters.type = selectedType;
            }

            if (selectedStatus !== 'all') {
                filters.status = selectedStatus;
            }

            const data = await requestApi.getByFilter(filters);
            setFilteredRequests(data || []);
            setCurrentPage(1); // Reset a la primera página al filtrar
        } catch (error) {
            console.error('Error al buscar solicitudes:', error);
            setFilteredRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data: CreateRequestAdminDto) => {
        try {
            await requestApi.createAdmin(data);
            setShowModal(false);
            await loadRequests();
        } catch (error) {
            console.error('Error al crear la solicitud:', error);
        }
    };

    const handleView = (request: RequestItem) => {
        console.log('Ver solicitud:', request);
    };

    const handleTypeChange = (value: string) => {
        setSelectedType(value);
    };

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
    };

    const handleClearFilters = () => {
        setSelectedClientId(null);
        setSelectedType('all');
        setSelectedStatus('all');
        loadRequests();
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">Solicitudes Registradas</h1>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col gap-4">
                    {/* Fila de filtros */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-2">
                            <AsyncClientCombobox
                                selectedClientId={selectedClientId}
                                onSelect={setSelectedClientId}
                                placeholder="Buscar cliente..."
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Tipo de solicitud</Label>
                            <Select value={selectedType} onValueChange={handleTypeChange}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Tipo de solicitud" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value={RequestTypeEnum.CASH}>Préstamo en efectivo</SelectItem>
                                    <SelectItem value={RequestTypeEnum.EQUIPMENT_LOAN}>Préstamo de equipo</SelectItem>
                                    <SelectItem value={RequestTypeEnum.EQUIPMENT_FINANCING}>Financiamiento de equipo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Estado</Label>
                            <Select value={selectedStatus} onValueChange={handleStatusChange}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="pending">Pendiente</SelectItem>
                                    <SelectItem value="in-review">En revisión</SelectItem>
                                    <SelectItem value="approved">Aprobado</SelectItem>
                                    <SelectItem value="rejected">Rechazado</SelectItem>
                                    <SelectItem value="converted">Convertido</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2 items-end justify-end">
                            <Button onClick={() => setShowModal(true)}>
                                Crear
                            </Button>
                            <Button
                                variant="secondary"
                                className="bg-blue-600 text-white hover:bg-blue-700"
                                onClick={handleSearch}
                                type="button"
                            >
                                Buscar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Cargando...</span>
                </div>
            ) : filteredRequests.length === 0 ? (
                <p className="text-center text-muted-foreground">No hay solicitudes que coincidan con los filtros.</p>
            ) : (
                <div className="space-y-4">
                    <div className="overflow-x-auto">
                        <RequestTable 
                            requests={paginatedRequests}
                            showActions={true}
                            onAlert={(message, type) => {
                                showGlobalDialog({
                                    type: type === 'success' ? 'success' : 'error',
                                    title: type === 'success' ? 'Éxito' : 'Error',
                                    message
                                });
                            }}
                            onRefresh={loadRequests}
                        />
                    </div>
                    
                    <div className="flex justify-end mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    </div>
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
