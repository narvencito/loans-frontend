import { useLoaderStore } from "../store/loader.store";

export default function GlobalLoader() {
  const { isLoading } = useLoaderStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[1000]">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
