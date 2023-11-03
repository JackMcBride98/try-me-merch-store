export type AccordionProps = {
  title: string;
  children: React.ReactNode;
};

export const Accordion = ({ title, children }: AccordionProps) => (
  <details className="group rounded-lg open:bg-transparent open:shadow-xl">
    <summary
      className="border-green hover:from-green/20 hover:to-dull w-full rounded-md border p-4 font-medium
      hover:cursor-pointer group-open:border-0 group-open:from-transparent group-open:to-white group-hover:bg-gradient-to-r"
    >
      {title}
    </summary>
    <div className="mt-3 w-full p-4">{children}</div>
  </details>
);
