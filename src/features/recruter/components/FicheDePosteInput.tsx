import React from 'react'

// Input component for ficheDePoste
interface FicheDePosteInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const FicheDePosteInput: React.FC<FicheDePosteInputProps> = ({ 
    value, 
    onChange, 
    placeholder = "Describe the job position..." 
}) => {
    return (
        <div className="mb-4">
            <label 
                htmlFor="ficheDePoste" 
                className="block text-sm font-medium text-gray-700 mb-2"
            >
                Fiche de Poste
            </label>
            <textarea
                id="ficheDePoste"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
        </div>
    );
};

export default FicheDePosteInput