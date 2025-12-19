type Props = {
    title: string;
  };
  
  export default function Card({ title }: Props) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-2">{title}</h3>
        <div className="text-sm text-gray-500">
          Placeholder content
        </div>
      </div>
    );
  }
  