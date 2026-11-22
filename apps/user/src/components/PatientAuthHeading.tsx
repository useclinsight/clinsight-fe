export function PatientAuthHeading({ title, description }: { title: string; description: string }) {
  return (
    <>
      <h1 className="text-[32px] leading-[1.14] font-bold tracking-tight text-gray-900 lg:text-[38px]">
        {title}
      </h1>
      <p className="mt-2 text-base text-slate-600">{description}</p>
    </>
  );
}
