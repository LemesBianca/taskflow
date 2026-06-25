interface Props {
    status: "TODO" | "IN_PROGRESS" | "DONE";
}

function getStatusClasses(status: "TODO" | "IN_PROGRESS" | "DONE") {
    if (status === "DONE") return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    if (status === "IN_PROGRESS") return "bg-amber-100 text-amber-700 border border-amber-200";
    return "bg-blue-100 text-blue-700 border border-blue-200";
}

export default function StatusBadge({
    status,
}: Props) {
    const colorClass = getStatusClasses(status);

    return (
        <span className={`
            px-3
            py-1
            rounded-full
            text-sm
            font-medium
            ${colorClass}
        `}>
            {status}
        </span>
    );
}