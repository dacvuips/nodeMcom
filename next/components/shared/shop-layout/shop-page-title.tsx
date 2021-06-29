interface PropsType extends ReactProps {
  title: string;
  subtitle?: string;
}
export function ShopPageTitle({ title, subtitle }: PropsType) {
  return (
    <div>
      <h4 className="text-primary font-bold text-3xl">{title}</h4>
      {subtitle && <h6 className="text-gray-700 mt-1">{subtitle}</h6>}
    </div>
  );
}
