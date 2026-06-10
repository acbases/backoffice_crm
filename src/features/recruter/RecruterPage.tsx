import React, { useEffect, useState } from "react";
import { GetCandidatsSuggeres, type CandidatSuggere } from "./api/recruterApi";
import { CandidatsSuggeresTable } from "./components/CandidatsSuggeresTable";
import FicheDePosteInput from "./components/FicheDePosteInput";
import SuggestionButton from "./components/GetSuggestionButton";

function RecruterPage() {
    const [ficheDePoste, setficheDePoste] = useState<string>("");
    const [CandidatsSuggeres, setCandidatsSuggeres] = useState<CandidatSuggere[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await GetCandidatsSuggeres(ficheDePoste);
            setCandidatsSuggeres(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch CandidatsSuggeres. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("Fetched CandidatsSuggeres:", CandidatsSuggeres);
    }, [CandidatsSuggeres])

    return (
        <div>
            {/* input for the search */}
            <div>
                <FicheDePosteInput
                    value={ficheDePoste}
                    onChange={setficheDePoste}
                />
            </div>

            {/* button to get suggestion from the system */}
            <div className="mb-6">
                <SuggestionButton
                    onClick={fetchData}
                    isLoading={loading}
                    disabled={loading || !ficheDePoste.trim()}
                />
            </div>

            {/* output of the result */}
            {error ? (
                <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg">
                    {error}
                </div>
            ) : (
                <CandidatsSuggeresTable
                    CandidatsSuggeres={CandidatsSuggeres}
                    isLoading={loading}
                />
            )}
        </div>
    )
}

export default RecruterPage