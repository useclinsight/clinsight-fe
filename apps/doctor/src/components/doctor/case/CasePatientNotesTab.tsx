import Image from 'next/image';

export default function CasePatientNotesTab({ patientNote }: { patientNote: string }) {
  return (
    <div className="p-6 md:p-8">
      <div className="p-5 md:p-6 bg-[#F9FAFB] rounded-2xl border border-[#F0F0F0]">
        <div className="flex items-center gap-2 mb-4">
          <Image src="/assets/dashboard-case-assets/notes.svg" alt="" width={20} height={20} />
          <h3 className="font-bold text-[#1B1B1B]">Patient Note</h3>
        </div>
        <p className="text-sm text-[#5E5E5E] leading-relaxed whitespace-pre-line">{patientNote}</p>
      </div>
    </div>
  );
}
