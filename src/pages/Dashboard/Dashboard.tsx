import { NavLink, Outlet } from "react-router-dom";

const TAB_CLASSNAME = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-red-100 text-red-600" : "bg-white text-gray-600 hover:bg-gray-100"
  }`;

export default function Dashboard() {
  return (
    <div id="Dashboard-page" className="flex h-screen flex-col overflow-hidden">
      <div className="shrink-0 flex flex-wrap items-center gap-2 p-3 mt-1.5">
        <div className="shrink-0 space-y-2 pr-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>

        <NavLink to="visite" className={TAB_CLASSNAME}>
          Visite
        </NavLink>
        <NavLink to="produit" className={TAB_CLASSNAME}>
          Produit
        </NavLink>
        <NavLink to="plv" className={TAB_CLASSNAME}>
          Plv
        </NavLink>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
