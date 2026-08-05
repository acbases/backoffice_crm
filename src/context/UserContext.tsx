// context/UserContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getUserByMatricule } from "@/pages/Utilisateurs/api/utilisateurApi";
import type { UserItem } from "@/pages/Utilisateurs/api/utilisateurApi";

interface UserContextType {
    matricule: string | null;
    user: UserItem | null;
    isAdmin: boolean;
}

const UserContext = createContext<UserContextType>({
    matricule: null,
    user: null,
    isAdmin: false,
});

export function UserProvider({ children }: { children: ReactNode }) {
    const [matricule, setMatricule] = useState<string | null>(null);
    const [user, setUser] = useState<UserItem | null>(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const fromUrl = params.get("userData");

        const resolvedMatricule =
            fromUrl ?? localStorage.getItem("userMatricule");

        if (fromUrl) {
            localStorage.setItem("userMatricule", fromUrl);
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        setMatricule(resolvedMatricule);

        if (!resolvedMatricule) {
            setReady(true);
            return;
        }

        getUserByMatricule(resolvedMatricule)
            .then((data) => {
                setUser(data);
            })
            .catch((err) => {
                console.error("Erreur chargement utilisateur :", err);
                setError(true);
            })
            .finally(() => {
                setReady(true);
            });
    }, []);

    if (!ready) {
        return null; // ou un loader
    }

    // Bloque l'accès si : pas de matricule, échec de l'appel API, ou aucun user trouvé
    if (!matricule || error || !user) {
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

    const isAdmin = user.role_crm === "admin";

    return (
        <UserContext.Provider value={{ matricule, user, isAdmin }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}