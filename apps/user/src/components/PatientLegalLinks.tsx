export function PatientLegalLinks() {
  return (
    <footer className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
      <a
        href="https://www.useclinsight.com/terms-and-conditions"
        className="text-primary-blue underline underline-offset-2"
      >
        Terms and Conditions
      </a>
      <span aria-hidden="true" className="text-slate-500">
        ·
      </span>
      <a
        href="https://www.useclinsight.com/privacy-policy"
        className="text-primary-blue underline underline-offset-2"
      >
        Privacy Policy
      </a>
    </footer>
  );
}
