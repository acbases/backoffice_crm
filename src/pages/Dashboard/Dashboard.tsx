import { useEffect, useMemo, useState } from "react";
import { getVisites, type VisiteItem } from "@/pages/Visite/api/visiteApi";
import { getUsers, type UserItem } from "@/pages/Utilisateurs/api/utilisateurApi";
import TimeSeriesCard from "./components/TimeSeriesCard";
import CompletionRateCard from "./components/CompletionRateCard";
import { buildTimeline, bucketKey, countVisitesByBucket, type Granularity } from "./utils/aggregateVisites";

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

  const visitesEffectuees = useMemo(() => visites.filter((v) => v.statut === 1), [visites]);

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
    () => countVisitesByBucket(visitesEffectuees, granulariteEffectuees, timelineEffectuees),
    [visitesEffectuees, granulariteEffectuees, timelineEffectuees]
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
    () => countVisitesByBucket(visitesEmploye, granulariteEmploye, timelineEmploye),
    [visitesEmploye, granulariteEmploye, timelineEmploye]
  );

  const visitesEmployeFenetre = useMemo(
    () =>
      visitesEmploye.filter(
        (v) => v.date && timelineEmploye.includes(bucketKey(v.date, granulariteEmploye))
      ),
    [visitesEmploye, timelineEmploye, granulariteEmploye]
  );
  const nonEffectueesEmploye = useMemo(
    () => visitesEmployeFenetre.filter((v) => v.statut !== 1).length,
    [visitesEmployeFenetre]
  );
  const nonEffectueesEmployePercent =
    visitesEmployeFenetre.length > 0 ? (nonEffectueesEmploye / visitesEmployeFenetre.length) * 100 : 0;

  const enRetardEmploye = useMemo(
    () =>
      visitesEmployeFenetre.filter((v) => v.statut !== 1 && v.date && new Date(v.date) < new Date()).length,
    [visitesEmployeFenetre]
  );
  const enRetardEmployePercent =
    visitesEmployeFenetre.length > 0 ? (enRetardEmploye / visitesEmployeFenetre.length) * 100 : 0;
  const aVenirEmploye = Math.max(nonEffectueesEmploye - enRetardEmploye, 0);
  const aVenirEmployePercent =
    visitesEmployeFenetre.length > 0 ? (aVenirEmploye / visitesEmployeFenetre.length) * 100 : 0;

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
        subtitle="Nombre total de visites marquées comme effectuées"
        data={dataEffectuees}
        granularity={granulariteEffectuees}
        onGranularityChange={setGranulariteEffectuees}
        color="#2a78d6"
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
        subtitle="Nombre de visites (planifiées et effectuées)"
        data={dataEmploye}
        granularity={granulariteEmploye}
        onGranularityChange={setGranulariteEmploye}
        color="#eb6834"
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
        extraStats={
          <div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#4a3aa7" }} />
                <span className="text-gray-600">Non effectuées</span>
                <span className="font-semibold text-gray-900">
                  {nonEffectueesEmploye.toLocaleString("fr-FR")} ({nonEffectueesEmployePercent.toFixed(0)}%)
                </span>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-6 pl-1 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#d03b3b" }} />
                dont en retard :{" "}
                <span className="font-medium text-gray-700">
                  {enRetardEmploye.toLocaleString("fr-FR")} ({enRetardEmployePercent.toFixed(0)}%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#9ca3af" }} />
                dont à venir :{" "}
                <span className="font-medium text-gray-700">
                  {aVenirEmploye.toLocaleString("fr-FR")} ({aVenirEmployePercent.toFixed(0)}%)
                </span>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
