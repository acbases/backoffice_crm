import type { VisiteItem } from "../api/visiteApi";

export const normalizeText = (value: string | null | undefined) =>
    (value ?? "").trim().toLowerCase();

export interface FilterParams {
    clientsFilter: string;
    usersFilter: string;
    planifiedFilter: string;
    typeVisiteFilter: string;
    categorieVisiteFilter: string;
    zoneFilter: string;
    quartierFilter: string;
    statutFilter: string;
}

export function getFilteredVisites(visites: VisiteItem[], filters: FilterParams) {
    const {
        clientsFilter,
        usersFilter,
        planifiedFilter,
        typeVisiteFilter,
        categorieVisiteFilter,
        zoneFilter,
        quartierFilter,
        statutFilter
    } = filters;

    return visites.filter((vis) => {
        if (clientsFilter) {
            const regex = new RegExp(clientsFilter.trim().split(/\s+/).join(".*"), "i");
            if (!regex.test(normalizeText(vis.client?.nom))) {
                return false;
            }
        }

        if (usersFilter) {
            const userFullName = `${vis.utilisateur?.firstname ?? ""} ${vis.utilisateur?.name ?? ""}`.trim();
            const regex = new RegExp(usersFilter.trim().split(/\s+/).join(".*"), "i");
            if (!regex.test(normalizeText(userFullName))) {
                return false;
            }
        }

        if (planifiedFilter !== "") {
            if (vis.type !== Number(planifiedFilter)) {
                return false;
            }
        }

        if (typeVisiteFilter !== "") {
            if (vis.idtype !== Number(typeVisiteFilter)) {
                return false;
            }
        }

        if (categorieVisiteFilter !== "") {
            if (vis.categorie_visite?.id !== Number(categorieVisiteFilter)) {
                return false;
            }
        }

        if (zoneFilter !== "") {
            if (vis.client?.zone !== zoneFilter) {
                return false;
            }
        }

        if (quartierFilter !== "") {
            if (vis.client?.quartier !== quartierFilter) {
                return false;
            }
        }

        if (statutFilter !== "") {
            const isPast = vis.date ? new Date(vis.date) < new Date() : false;
            const isOverdue = vis.statut === 0 && isPast;

            let currentStatus = "A venir";
            if (vis.statut === 1) {
                currentStatus = "Terminée";
            } else if (isOverdue) {
                currentStatus = "En retard";
            }

            if (currentStatus !== statutFilter) {
                return false;
            }
        }

        return true;
    });
}
