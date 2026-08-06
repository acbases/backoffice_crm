import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createVisite } from "../api/visiteApi";
import { getClients, type ClientItem } from '@/pages/Clients/api/clientApi';
import { getUsers, type UserItem } from '@/pages/Utilisateurs/api/utilisateurApi';
import { getTypeVisites, type TypeVisiteItem } from '../api/typeVisiteApi';
import { getCategorieVisites, type CategorieVisiteItem } from '../api/categorieVisiteApi';
import { getVisites, type VisiteItem } from "../api/visiteApi";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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

type AjoutVisiteProps = {
    onCreated?: () => void;
};

export default function AjoutVisite({ onCreated }: AjoutVisiteProps) {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { user: currentUser, isAdmin } = useCurrentUser();

    // get all client, utilisateurs, typeVisite et categoriVisite pour liste deroulantes formulaire visite
    const [clients, setClients] = useState<ClientItem[]>([])
    const [utilisateurs, setUtilisateurs] = useState<UserItem[]>([])
    const [typeVisites, setTypeVisites] = useState<TypeVisiteItem[]>([])
    const [categorieVisites, setCategorieVisites] = useState<CategorieVisiteItem[]>([])

    // ===== Autocomplete client =====
    const [clientSearch, setClientSearch] = useState("");
    const [clientSuggestions, setClientSuggestions] = useState<ClientItem[]>([]);
    const [showClientSuggestions, setShowClientSuggestions] = useState(false);
    const clientFieldRef = useRef<HTMLDivElement | null>(null);

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

    // un simple utilisateur ne choisit pas l'utilisateur : la visite lui est assignée automatiquement
    useEffect(() => {
        if (!isAdmin && currentUser) {
            setForm((current) => ({ ...current, idutilisateur: String(currentUser.id) }));
        }
    }, [isAdmin, currentUser]);

    // fermer les suggestions si clic en dehors du champ
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                clientFieldRef.current &&
                !clientFieldRef.current.contains(event.target as Node)
            ) {
                setShowClientSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // gerer le changement d'etat sur chaque input
    const handleChange = (
        field: keyof typeof initialForm,
        value: string
    ) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleClientSearchChange = (text: string) => {
        setClientSearch(text);
        handleChange("idclient", ""); // reset la sélection tant qu'on retape

        if (text.trim().length > 0) {
            const filtered = clients.filter((c) =>
                c.nom.toLowerCase().includes(text.toLowerCase())
            );
            setClientSuggestions(filtered);
            setShowClientSuggestions(true);
        } else {
            setClientSuggestions([]);
            setShowClientSuggestions(false);
        }
    };

    const selectClient = (client: ClientItem) => {
        handleChange("idclient", String(client.id));
        setClientSearch(client.nom);
        setClientSuggestions([]);
        setShowClientSuggestions(false);
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
            setClientSearch("");
        } catch {
            setError("Unable to save the visite.");
            setLoading(false);
            return; // on sort avant d'appeler onCreated
        }

        setLoading(false);

        // navigate("../liste");
        if (onCreated) {
            onCreated();
        } else {
            window.location.href = "/crm_admin/visite/liste";
        }
    };
    return (
        <form
            onSubmit={handleSubmit}
            className="m-4 max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
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
                <div className="block space-y-1 relative" ref={clientFieldRef}>
                    <span className="text-sm font-medium text-gray-700">
                        Clients
                    </span>
                    <input
                        type="text"
                        value={clientSearch}
                        onChange={(event) => handleClientSearchChange(event.target.value)}
                        onFocus={() => {
                            if (clientSearch.trim().length > 0) {
                                setShowClientSuggestions(true);
                            }
                        }}
                        placeholder="Rechercher un client..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                        autoComplete="off"
                        required
                    />
                    {/* input caché pour garder la validation required native sur idclient */}
                    <input type="hidden" value={form.idclient} required />

                    {showClientSuggestions && clientSuggestions.length > 0 && (
                        <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                            {clientSuggestions.map((client) => (
                                <button
                                    type="button"
                                    key={client.id}
                                    onClick={() => selectClient(client)}
                                    className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                                >
                                    {client.nom}
                                </button>
                            ))}
                        </div>
                    )}

                    {showClientSuggestions &&
                        clientSearch.trim().length > 0 &&
                        clientSuggestions.length === 0 && (
                            <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 shadow-lg">
                                Aucun client trouvé
                            </div>
                        )}
                </div>

                <label className="block space-y-1">
                    <span className="text-sm font-medium text-gray-700">
                        Commercial
                    </span>
                    {isAdmin ? (
                        <select
                            value={form.idutilisateur}
                            onChange={(event) => handleChange("idutilisateur", event.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                            required
                        >
                            <option value="">Commercial</option>

                            {utilisateurs.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {`${user.firstname} ${user.name}`}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
                            {currentUser ? `${currentUser.firstname} ${currentUser.name}` : "..."}
                        </div>
                    )}
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
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                        required
                    >
                        <option value="">Catégorie</option>

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
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                        required
                    >
                        <option value="">Type</option>

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
                disabled={loading || (!isAdmin && !currentUser)}
                className="rounded-lg bg-green-200 px-4 py-2 text-sm font-medium hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {loading ? "En cours..." : "Enregistrer visite"}
            </button>
        </form>
    )
}