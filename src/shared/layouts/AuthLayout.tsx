import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-center items-center overflow-hidden">
      {/* Top Decoration */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-primary/30 to-transparent z-0 rounded-b-[50%]" />

      {/* Bottom Decoration */}
      <div className="absolute bottom-0  left-0 w-full h-48 bg-gradient-to-t from-primary/30 to-transparent z-0 rounded-t-[50%]" />
        <Outlet />
    </div>
  );
}