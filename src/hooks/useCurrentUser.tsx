// hooks/useCurrentUser.ts
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { getUserByMatricule } from "@/pages/Utilisateurs/api/utilisateurApi";
import type { UserItem } from "@/pages/Utilisateurs/api/utilisateurApi";

export function useCurrentUser() {
    const { matricule } = useUser();
    const [user, setUser] = useState<UserItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!matricule) {
            setLoading(false);
            return;
        }

        getUserByMatricule(matricule)
            .then(setUser)
            .catch((err) => console.error("Erreur chargement utilisateur :", err))
            .finally(() => setLoading(false));
    }, [matricule]);

    const isAdmin = user?.role_crm === "admin";

    return { user, isAdmin, loading };
}