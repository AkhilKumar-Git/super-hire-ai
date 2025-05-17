export function TestComponent() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        Tailwind CSS Test
      </h1>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Is Tailwind Working?
        </h2>
        <p className="text-gray-600 mb-4">
          If you see styled elements below, Tailwind is working correctly!
        </p>
        <div className="space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Primary Button
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            Secondary Button
          </button>
        </div>
      </div>
    </div>
  )
}
