import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-center items-center">
      {/* Top Decoration */}
      <div className="fixed top-0 left-0 w-full h-48 bg-gradient-to-b from-primary/30 to-transparent pointer-events-none" />

      {/* Bottom Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-48 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none" />
      
      <div className="relative w-full">
        <Outlet />
      </div>
    </div>
  );
}