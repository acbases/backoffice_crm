import axiosInstance from "../../../services/api/axiosInstance";

export interface CandidatSuggere {
    id: string;
    score: number;
    text: string;
}

export const GetCandidatsSuggeres = async (ficheDePoste: string): Promise<CandidatSuggere[]> => {
    const response = await axiosInstance.get<CandidatSuggere[]>(
        "/vectors/search",
        {
            params: { q: ficheDePoste }
        }
    );
    // console.log("API Response:", response);

    return response.data;
};