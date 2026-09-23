interface Highlight {
  title: string;
  description: string;
}

const HIGHLIGHTS: Highlight[] = [
  {
    title: 'Full Blood Count (FBC)',
    description:
      'How hydration levels, immune function, and conditions like anemia or chronic fatigue show up in routine blood work.',
  },
  {
    title: 'Kidney Health Markers',
    description:
      'Understanding how your kidneys filter waste and what abnormal levels may indicate about kidney health.',
  },
  {
    title: 'Blood Sugar Tests',
    description:
      'The difference between test types and how early changes can signal pre-diabetes before symptoms appear.',
  },
  {
    title: 'Lipid Profile (Cholesterol)',
    description:
      'Breaking down lipids such as HDL and LDL and explaining how their balance affects overall cardiovascular health.',
  },
  {
    title: 'Understanding Lab Ranges',
    description:
      'How lab reference ranges vary between locations and why small differences in values (even 1–2 mg/dL) can change interpretation.',
  },
];

type GuideHighlightsProps = {
  heading?: string;
  items?: readonly Highlight[];
};

export function GuideHighlights({ heading, items = HIGHLIGHTS }: GuideHighlightsProps) {
  return (
    <section className="container mx-auto px-6 py-12 lg:px-12 lg:py-16">
      <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {heading ?? 'What You Will Learn Inside This Guide'}
      </h2>

      <ul className="mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-5 lg:mt-12">
        {items.map((item) => (
          <li
            key={item.title}
            className="w-full rounded-2xl bg-[#EAF1FB] p-6 text-center sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)]"
          >
            <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
