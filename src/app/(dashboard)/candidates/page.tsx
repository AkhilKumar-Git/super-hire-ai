"use client"
import { motion } from "framer-motion"
import { Search, Filter, ChevronDown, Mail, Phone, Star, MoreHorizontal, Download, FileText, UserPlus } from "lucide-react"

type Status = 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected'

type Candidate = {
  id: number
  name: string
  email: string
  phone: string
  position: string
  experience: string
  status: Status
  match: number
  lastContact: string
  isFavorite: boolean
}

const statusColors: Record<Status, string> = {
  'New': 'bg-white text-black',
  'Screening': 'bg-white text-black',
  'Interview': 'bg-white text-black',
  'Offer': 'bg-white text-black',
  'Hired': 'bg-white text-black',
  'Rejected': 'bg-white text-black',
}

const candidates: Candidate[] = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 123-4567',
    position: 'Senior Frontend Engineer',
    experience: '8 years',
    status: 'Interview',
    match: 94,
    lastContact: '2 days ago',
    isFavorite: true,
  },
  {
    id: 2,
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '(555) 234-5678',
    position: 'Machine Learning Engineer',
    experience: '5 years',
    status: 'Screening',
    match: 88,
    lastContact: '1 day ago',
    isFavorite: false,
  },
  {
    id: 3,
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    phone: '(555) 345-6789',
    position: 'Full Stack Developer',
    experience: '6 years',
    status: 'New',
    match: 92,
    lastContact: 'Just now',
    isFavorite: true,
  },
  {
    id: 4,
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '(555) 456-7890',
    position: 'Data Scientist',
    experience: '4 years',
    status: 'Offer',
    match: 85,
    lastContact: '1 hour ago',
    isFavorite: false,
  },
  {
    id: 5,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '(555) 567-8901',
    position: 'DevOps Engineer',
    experience: '7 years',
    status: 'Interview',
    match: 89,
    lastContact: '3 hours ago',
    isFavorite: false,
  },
]

export default function CandidatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Candidates</h1>
          <p className="text-gray-400">Manage and track your candidate pipeline</p>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center rounded-md border border-gray-800 bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-gray-200"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Candidate
          </motion.button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-lg border border-gray-800 bg-black p-4 shadow-sm">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative flex-1 md:max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-800 bg-black py-2 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Search candidates..."
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              className="rounded-md border border-gray-800 bg-black py-2 pl-3 pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              defaultValue="all"
            >
              <option value="all" className="bg-black text-white">All Status</option>
              <option value="new" className="bg-black text-white">New</option>
              <option value="screening" className="bg-black text-white">Screening</option>
              <option value="interview" className="bg-black text-white">Interview</option>
              <option value="offer" className="bg-black text-white">Offer</option>
              <option value="hired" className="bg-black text-white">Hired</option>
              <option value="rejected" className="bg-black text-white">Rejected</option>
            </select>
            <button className="inline-flex items-center rounded-md border border-gray-800 bg-black px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="overflow-hidden rounded-lg border border-gray-800 bg-black shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  <div className="flex items-center">
                    <span>Candidate</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Match
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Last Contact
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-black">
              {candidates.map((candidate, index) => (
                <motion.tr 
                  key={candidate.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-900"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-black text-sm font-medium">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-white">{candidate.name}</p>
                          {candidate.isFavorite && (
                            <Star className="ml-1 h-3.5 w-3.5 text-white fill-white" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <a href={`mailto:${candidate.email}`} className="hover:text-white hover:underline">
                            <Mail className="inline h-3 w-3 mr-1" />
                            <span>Email</span>
                          </a>
                          <span>•</span>
                          <a href={`tel:${candidate.phone}`} className="hover:text-white hover:underline">
                            <Phone className="inline h-3 w-3 mr-1" />
                            <span>Call</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{candidate.position}</p>
                      <p className="text-xs text-gray-400">{candidate.experience} experience</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[candidate.status]}`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-white"></div>
                      <span className="text-sm font-medium text-white">{candidate.match}%</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                    {candidate.lastContact}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-400">
          Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">5</span> of{' '}
          <span className="font-medium text-white">24</span> candidates
        </div>
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center rounded-md border border-gray-800 bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="inline-flex items-center rounded-md border border-gray-800 bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-900">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
