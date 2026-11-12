// ============================================================
// RYRACH SYSTEMS — AGENTS PORTAL ROUTES
// Holds both agent pages under /agents and /agents/dashboard.
// ============================================================
import { Routes, Route } from 'react-router-dom'
import AgentEntry from './AgentEntry'
import AgentDashboard from './AgentDashboard'

export default function AgentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AgentEntry />} />
      <Route path="/dashboard" element={<AgentDashboard />} />
      <Route path="*" element={<AgentEntry />} />
    </Routes>
  )
}
