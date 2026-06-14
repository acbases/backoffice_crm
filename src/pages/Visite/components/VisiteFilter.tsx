import type { ClientItem } from "@/pages/Clients/api/clientApi";
import type { UserItem } from "@/pages/Utilisateurs/api/utilisateurApi";

type FilterValue = string;

type VisiteFiltersProps = {
    clientFilter: FilterValue;
    setClientsFilter: (value: FilterValue) => void;
    clientsOptions: ClientItem[];
    
    usersFilter: FilterValue;
    setUsersFilter: (value: FilterValue) => void;
    userOptions: UserItem[];

    planifiedFilter: FilterValue;
    setPlanifiedFilter: (value: FilterValue) => void;

    typeVisiteFilter: FilterValue;
    setTypeVisiteFilter: (value: FilterValue) => void;
    typeVisiteOptions: { id: number; nom: string }[];

    categorieVisiteFilter: FilterValue;
    setCategorieVisiteFilter: (value: FilterValue) => void;
    categorieVisiteOptions: { id: number; intitule: string }[];

    zoneFilter: FilterValue;
    setZoneFilter: (value: FilterValue) => void;
    zoneOptions: string[];

    quartierFilter: FilterValue;
    setQuartierFilter: (value: FilterValue) => void;
    quartierOptions: string[];

    statutFilter: FilterValue;
    setStatutFilter: (value: FilterValue) => void;
    statutOptions: string[];
}

function FilterSelect({
    label,
    id,
    value,
    onChange,
    options,
    placeholder,
}: {
    label: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
}) {
    return (
        <label className="flex flex-col gap-1.5 text-sm text-gray-600" htmlFor={id}>
            <span className="font-medium text-gray-700">{label}</span>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

function VisiteFilters({
    clientFilter,
    setClientsFilter, 
    clientsOptions, 
    usersFilter,
    setUsersFilter,
    userOptions,
    planifiedFilter,
    setPlanifiedFilter,
    typeVisiteFilter,
    setTypeVisiteFilter,
    typeVisiteOptions,
    categorieVisiteFilter,
    setCategorieVisiteFilter,
    categorieVisiteOptions,
    zoneFilter,
    setZoneFilter,
    zoneOptions,
    quartierFilter,
    setQuartierFilter,
    quartierOptions,
    statutFilter,
    setStatutFilter,
    statutOptions
}: VisiteFiltersProps) {
    return (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-8">
            <label className="flex flex-col gap-1.5 text-sm text-gray-600" htmlFor="nom-filter">
                <span className="font-medium text-gray-700">Client</span>
                <input
                    id="nom-filter"
                    list="clients-list"
                    type="text"
                    value={clientFilter}
                    onChange={(e) => setClientsFilter(e.target.value)}
                    placeholder="Rechercher par nom..."
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <datalist id="clients-list">
                    {clientsOptions.map((client) => (
                        <option key={client.id} value={client.nom} />
                    ))}
                </datalist>
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-gray-600" htmlFor="user-filter">
                <span className="font-medium text-gray-700">Utilisateur</span>
                <input
                    id="user-filter"
                    list="users-list"
                    type="text"
                    value={usersFilter}
                    onChange={(e) => setUsersFilter(e.target.value)}
                    placeholder="Rechercher par utilisateur..."
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <datalist id="users-list">
                    {userOptions.map((user) => (
                        <option key={user.id} value={`${user.firstname} ${user.name}`} />
                    ))}
                </datalist>
            </label>

            <FilterSelect
                label="Planifiée"
                id="planified-filter"
                value={planifiedFilter}
                onChange={setPlanifiedFilter}
                options={[
                    { value: "0", label: "Oui" },
                    { value: "1", label: "Non" },
                ]}
                placeholder="Toutes"
            />

            <FilterSelect
                label="Type de Visite"
                id="type-visite-filter"
                value={typeVisiteFilter}
                onChange={setTypeVisiteFilter}
                options={typeVisiteOptions.map((opt) => ({
                    value: String(opt.id),
                    label: opt.nom,
                }))}
                placeholder="Tous"
            />

            <FilterSelect
                label="Catégorie"
                id="categorie-visite-filter"
                value={categorieVisiteFilter}
                onChange={setCategorieVisiteFilter}
                options={categorieVisiteOptions.map((opt) => ({
                    value: String(opt.id),
                    label: opt.intitule,
                }))}
                placeholder="Toutes"
            />

            <FilterSelect
                label="Zone"
                id="zone-filter"
                value={zoneFilter}
                onChange={setZoneFilter}
                options={zoneOptions.map((opt) => ({
                    value: opt,
                    label: opt,
                }))}
                placeholder="Toutes"
            />

            <FilterSelect
                label="Quartier"
                id="quartier-filter"
                value={quartierFilter}
                onChange={setQuartierFilter}
                options={quartierOptions.map((opt) => ({
                    value: opt,
                    label: opt,
                }))}
                placeholder="Tous"
            />

            <FilterSelect
                label="Statut"
                id="statut-filter"
                value={statutFilter}
                onChange={setStatutFilter}
                options={statutOptions.map((opt) => ({
                    value: opt,
                    label: opt,
                }))}
                placeholder="Tous"
            />
        </div>
    );
}

export default VisiteFilters;
