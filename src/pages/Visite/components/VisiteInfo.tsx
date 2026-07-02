import { useEffect, useState } from "react";
import {
    Calendar,
    User,
    MapPin,
    Info,
    Pencil,
    Save,
    X,
} from "lucide-react";

import type { VisiteItem } from "../api/visiteApi";
import { updateVisite } from "../api/visiteApi";

import { getClients, type ClientItem } from "@/pages/Clients/api/clientApi";
import { getUsers, type UserItem } from "@/pages/Utilisateurs/api/utilisateurApi";
import {
    getTypeVisites,
    type TypeVisiteItem,
} from "../api/typeVisiteApi";
import {
    getCategorieVisites,
    type CategorieVisiteItem,
} from "../api/categorieVisiteApi";

interface VisiteInfoProps {
    visite: VisiteItem;
    onUpdated?: (visite: VisiteItem) => void;
}

export default function VisiteInfo({
    visite,
    onUpdated,
}: VisiteInfoProps) {
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [clients, setClients] = useState<ClientItem[]>([]);
    const [users, setUsers] = useState<UserItem[]>([]);
    const [types, setTypes] = useState<TypeVisiteItem[]>([]);
    const [categories, setCategories] = useState<CategorieVisiteItem[]>([]);

    const formatDateForInput = (date: string) => {
        return date.split(" ")[0];
    };
    const [form, setForm] = useState({
        idclient: visite.client.id,
        idutilisateur: visite.utilisateur.id,
        idcategorie: visite.categorie_visite.id,
        idtype: visite.type_visite.id,
        date: formatDateForInput(visite.date),
        object: visite.object ?? "",
        statut: visite.statut,
        type: visite.type,
    });

    useEffect(() => {
        Promise.all([
            getClients(),
            getUsers(),
            getTypeVisites(),
            getCategorieVisites(),
        ]).then(([c, u, t, cat]) => {
            setClients(c);
            setUsers(u);
            setTypes(t);
            setCategories(cat);
        });
    }, []);

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            const updated = await updateVisite(visite.id, form);

            onUpdated?.(updated);

            setEditing(false);
        } finally {
            setSaving(false);
        }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const visiteDate = new Date(visite.date);
    visiteDate.setHours(0, 0, 0, 0);
    const diffInDays = (visiteDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    const canEditDate = diffInDays > 3;

    return (
        <div className="flex flex-col p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Information visite
                </h2>

                {!editing ? (
                    <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                    >
                        <Pencil size={16} />
                        Modifier
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 rounded bg-green-600 px-3 py-2 text-white"
                        >
                            <Save size={16} />
                            {saving ? "Enregistrement..." : "Enregistrer"}
                        </button>

                        <button
                            onClick={() => setEditing(false)}
                            className="flex items-center gap-2 rounded bg-gray-500 px-3 py-2 text-white"
                        >
                            <X size={16} />
                            Annuler
                        </button>
                    </div>
                )}
            </div>

            {/* Objectif */}

            <div className="rounded-xl border bg-white p-4">
                <div className="mb-2 flex items-center gap-2">
                    <Info size={18} className="text-blue-500" />
                    <h3 className="font-semibold">Objectif</h3>
                </div>

                {editing ? (
                    <input
                        className="w-full rounded border p-2"
                        value={form.object}
                        onChange={(e) =>
                            handleChange("object", e.target.value)
                        }
                    />
                ) : (
                    <p>{visite.object || "Aucun objet renseigné"}</p>
                )}
            </div>

            {/* Informations */}

            <div className="rounded-xl border bg-white p-4">
                <div className="mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-green-500" />
                    <h3 className="font-semibold">
                        Informations visite
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <p className="text-gray-500">Date</p>

                        {editing ? (
                            <>
                                <input
                                    type="date"
                                    className="w-full rounded border p-2 disabled:bg-gray-100 disabled:text-gray-500"
                                    value={form.date}
                                    min={new Date().toISOString().split("T")[0]}
                                    disabled={!canEditDate}
                                    onChange={(e) =>
                                        handleChange("date", e.target.value)
                                    }
                                />

                                {!canEditDate && (
                                    <p className="mt-1 text-xs text-red-500">
                                        La date ne peut plus être modifiée moins de 3 jours avant la visite.
                                    </p>
                                )}
                            </>
                        ) : (
                            <p>
                                {new Date(visite.date).toLocaleDateString(
                                    "fr-FR"
                                )}
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="text-gray-500">Type visite</p>

                        {editing ? (
                            <select
                                className="w-full rounded border p-2"
                                value={form.idtype}
                                onChange={(e) =>
                                    handleChange(
                                        "idtype",
                                        Number(e.target.value)
                                    )
                                }
                            >
                                {types.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.nom}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p>{visite.type_visite.nom}</p>
                        )}
                    </div>

                    <div>
                        <p className="text-gray-500">Catégorie</p>

                        {editing ? (
                            <select
                                className="w-full rounded border p-2"
                                value={form.idcategorie}
                                onChange={(e) =>
                                    handleChange(
                                        "idcategorie",
                                        Number(e.target.value)
                                    )
                                }
                            >
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.intitule}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p>{visite.categorie_visite.intitule}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Client */}

            <div className="rounded-xl border bg-white p-4">
                <div className="mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-red-500" />
                    <h3 className="font-semibold">Client</h3>
                </div>

                {editing ? (
                    <select
                        className="w-full rounded border p-2"
                        value={form.idclient}
                        onChange={(e) =>
                            handleChange(
                                "idclient",
                                Number(e.target.value)
                            )
                        }
                    >
                        {clients.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nom}
                            </option>
                        ))}
                    </select>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <p>{visite.client.nom}</p>
                        <p>{visite.client.zone}</p>
                        <p>{visite.client.quartier}</p>
                        <p>
                            {visite.client.categorie_client.intitule}
                        </p>
                    </div>
                )}
            </div>

            {/* Utilisateur */}

            <div className="rounded-xl border bg-white p-4">
                <div className="mb-4 flex items-center gap-2">
                    <User size={18} className="text-purple-500" />
                    <h3 className="font-semibold">Commercial</h3>
                </div>

                {editing ? (
                    <select
                        className="w-full rounded border p-2"
                        value={form.idutilisateur}
                        onChange={(e) =>
                            handleChange(
                                "idutilisateur",
                                Number(e.target.value)
                            )
                        }
                    >
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.firstname} {u.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <p>
                            {visite.utilisateur.firstname}{" "}
                            {visite.utilisateur.name}
                        </p>
                        <p>{visite.utilisateur.email}</p>
                        <p>{visite.utilisateur.matricule}</p>
                        <p>{visite.utilisateur.role_crm}</p>
                    </div>
                )}
            </div>
        </div>
    );
}