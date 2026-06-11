import React, { useState } from 'react'
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createVisite } from "../api/visiteApi";

const initialForm = {
    idclient: "",
    idutilisateur: "",
    idcategorie: "",
    date: "",
    statut: "",
    type: "",
    idtype: "",
    object: "",
};

export default function AjoutVisite() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleChange = (
        field: keyof typeof initialForm,
        value: string
    ) => {
        setForm((current) => ({ ...current, [field]: value }));
    };
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
                statut: Number(form.statut),
                type: Number(form.type),
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
                    Ajouter un visite non planifié
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
                        Id client
                    </span>
                    <input
                        value={form.idclient}
                        onChange={(event) =>
                            handleChange("idclient", event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                        type="number"
                        step="1"
                        required
                    />
                </label>

                <label className="block space-y-1">
                    <span className="text-sm font-medium text-gray-700">
                        Id utilisateur
                    </span>
                    <input
                        value={form.idutilisateur}
                        onChange={(event) =>
                            handleChange("idutilisateur", event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                        type="number"
                        step="1"
                        required
                    />
                </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-1">
                    <span className="text-sm font-medium text-gray-700">
                        Id catégorie
                    </span>
                    <input
                        value={form.idcategorie}
                        onChange={(event) =>
                            handleChange("idcategorie", event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                        type="number"
                        step="1"
                        required
                    />
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
                    />
                </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-1">
                    <span className="text-sm font-medium text-gray-700">
                        Statut
                    </span>
                    <input
                        value={form.statut}
                        onChange={(event) =>
                            handleChange("statut", event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                        type="number"
                        step="1"
                        required
                    />
                </label>

                <label className="block space-y-1">
                    <span className="text-sm font-medium text-gray-700">
                        Type
                    </span>
                    <input
                        value={form.type}
                        onChange={(event) =>
                            handleChange("type", event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                        type="number"
                        step="1"
                        required
                    />
                </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-1">
                    <span className="text-sm font-medium text-gray-700">
                        Id type
                    </span>
                    <input
                        value={form.idtype}
                        onChange={(event) =>
                            handleChange("idtype", event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
                        type="number"
                        step="1"
                        required
                    />
                </label>

                <label className="block space-y-1 md:col-span-1">
                    <span className="text-sm font-medium text-gray-700">
                        Objet
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
