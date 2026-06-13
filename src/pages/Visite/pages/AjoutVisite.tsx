import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createVisite } from "../api/visiteApi";
import { getClients, type ClientItem } from '@/pages/Clients/api/clientApi';
import { getUsers, type UserItem } from '@/pages/Utilisateurs/api/utilisateurApi';
import { getTypeVisites, type TypeVisiteItem } from '../api/typeVisiteApi';
import { getCategorieVisites, type CategorieVisiteItem } from '../api/categorieVisiteApi';
const initialForm = {
    idclient: "",
    idutilisateur: "",
    idcategorie: "",
    date: "",
    statut: 0, // a confirmer 
    type: 0, // 0 planifié et 1 non 
    idtype: "",
    object: "",
};

export default function AjoutVisite() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    // get all client, utilisateurs, typeVisite et categoriVisite pour liste deroulantes formulaire visite
    const [clients, setClients] = useState<ClientItem[]>([])
    const [utilisateurs, setUtilisateurs] = useState<UserItem[]>([])
    const [typeVisites, setTypeVisites] = useState<TypeVisiteItem[]>([])
    const [categorieVisites, setCategorieVisites] = useState<CategorieVisiteItem[]>([])
    useEffect(() => {
        const loadCategorieAgenceData = async () => {
            try {
                const [ClientsData, UsersData, TypeVisiteData, CategorieVisiteData] = await Promise.all([
                    getClients(),
                    getUsers(), 
                    getTypeVisites(),
                    getCategorieVisites()
                ]);

                setClients(ClientsData);
                setUtilisateurs(UsersData);
                setTypeVisites(TypeVisiteData)
                setCategorieVisites(CategorieVisiteData)
            } catch (error) {
                console.error("Erreur chargement listes :", error);
            }
        };

        loadCategorieAgenceData();
    }, []);

    // gerer le changement d'etat sur chaque input
    const handleChange = (
        field: keyof typeof initialForm,
        value: string
    ) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    // submit handlers
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            await createVisite({
                idclient: Number(form.idclient),
                idutilisateur: Number(form.idutilisateur),
                idcategorie: Number(form.idcategorie),
                date: form.date,
                statut: form.statut,
                type: form.type,
                idtype: Number(form.idtype),
                object: form.object,
            });

            setForm(initialForm);
            navigate("../liste");
        } catch {
            setError("Unable to save the visite.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                    Planifier une visite pour un utilisateur
                </h2>
            </div>

            {error ? (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-1">
                    <span className="text-sm font-medium text-gray-700">
                        Clients
                    </span>
                    <select
                        value={form.idclient}
                        onChange={(event) => handleChange("idclient", event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                        required
                    >
                        <option value="">Sélectionner un client</option>

                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.nom}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block space-y-1">
                    <span className="text-sm font-medium text-gray-700">
                        Responsable commercial
                    </span>
                    <select
                        value={form.idutilisateur}
                        onChange={(event) => handleChange("idutilisateur", event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                        required
                    >
                        <option value="">Sélectionner un responsable</option>

                        {utilisateurs.map((user) => (
                            <option key={user.id} value={user.id}>
                                {`${user.firstname} ${user.name}`}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-1">
                    <span className="text-sm font-medium text-gray-700">
                        Catégorie
                    </span>
                    <select
                        value={form.idcategorie}
                        onChange={(event) => handleChange("idcategorie", event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                        required
                    >
                        <option value="">Sélectionner un categorie</option>

                        {categorieVisites.map((catVisite) => (
                            <option key={catVisite.id} value={catVisite.id}>
                                {catVisite.intitule}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block space-y-1">
                    <span className="text-sm font-medium text-gray-700">
                        Date
                    </span>
                    <input
                        value={form.date}
                        onChange={(event) =>
                            handleChange("date", event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                    />
                </label>
            </div>

            

            <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-1">
                    <span className="text-sm font-medium text-gray-700">
                        Type
                    </span>
                    <select
                        value={form.idtype}
                        onChange={(event) => handleChange("idtype", event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                        required
                    >
                        <option value="">Sélectionner un type</option>

                        {typeVisites.map((typeVisite) => (
                            <option key={typeVisite.id} value={typeVisite.id}>
                                {typeVisite.nom}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block space-y-1 md:col-span-1">
                    <span className="text-sm font-medium text-gray-700">
                        Objectif visite
                    </span>
                    <input
                        value={form.object}
                        onChange={(event) =>
                            handleChange("object", event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                        type="text"
                        required
                    />
                </label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {loading ? "Saving..." : "Save visite"}
            </button>
        </form>
    )
}
