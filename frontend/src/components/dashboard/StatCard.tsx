type Props = {
  title: string;
  value: number;
};

export default function StatCard({
  title,
  value,
}: Props) {
  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col items-center border border-zinc-800">
      <h2 className="text-zinc-500">
        {title}
      </h2>

      <p className="text-4xl font-bold mt-4">
        {value}
      </p>
    </div>
  );
}