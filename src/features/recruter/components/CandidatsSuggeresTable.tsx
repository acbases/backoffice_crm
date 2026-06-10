import React from "react";
import { type CandidatSuggere } from "../api/recruterApi";

interface CandidatsSuggeresTableProps {
  CandidatsSuggeres: CandidatSuggere[];
  isLoading: boolean;
}

export const CandidatsSuggeresTable: React.FC<CandidatsSuggeresTableProps> = ({ CandidatsSuggeres, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm" id="user-table-container">
      <table className="w-full text-left border-collapse" id="user-table">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">id</th>
            <th className="pCandidatsSuggeresx-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">score</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">text</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {CandidatsSuggeres.map((CandidatSuggere) => (
            <tr key={CandidatSuggere.id} className="hover:bg-gray-50 transition-colors group">
              
              <td className="px-6 py-4 text-sm text-gray-700">
                <div className="font-medium">{CandidatSuggere.id}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>{CandidatSuggere.score}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                <div className="font-medium">{CandidatSuggere.text}</div>
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
