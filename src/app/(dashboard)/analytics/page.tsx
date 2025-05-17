"use client"
import { motion } from "framer-motion"
import { BarChart, PieChart, LineChart, ArrowUp, ArrowDown, Download, Filter } from "lucide-react"

// Mock data for charts
const hiringFunnelData = {
  labels: ['Applied', 'Screened', 'Interview', 'Offer', 'Hired'],
  data: [120, 80, 45, 20, 12],
  colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#10b981']
}

const timeToHireData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  data: [45, 42, 38, 35, 32, 30],
  color: '#3b82f6'
}

const sourceData = {
  labels: ['LinkedIn', 'Company Website', 'Referrals', 'Job Boards', 'Other'],
  data: [45, 25, 15, 10, 5],
  colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#10b981']
}

const stats = [
  {
    name: 'Total Candidates',
    value: '1,234',
    change: '+12.5%',
    changeType: 'increase',
    icon: BarChart,
  },
  {
    name: 'Hired',
    value: '42',
    change: '+8.2%',
    changeType: 'increase',
    icon: BarChart,
  },
  {
    name: 'Avg. Time to Hire',
    value: '24 days',
    change: '-3 days',
    changeType: 'decrease',
    icon: BarChart,
  },
  {
    name: 'Offer Acceptance',
    value: '78%',
    change: '+5.3%',
    changeType: 'increase',
    icon: BarChart,
  },
]

const HiringFunnel = () => {
  const maxValue = Math.max(...hiringFunnelData.data)
  
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Hiring Funnel</h3>
        <div className="flex space-x-2">
          <select className="rounded-md border border-border bg-background py-1 pl-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button className="rounded-md border border-border bg-background p-1.5 text-foreground hover:bg-accent">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-6 flex h-64 items-end justify-between">
        {hiringFunnelData.labels.map((label, index) => {
          const height = (hiringFunnelData.data[index] / maxValue) * 100
          return (
            <div key={label} className="flex flex-1 flex-col items-center">
              <div className="relative w-full">
                <div 
                  className="w-full rounded-t-sm transition-all duration-500 hover:opacity-90"
                  style={{
                    height: `${height}%`,
                    backgroundColor: hiringFunnelData.colors[index],
                    minHeight: '8px',
                  }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium">
                    {hiringFunnelData.data[index]}
                  </div>
                </div>
              </div>
              <div className="mt-2 w-full text-center text-xs text-muted-foreground">
                {label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const TimeToHire = () => {
  const maxValue = Math.max(...timeToHireData.data)
  
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Time to Hire (Days)</h3>
        <div className="flex items-center space-x-2">
          <span className="flex items-center text-sm text-green-600">
            <ArrowDown className="h-4 w-4" />
            <span>12% from last month</span>
          </span>
        </div>
      </div>
      <div className="mt-6 h-64">
        <div className="flex h-full items-end justify-between">
          {timeToHireData.labels.map((label, index) => {
            const height = (timeToHireData.data[index] / maxValue) * 100
            return (
              <div key={label} className="flex flex-1 flex-col items-center">
                <div className="relative w-6">
                  <div 
                    className="w-full rounded-t-sm bg-gradient-to-t from-primary to-primary/70 transition-all duration-500 hover:opacity-90"
                    style={{
                      height: `${height}%`,
                      minHeight: '8px',
                    }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium">
                      {timeToHireData.data[index]}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const SourceOfHire = () => {
  const total = sourceData.data.reduce((a, b) => a + b, 0)
  
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Source of Hire</h3>
        <select className="rounded-md border border-border bg-background py-1 pl-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>This year</option>
        </select>
      </div>
      <div className="mt-6 flex flex-col items-center justify-between md:flex-row">
        <div className="relative h-64 w-64">
          <PieChart className="h-full w-full" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-sm text-muted-foreground">Total Hires</div>
          </div>
        </div>
        <div className="mt-6 space-y-4 md:mt-0">
          {sourceData.labels.map((label, index) => {
            const percentage = Math.round((sourceData.data[index] / total) * 100)
            return (
              <div key={label} className="flex items-center">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: sourceData.colors[index] }}
                />
                <div className="ml-2 w-32 text-sm font-medium">{label}</div>
                <div className="ml-4 w-12 text-right text-sm font-medium">{percentage}%</div>
                <div className="ml-2 h-2 w-20 overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-full rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: sourceData.colors[index],
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Track and analyze your hiring metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-lg border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <div className="mt-1 flex items-baseline">
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <span 
                    className={`ml-2 flex items-center text-xs font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.changeType === 'increase' ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    <span className="ml-0.5">{stat.change}</span>
                  </span>
                </div>
              </div>
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <HiringFunnel />
        <TimeToHire />
      </div>
      
      <SourceOfHire />
    </div>
  )
}
