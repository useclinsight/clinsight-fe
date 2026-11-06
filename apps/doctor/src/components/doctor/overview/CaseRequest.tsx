import { Overview } from '@/services/doctor';
import Table from './Table';

export default function CaseRequest({ overview }: { overview: Overview | null }) {
  const requests = overview?.caseRequests ?? [];

  return (
    <div>
      <div className="flex items-center bg-white p-5 rounded-t-[20px] border border-[#F0F0F0] gap-2">
        <h3 className="text-lg md:text-xl font-medium">Case Requests </h3>
        <span className="flex items-center justify-center w-5 h-5 bg-[#1565C0] text-white rounded-full text-sm">
          {requests.length}
        </span>
      </div>

      <Table variant="requests" items={requests} />
    </div>
  );
}
