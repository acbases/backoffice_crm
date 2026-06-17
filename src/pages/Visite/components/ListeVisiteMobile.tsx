import type { VisiteItem } from "../api/visiteApi";
import MobileCard from "./MobileCard";

interface ListeVisiteMobileProps {
    visites: VisiteItem[];
    onOpenVisite: (id: number) => void;
    formatDate: (date: string) => string;
}

const ListeVisiteMobile = ({ visites, onOpenVisite, formatDate }: ListeVisiteMobileProps) => {
    return (
        <div className="flex flex-col gap-3 p-4 md:hidden">
            {visites.map((visite) => (
                <MobileCard
                    key={visite.id}
                    visite={visite}
                    onOpen={onOpenVisite}
                    formatDate={formatDate}
                />
            ))}
        </div>
    );
};

export default ListeVisiteMobile;
