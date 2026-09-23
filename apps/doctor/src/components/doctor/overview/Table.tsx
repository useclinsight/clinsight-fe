import { MoreVerticalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';

type Item = {
  id: string;
  avatar: string;
  patientName: string;
  timeSent?: string;
  timeAssigned?: string;
  priority?: string;
  status?: string;
  condition?: string;
};

export default function Table({
  variant,
  items,
}: {
  variant: 'requests' | 'cases';
  items: Item[];
}) {
  const isRequests = variant === 'requests';

  return (
    <div className="rounded-b-[20px] bg-white border border-[#F0F0F0] overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="min-w-220 w-full table-auto text-left">
          <thead className="bg-[#FAFAFA]">
            <tr>
              <th className="px-6 py-4 text-base font-medium text-secondary-3">PATIENTS</th>
              <th className="px-6 py-4 text-base font-medium text-secondary-3">
                {isRequests ? 'TIME SENT' : 'TIME ASSIGNED'}
              </th>
              <th className="px-6 py-4 text-base font-medium text-secondary-3">
                {isRequests ? 'PRIORITY' : 'STATUS'}
              </th>
              <th className="px-6 py-4 text-base font-medium text-secondary-3">CONDITION</th>
              <th className="px-6 py-4 text-base font-medium text-secondary-3 text-right">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: Item) => (
              <tr key={item.id} className="border-t last:border-b">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.avatar}
                      alt={item.patientName}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">{item.patientName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {isRequests ? item.timeSent : item.timeAssigned}
                </td>
                <td className="px-6 py-4">
                  {isRequests ? (
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${item.priority === 'High' ? 'bg-[#FDE3E3] text-[#8F2929]' : item.priority === 'Medium' ? 'bg-[#FEF0DA] text-[#935F07]' : 'bg-[#FDE3E3] text-[#8F2929]'}`}
                    >
                      {item.priority}
                    </span>
                  ) : (
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-[#FEF0DA] text-[#935F07]'}`}
                    >
                      {item.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 font-medium">{item.condition}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    aria-label="row actions"
                    className="p-2 rounded-full hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
