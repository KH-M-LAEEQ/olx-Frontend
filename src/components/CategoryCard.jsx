import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/search?category=${category.slug}`}
      className="flex flex-col items-center gap-1.5 py-3 px-1 rounded hover:bg-gray-50 transition group"
    >
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl group-hover:bg-yellow-50">
        {category.icon}
      </div>
      <span className="text-xs text-gray-700 font-medium text-center leading-tight group-hover:text-brand">
        {category.name}
      </span>
    </Link>
  )
}
