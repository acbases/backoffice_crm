import { useEffect, useMemo, useState } from "react";
import { getVisites, type VisiteItem } from "@/pages/Visite/api/visiteApi";
import { getUsers, type UserItem } from "@/pages/Utilisateurs/api/utilisateurApi";
import TimeSeriesCard from "./components/TimeSeriesCard";
import CompletionRateCard from "./components/CompletionRateCard";
import { buildTimeline, countVisitesByBucketAndStatus, type Granularity } from "./utils/aggregateVisites";
import type { StatusFilter } from "./components/StatusToggle";

export default function Dashboard() {
  const [visites, setVisites] = useState<VisiteItem[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentMonthValue = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const [granulariteEffectuees, setGranulariteEffectuees] = useState<Granularity>("day");
  const [granulariteEmploye, setGranulariteEmploye] = useState<Granularity>("day");
  const [employeId, setEmployeId] = useState("");
  const [anneeCompletion, setAnneeCompletion] = useState("");
  const [moisEffectuees, setMoisEffectuees] = useState(currentMonthValue);
  const [moisEmploye, setMoisEmploye] = useState(currentMonthValue);
  const [statusFilterEffectuees, setStatusFilterEffectuees] = useState<StatusFilter>("all");
  const [statusFilterEmploye, setStatusFilterEmploye] = useState<StatusFilter>("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [visitesData, utilisateursData] = await Promise.all([getVisites(), getUsers()]);
        setVisites(visitesData);
        setUtilisateurs(utilisateursData);
      } catch (err) {
        console.error("Erreur chargement dashboard :", err);
        setError("Impossible de charger les données du dashboard.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const anneesDisponibles = useMemo(() => {
    const years = new Set<number>();
    visites.forEach((v) => {
      if (v.date) years.add(new Date(v.date).getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [visites]);

  const visitesCompletion = useMemo(
    () =>
      anneeCompletion
        ? visites.filter((v) => v.date && new Date(v.date).getFullYear() === Number(anneeCompletion))
        : visites,
    [visites, anneeCompletion]
  );
  const visitesEffectueesCompletion = useMemo(
    () => visitesCompletion.filter((v) => v.statut === 1),
    [visitesCompletion]
  );
  const enRetardCompletion = useMemo(
    () => visitesCompletion.filter((v) => v.statut !== 1 && v.date && new Date(v.date) < new Date()).length,
    [visitesCompletion]
  );

  const refDateEffectuees = useMemo(() => {
    const [y, m] = moisEffectuees.split("-").map(Number);
    return new Date(y, m - 1, 1);
  }, [moisEffectuees]);
  const timelineEffectuees = useMemo(
    () => buildTimeline(granulariteEffectuees, granulariteEffectuees === "day" ? refDateEffectuees : undefined),
    [granulariteEffectuees, refDateEffectuees]
  );
  const dataEffectuees = useMemo(
    () => countVisitesByBucketAndStatus(visites, granulariteEffectuees, timelineEffectuees),
    [visites, granulariteEffectuees, timelineEffectuees]
  );

  const visitesEmploye = useMemo(
    () => (employeId ? visites.filter((v) => String(v.utilisateur?.id) === employeId) : visites),
    [visites, employeId]
  );
  const refDateEmploye = useMemo(() => {
    const [y, m] = moisEmploye.split("-").map(Number);
    return new Date(y, m - 1, 1);
  }, [moisEmploye]);
  const timelineEmploye = useMemo(
    () => buildTimeline(granulariteEmploye, granulariteEmploye === "day" ? refDateEmploye : undefined),
    [granulariteEmploye, refDateEmploye]
  );
  const dataEmploye = useMemo(
    () => countVisitesByBucketAndStatus(visitesEmploye, granulariteEmploye, timelineEmploye),
    [visitesEmploye, granulariteEmploye, timelineEmploye]
  );

  if (loading) {
    return (
      <div className="m-4 rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        Chargement du dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="h-screen space-y-6 overflow-y-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <CompletionRateCard
        done={visitesEffectueesCompletion.length}
        total={visitesCompletion.length}
        enRetard={enRetardCompletion}
        extraControls={
          <select
            value={anneeCompletion}
            onChange={(event) => setAnneeCompletion(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 outline-none focus:border-red-500"
          >
            <option value="">Toutes les années</option>
            {anneesDisponibles.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
        }
      />

      <TimeSeriesCard
        title="Visites effectuées"
        subtitle="Effectuées, en retard ou à venir — choisis ce qui s'affiche"
        data={dataEffectuees}
        granularity={granulariteEffectuees}
        onGranularityChange={setGranulariteEffectuees}
        statusFilter={statusFilterEffectuees}
        onStatusFilterChange={setStatusFilterEffectuees}
        extraControls={
          granulariteEffectuees === "day" ? (
            <input
              type="month"
              value={moisEffectuees}
              onChange={(event) => setMoisEffectuees(event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 outline-none focus:border-red-500"
            />
          ) : null
        }
      />

      <TimeSeriesCard
        title="Visites par employé"
        subtitle="Effectuées, en retard ou à venir — choisis ce qui s'affiche"
        data={dataEmploye}
        granularity={granulariteEmploye}
        onGranularityChange={setGranulariteEmploye}
        statusFilter={statusFilterEmploye}
        onStatusFilterChange={setStatusFilterEmploye}
        extraControls={
          <>
            {granulariteEmploye === "day" && (
              <input
                type="month"
                value={moisEmploye}
                onChange={(event) => setMoisEmploye(event.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 outline-none focus:border-red-500"
              />
            )}
            <select
              value={employeId}
              onChange={(event) => setEmployeId(event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 outline-none focus:border-red-500"
            >
              <option value="">Tous les employés</option>
              {utilisateurs.map((u) => (
                <option key={u.id} value={String(u.id)}>
                  {u.firstname} {u.name}
                </option>
              ))}
            </select>
          </>
        }
      />
    </div>
  );
}
