import { Link } from 'react-router-dom';

interface Props {
  title: string;
  href: string;
}

const QuickAccessCard = ({ title, href }: Props) => (
  <Link to={href}>
    <div className="bg-white p-4 shadow rounded hover:shadow-md transition">
      <p className="font-semibold text-blue-600">{title}</p>
    </div>
  </Link>
);

export default QuickAccessCard;
