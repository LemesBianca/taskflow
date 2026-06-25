interface Props {
    priority: "LOW" | "MEDIUM" | "HIGH";
}

function getPriorityClasses(priority: "LOW" | "MEDIUM" | "HIGH") {
    if (priority === "HIGH") return "bg-rose-100 text-rose-700 border border-rose-200";
    if (priority === "MEDIUM") return "bg-amber-100 text-amber-700 border border-amber-200";
    return "bg-sky-100 text-sky-700 border border-sky-200";
}

export default function PriorityBadge({
    priority,
}: Props) {
    const colorClass = getPriorityClasses(priority);

    return (
        <span className={`
            px-3
            py-1
            rounded-full
            text-sm
            font-medium
            ${colorClass}
        `}>
            {priority}
        </span>
    );
}