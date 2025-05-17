"use client"
import { motion } from "framer-motion"
import { Search, Users, Briefcase, CheckCircle, ArrowUpRight, Clock, Calendar, UserPlus } from "lucide-react"
import { DashboardCard } from "./components/DashboardCard"

export default function DashboardPage() {
  const stats = [
    { 
      title: 'Total Candidates', 
      value: '1,234', 
      icon: <Users className="h-5 w-5 text-white" />, 
      trend: { value: '+12% from last month', isPositive: true }
    },
    { 
      title: 'Open Positions', 
      value: '24', 
      icon: <Briefcase className="h-5 w-5 text-white" />, 
      trend: { value: '+3 this week', isPositive: true }
    },
    { 
      title: 'Hired This Month', 
      value: '42', 
      icon: <CheckCircle className="h-5 w-5 text-white" />, 
      trend: { value: '+8% from last month', isPositive: true }
    },
    { 
      title: 'Active Searches', 
      value: '18', 
      icon: <Search className="h-5 w-5 text-white" />, 
      trend: { value: '3 new this week', isPositive: true }
    },
  ]

  const recentActivities = [
    { id: 1, title: 'New candidate applied', description: 'John Doe applied for Senior Frontend Developer', time: '10 min ago', icon: <UserPlus className="h-4 w-4" /> },
    { id: 2, title: 'Interview scheduled', description: 'Interview with Sarah Johnson at 2:00 PM', time: '1 hour ago', icon: <Calendar className="h-4 w-4" /> },
    { id: 3, title: 'Status updated', description: 'Position: Senior Backend Developer - In Review', time: '3 hours ago', icon: <Clock className="h-4 w-4" /> },
  ]

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Welcome back! Here's what's happening with your hiring.
          </p>
        </div>
        <button className="flex items-center gap-2 self-start md:self-auto bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
          <span>Generate Report</span>
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DashboardCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <button className="text-sm text-white hover:text-gray-300 transition-colors">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="group flex items-start p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="mt-0.5 p-2 rounded-lg bg-white text-black group-hover:bg-gray-200 transition-colors">
                  {activity.icon}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">{activity.title}</h3>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-lg flex flex-col items-center justify-center h-28 border border-gray-800 hover:bg-gray-900 transition-colors">
              <div className="p-3 bg-white rounded-lg mb-2">
                <UserPlus className="h-5 w-5 text-black" />
              </div>
              <span className="text-sm font-medium text-white">Add Candidate</span>
            </button>
            <button className="p-4 rounded-lg flex flex-col items-center justify-center h-28 border border-gray-800 hover:bg-gray-900 transition-colors">
              <div className="p-3 bg-white rounded-lg mb-2">
                <Briefcase className="h-5 w-5 text-black" />
              </div>
              <span className="text-sm font-medium text-white">New Position</span>
            </button>
            <button className="p-4 rounded-lg flex flex-col items-center justify-center h-28 border border-gray-800 hover:bg-gray-900 transition-colors">
              <div className="p-3 bg-white rounded-lg mb-2">
                <Calendar className="h-5 w-5 text-black" />
              </div>
              <span className="text-sm font-medium text-white">Schedule</span>
            </button>
            <button className="p-4 rounded-lg flex flex-col items-center justify-center h-28 border border-gray-800 hover:bg-gray-900 transition-colors">
              <div className="p-3 bg-white rounded-lg mb-2">
                <CheckCircle className="h-5 w-5 text-black" />
              </div>
              <span className="text-sm font-medium text-white">Review</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
