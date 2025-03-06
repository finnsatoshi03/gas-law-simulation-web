export const DocumentationSection = ({
  id,
  title,
  subtitle,
  description,
  children,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
}) => (
  <section id={id} className="space-y-4">
    <h2 className="text-xl md:text-3xl font-bold">{title}</h2>
    {subtitle && <h3 className="text-lg md:text-xl">{subtitle}</h3>}
    {description && <p className="text-sm md:text-base">{description}</p>}
    {children}
  </section>
);
