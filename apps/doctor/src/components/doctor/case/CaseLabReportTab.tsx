import { getInterpretationClasses, type CaseDetailData } from '@/lib/cases-utils';

export default function CaseLabReportTab({
  labReport,
  patientName,
}: {
  labReport: CaseDetailData['labReport'];
  patientName: string;
}) {
  return (
    <div className="p-6 md:p-10">
      <div className="text-center mb-8">
        <h3 className="text-lg md:text-xl font-bold tracking-wide text-primary-blue uppercase">
          Medical Laboratory Report
        </h3>
        <p className="text-sm text-[#6B7280] mt-1">{labReport.hospital}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-8 text-sm">
        <MetaRow label="Patient Name" value={patientName} />
        <MetaRow label="Age/Sex" value={labReport.ageSex} />
        <MetaRow label="Patient ID" value={labReport.patientId} />
        <MetaRow label="Date of Test" value={labReport.dateOfTest} />
        <MetaRow label="Referring Physician" value={labReport.referringPhysician} />
        <div className="sm:col-span-2">
          <MetaRow label="Clinical Indications" value={labReport.clinicalIndications} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {labReport.sections.map((section) => (
          <div key={section.title}>
            <h4 className="text-sm font-bold text-primary-blue mb-3">{section.title}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="text-left py-3 pr-4 font-bold text-[#6B7280] text-xs">Test</th>
                    <th className="text-left py-3 px-4 font-bold text-[#6B7280] text-xs">Result</th>
                    {section.columns.includes('reference') ? (
                      <th className="text-left py-3 px-4 font-bold text-[#6B7280] text-xs">
                        Reference Range
                      </th>
                    ) : null}
                    {section.columns.includes('interpretation') ? (
                      <th className="text-left py-3 pl-4 font-bold text-[#6B7280] text-xs">
                        Interpretation
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {section.metrics.map((metric) => (
                    <tr key={metric.name} className="border-b border-[#F3F4F6] last:border-b-0">
                      <td className="py-3 pr-4 font-medium text-[#111827]">{metric.name}</td>
                      <td className="py-3 px-4 text-[#374151]">{metric.result}</td>
                      {section.columns.includes('reference') ? (
                        <td className="py-3 px-4 text-[#6B7280]">{metric.referenceRange ?? '—'}</td>
                      ) : null}
                      {section.columns.includes('interpretation') ? (
                        <td
                          className={`py-3 pl-4 font-semibold ${getInterpretationClasses(metric.interpretation)}`}
                        >
                          {metric.interpretation}
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-semibold text-[#111827]">{label}: </span>
      <span className="text-[#374151]">{value}</span>
    </p>
  );
}
