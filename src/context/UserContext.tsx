// context/UserContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface UserContextType {
    matricule: string | null;
}

const UserContext = createContext<UserContextType>({ matricule: null });

export function UserProvider({ children }: { children: ReactNode }) {
    const [matricule, setMatricule] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const fromUrl = params.get("userData");

        if (fromUrl) {
            localStorage.setItem("userMatricule", fromUrl);
            setMatricule(fromUrl);
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            setMatricule(localStorage.getItem("userMatricule"));
        }

        setReady(true);
    }, []);

    if (!ready) {
        return null; // ou un loader
    }

    if (!matricule) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <div className="text-center space-y-2 p-6">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Accès non autorisé
                    </h1>
                    <p className="text-gray-500">
                        Vous devez accéder à cette application depuis AllPro ou vous ne disposez pas des accès nécessaires.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <UserContext.Provider value={{ matricule }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}