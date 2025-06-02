import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Menu, X } from "lucide-react";
import ProductGrid from "../components/general/ProductGrid";
import SidebarFilters from "../components/general/SidebarFilters";

export default function EquipmentGeneral() {
    const [open, setOpen] = useState(false);

    return (
        <section className="relative flex flex-col md:flex-row py-6 md:py-20 ">
            {/* Botón para abrir el drawer en móvil */}
            <div className="md:hidden px-4 pt-4 pb-2 bg-white shadow-sm sticky top-10 z-10">
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 border px-4 py-2 rounded-md bg-white text-sm font-medium w-full justify-center"
                >
                    <Menu className="w-4 h-4" />
                    Filtros
                </button>
            </div>

            {/* Drawer para móvil */}
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-40 md:hidden" onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex z-50">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative w-64 max-w-full bg-white shadow-xl p-4 flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">Filtros</h2>
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="text-gray-600 hover:text-black"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <SidebarFilters />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Sidebar normal en escritorio */}
            <aside className="hidden md:block w-64 p-4 border-r">
                <SidebarFilters />
            </aside>

            <main className="flex-1 p-4 md:p-6 bg-gray-50">
                <ProductGrid />
            </main>
        </section>
    );
}
