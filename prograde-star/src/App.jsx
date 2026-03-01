import React, { useState } from 'react';
import {
  LayoutDashboard,
  History,
  Database,
  Settings,
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Building2,
  Search,
  Filter,
  Download,
  ChevronRight,
  ShieldAlert,
  Check,
  Plus,
  X,
  TrendingUp,
  XCircle,
  Users,
  DollarSign
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_COMPANIES = ['Global Tech Corp', 'Acme EMEA', 'Acme APAC', 'Stark Industries', 'Wayne Enterprises'];
const MOCK_MONTHS = [
  'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025',
  'January 2026', 'February 2026', 'March 2026'
];

const STATUS_CONFIG = {
  'Draft & data quality check': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: AlertCircle },
  'Approval in progress': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: RefreshCw },
  'Payroll approved': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
  'Submission of payment': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Database },
};

const INITIAL_APPROVAL_DATA = [
  { id: 'PAY-001', company: 'Global Tech Corp', month: 'February 2026', employees: 1250, totalAmount: '$5,240,000', status: 'Approval in progress', lastUpdated: '2 hours ago' },
  { id: 'PAY-002', company: 'Acme EMEA', month: 'February 2026', employees: 840, totalAmount: '€3,100,000', status: 'Draft & data quality check', lastUpdated: '5 hours ago' },
  { id: 'PAY-003', company: 'Acme APAC', month: 'February 2026', employees: 2100, totalAmount: '$4,800,000', status: 'Payroll approved', lastUpdated: '1 day ago' },
  { id: 'PAY-004', company: 'Stark Industries', month: 'January 2026', employees: 500, totalAmount: '$2,100,000', status: 'Submission of payment', lastUpdated: '3 days ago' },
  { id: 'PAY-005', company: 'Wayne Enterprises', month: 'February 2026', employees: 320, totalAmount: '$1,500,000', status: 'Draft & data quality check', lastUpdated: '10 mins ago' },
  { id: 'PAY-006', company: 'Global Tech Corp', month: 'January 2026', employees: 1245, totalAmount: '$5,210,000', status: 'Submission of payment', lastUpdated: '15 days ago' },
  { id: 'PAY-007', company: 'Acme EMEA', month: 'January 2026', employees: 838, totalAmount: '€3,080,000', status: 'Payroll approved', lastUpdated: '18 days ago' },
  { id: 'PAY-008', company: 'Acme APAC', month: 'January 2026', employees: 2095, totalAmount: '$4,750,000', status: 'Submission of payment', lastUpdated: '12 days ago' },
  { id: 'PAY-009', company: 'Wayne Enterprises', month: 'January 2026', employees: 318, totalAmount: '$1,480,000', status: 'Submission of payment', lastUpdated: '20 days ago' },
  // New July 2025 - Dec 2025 Data
  { id: 'PAY-010', company: 'Global Tech Corp', month: 'December 2025', employees: 1240, totalAmount: '$5,180,000', status: 'Submission of payment', lastUpdated: '1 month ago' },
  { id: 'PAY-011', company: 'Stark Industries', month: 'December 2025', employees: 495, totalAmount: '$2,080,000', status: 'Submission of payment', lastUpdated: '1 month ago' },
  { id: 'PAY-012', company: 'Wayne Enterprises', month: 'November 2025', employees: 315, totalAmount: '$1,450,000', status: 'Submission of payment', lastUpdated: '2 months ago' },
  { id: 'PAY-013', company: 'Acme APAC', month: 'November 2025', employees: 2080, totalAmount: '$4,700,000', status: 'Submission of payment', lastUpdated: '2 months ago' },
  { id: 'PAY-014', company: 'Stark Industries', month: 'October 2025', employees: 490, totalAmount: '$2,050,000', status: 'Submission of payment', lastUpdated: '3 months ago' },
  { id: 'PAY-015', company: 'Acme EMEA', month: 'October 2025', employees: 830, totalAmount: '€3,050,000', status: 'Submission of payment', lastUpdated: '3 months ago' },
  { id: 'PAY-016', company: 'Acme APAC', month: 'September 2025', employees: 2050, totalAmount: '$4,600,000', status: 'Submission of payment', lastUpdated: '4 months ago' },
  { id: 'PAY-017', company: 'Global Tech Corp', month: 'September 2025', employees: 1220, totalAmount: '$5,050,000', status: 'Submission of payment', lastUpdated: '4 months ago' },
  { id: 'PAY-018', company: 'Acme EMEA', month: 'August 2025', employees: 825, totalAmount: '€3,000,000', status: 'Submission of payment', lastUpdated: '5 months ago' },
  { id: 'PAY-019', company: 'Wayne Enterprises', month: 'August 2025', employees: 310, totalAmount: '$1,400,000', status: 'Submission of payment', lastUpdated: '5 months ago' },
  { id: 'PAY-020', company: 'Stark Industries', month: 'July 2025', employees: 485, totalAmount: '$2,000,000', status: 'Submission of payment', lastUpdated: '6 months ago' },
  { id: 'PAY-021', company: 'Global Tech Corp', month: 'July 2025', employees: 1200, totalAmount: '$4,950,000', status: 'Submission of payment', lastUpdated: '6 months ago' },
];

const MOCK_AUDIT_LOGS = [
  // February 2026 & January 2026 (Existing + New)
  { id: 1, date: '2026-02-27 10:30 AM', user: 'jane.doe@company.com', action: 'Initiated Email Approval', details: 'Sent approval request to Finance Director for Acme APAC (Feb 2026)', entity: 'Acme APAC', month: 'February 2026' },
  { id: 2, date: '2026-02-26 04:15 PM', user: 'system_ec_sync', action: 'Data Import', details: 'Successfully synchronized 2100 employee records from EC Payroll for Acme APAC', entity: 'Acme APAC', month: 'February 2026' },
  { id: 3, date: '2026-02-26 11:20 AM', user: 'john.smith@company.com', action: 'Status Change', details: 'Changed Stark Industries (Jan 2026) status to Submission of payment', entity: 'Stark Industries', month: 'January 2026' },
  { id: 4, date: '2026-02-25 09:00 AM', user: 'jane.doe@company.com', action: 'Approved Payroll', details: 'Approved Global Tech Corp (Jan 2026) payroll run', entity: 'Global Tech Corp', month: 'January 2026' },
  { id: 5, date: '2026-02-27 01:15 PM', user: 'system_ec_sync', action: 'Data Import', details: 'Initial data pull from EC Payroll', entity: 'Acme EMEA', month: 'February 2026' },
  { id: 6, date: '2026-02-27 02:00 PM', user: 'finance_admin@company.com', action: 'Status Change', details: 'Marked Wayne Enterprises (Feb 2026) for Draft & data quality check', entity: 'Wayne Enterprises', month: 'February 2026' },
  { id: 7, date: '2026-01-25 10:00 AM', user: 'system_ec_sync', action: 'Data Import', details: 'Successfully synchronized 838 records', entity: 'Acme EMEA', month: 'January 2026' },
  { id: 8, date: '2026-01-28 03:45 PM', user: 'john.smith@company.com', action: 'Approved Payroll', details: 'Approved Acme EMEA (Jan 2026) payroll run', entity: 'Acme EMEA', month: 'January 2026' },
  { id: 9, date: '2026-01-29 09:30 AM', user: 'jane.doe@company.com', action: 'Released for Payment', details: 'Released funds for Wayne Enterprises', entity: 'Wayne Enterprises', month: 'January 2026' },
  { id: 10, date: '2026-01-30 11:00 AM', user: 'finance_admin@company.com', action: 'Released for Payment', details: 'Released funds for Acme APAC', entity: 'Acme APAC', month: 'January 2026' },

  // December 2025
  { id: 11, date: '2025-12-20 08:30 AM', user: 'system_ec_sync', action: 'Data Import', details: 'Imported Dec payroll data', entity: 'Global Tech Corp', month: 'December 2025' },
  { id: 12, date: '2025-12-22 02:15 PM', user: 'jane.doe@company.com', action: 'Approved Payroll', details: 'Approved payroll for Global Tech Corp', entity: 'Global Tech Corp', month: 'December 2025' },
  { id: 13, date: '2025-12-23 10:00 AM', user: 'john.smith@company.com', action: 'Released for Payment', details: 'Payment submitted for Global Tech Corp', entity: 'Global Tech Corp', month: 'December 2025' },
  { id: 14, date: '2025-12-24 09:00 AM', user: 'finance_admin@company.com', action: 'Released for Payment', details: 'Payment submitted for Stark Industries', entity: 'Stark Industries', month: 'December 2025' },

  // November 2025
  { id: 15, date: '2025-11-25 11:30 AM', user: 'jane.doe@company.com', action: 'Initiated Email Approval', details: 'Sent approval request for Wayne Enterprises', entity: 'Wayne Enterprises', month: 'November 2025' },
  { id: 16, date: '2025-11-26 04:00 PM', user: 'john.smith@company.com', action: 'Approved Payroll', details: 'Approved Wayne Enterprises (Nov 2025) payroll run', entity: 'Wayne Enterprises', month: 'November 2025' },
  { id: 17, date: '2025-11-28 01:20 PM', user: 'finance_admin@company.com', action: 'Released for Payment', details: 'Payment submitted for Acme APAC', entity: 'Acme APAC', month: 'November 2025' },

  // October 2025
  { id: 18, date: '2025-10-24 10:15 AM', user: 'system_ec_sync', action: 'Data Import', details: 'Imported Oct payroll data', entity: 'Acme EMEA', month: 'October 2025' },
  { id: 19, date: '2025-10-26 09:45 AM', user: 'jane.doe@company.com', action: 'Approved Payroll', details: 'Approved Stark Industries', entity: 'Stark Industries', month: 'October 2025' },
  { id: 20, date: '2025-10-28 03:30 PM', user: 'john.smith@company.com', action: 'Released for Payment', details: 'Payment submitted for Stark Industries', entity: 'Stark Industries', month: 'October 2025' },
  { id: 21, date: '2025-10-29 11:00 AM', user: 'finance_admin@company.com', action: 'Released for Payment', details: 'Payment submitted for Acme EMEA', entity: 'Acme EMEA', month: 'October 2025' },

  // September 2025
  { id: 22, date: '2025-09-25 08:45 AM', user: 'system_ec_sync', action: 'Data Import', details: 'Initial data pull from EC Payroll', entity: 'Global Tech Corp', month: 'September 2025' },
  { id: 23, date: '2025-09-27 02:30 PM', user: 'jane.doe@company.com', action: 'Approved Payroll', details: 'Approved Global Tech Corp', entity: 'Global Tech Corp', month: 'September 2025' },
  { id: 24, date: '2025-09-28 10:15 AM', user: 'john.smith@company.com', action: 'Released for Payment', details: 'Payment submitted for Acme APAC', entity: 'Acme APAC', month: 'September 2025' },

  // August 2025
  { id: 25, date: '2025-08-25 09:30 AM', user: 'jane.doe@company.com', action: 'Approved Payroll', details: 'Approved Wayne Enterprises', entity: 'Wayne Enterprises', month: 'August 2025' },
  { id: 26, date: '2025-08-28 01:45 PM', user: 'finance_admin@company.com', action: 'Released for Payment', details: 'Payment submitted for Acme EMEA', entity: 'Acme EMEA', month: 'August 2025' },
  { id: 27, date: '2025-08-29 11:30 AM', user: 'john.smith@company.com', action: 'Released for Payment', details: 'Payment submitted for Wayne Enterprises', entity: 'Wayne Enterprises', month: 'August 2025' },

  // July 2025
  { id: 28, date: '2025-07-24 10:00 AM', user: 'system_ec_sync', action: 'Data Import', details: 'Imported Jul payroll data', entity: 'Stark Industries', month: 'July 2025' },
  { id: 29, date: '2025-07-26 09:15 AM', user: 'jane.doe@company.com', action: 'Approved Payroll', details: 'Approved Stark Industries', entity: 'Stark Industries', month: 'July 2025' },
  { id: 30, date: '2025-07-28 02:00 PM', user: 'finance_admin@company.com', action: 'Released for Payment', details: 'Payment submitted for Global Tech Corp', entity: 'Global Tech Corp', month: 'July 2025' },
  { id: 31, date: '2025-07-29 10:45 AM', user: 'john.smith@company.com', action: 'Released for Payment', details: 'Payment submitted for Stark Industries', entity: 'Stark Industries', month: 'July 2025' },
];

const MOCK_DQ_ISSUES = [
  { id: 'DQ-101', type: 'Missing Bank Details', severity: 'High', employee: 'E10452', entity: 'Acme EMEA', description: 'IBAN missing for new hire.' },
  { id: 'DQ-102', type: 'Negative Net Pay', severity: 'Critical', employee: 'E09381', entity: 'Global Tech Corp', description: 'Deductions exceed gross pay for current period.' },
  { id: 'DQ-103', type: 'Unusual Overtime', severity: 'Medium', employee: 'E11200', entity: 'Acme APAC', description: 'Overtime hours exceed 50% of standard working hours.' },
];

const MOCK_ORG_UNITS = [
  { id: 1, region: 'Americas', country: 'United States', legalEntity: 'Global Tech US LLC', reportingUnit: 'US-East Operations' },
  { id: 2, region: 'Americas', country: 'United States', legalEntity: 'Global Tech US LLC', reportingUnit: 'US-West Operations' },
  { id: 3, region: 'EMEA', country: 'Germany', legalEntity: 'Acme GmbH', reportingUnit: 'Berlin HQ' },
  { id: 4, region: 'APAC', country: 'Singapore', legalEntity: 'Acme APAC Pte Ltd', reportingUnit: 'SG Sales' },
];

// --- UI COMPONENTS ---

const Badge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {status}
    </span>
  );
};

// --- VIEWS ---

const DashboardView = () => {
  const [data, setData] = useState(INITIAL_APPROVAL_DATA);
  const [filterMonth, setFilterMonth] = useState('February 2026');
  const [selectedRun, setSelectedRun] = useState(null);

  const filteredData = data.filter(item => item.month === filterMonth);

  const handleAction = (id, newStatus) => {
    setData(data.map(item => item.id === id ? { ...item, status: newStatus } : item));
    setSelectedRun(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Payroll Approval Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">Track and manage payroll approvals across all entities.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            className="text-sm border-none bg-transparent focus:ring-0 text-slate-700 font-medium"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            {MOCK_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.keys(STATUS_CONFIG).map((status) => {
          const count = filteredData.filter(d => d.status === status).length;
          const config = STATUS_CONFIG[status];
          const Icon = config.icon;
          return (
            <div key={status} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[120px]">
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2.5 rounded-lg shrink-0 ${config.color.split(' ')[0]}`}>
                  <Icon className={`w-5 h-5 ${config.color.split(' ')[1]}`} />
                </div>
                <p className="text-2xl font-bold text-slate-800">{count}</p>
              </div>
              <p className="text-sm font-medium text-slate-500 leading-snug">{status}</p>
            </div>
          );
        })}
      </div>

      {/* Approval Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-semibold text-slate-800">Entity Approval Status</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search entity..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Run ID</th>
                <th className="p-4 font-medium">Company</th>
                <th className="p-4 font-medium">Employees</th>
                <th className="p-4 font-medium">Total Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-blue-600">{row.id}</td>
                  <td className="p-4 flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-slate-400" />
                    {row.company}
                  </td>
                  <td className="p-4">{row.employees.toLocaleString()}</td>
                  <td className="p-4 font-medium">{row.totalAmount}</td>
                  <td className="p-4">
                    <Badge status={row.status} />
                  </td>
                  <td className="p-4">
                    {row.status === 'Draft & data quality check' && (
                      <button
                        onClick={() => setSelectedRun(row)}
                        className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 mr-1.5" />
                        Req. Approval
                      </button>
                    )}
                    {row.status === 'Approval in progress' && (
                      <button
                        onClick={() => setSelectedRun(row)}
                        className="flex items-center text-orange-600 hover:text-orange-800 font-medium text-xs bg-orange-50 px-3 py-1.5 rounded-md transition-colors"
                      >
                        <Check className="w-3.5 h-3.5 mr-1.5" />
                        Force Approve
                      </button>
                    )}
                    {row.status === 'Payroll approved' && (
                      <button
                        onClick={() => setSelectedRun(row)}
                        className="flex items-center text-emerald-600 hover:text-emerald-800 font-medium text-xs bg-emerald-50 px-3 py-1.5 rounded-md transition-colors"
                      >
                        <Database className="w-3.5 h-3.5 mr-1.5" />
                        Release for Payment
                      </button>
                    )}
                    {row.status === 'Submission of payment' && (
                      <button
                        onClick={() => setSelectedRun(row)}
                        className="flex items-center text-slate-600 hover:text-slate-800 font-medium text-xs bg-slate-100 px-3 py-1.5 rounded-md transition-colors"
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">No payroll runs found for this period.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Details / Action Modal */}
      {selectedRun && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedRun.company} - {selectedRun.month}</h3>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">Run ID: {selectedRun.id} • Last updated {selectedRun.lastUpdated}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge status={selectedRun.status} />
                <button onClick={() => setSelectedRun(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
              {/* Quick KPI Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center text-slate-500 mb-2">
                    <Users className="w-4 h-4 mr-1.5" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Headcount</span>
                  </div>
                  <p className="text-xl font-bold text-slate-800">{selectedRun.employees.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center text-slate-500 mb-2">
                    <DollarSign className="w-4 h-4 mr-1.5" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Payout</span>
                  </div>
                  <p className="text-xl font-bold text-slate-800">{selectedRun.totalAmount}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center text-slate-500 mb-2">
                    <TrendingUp className="w-4 h-4 mr-1.5" />
                    <span className="text-xs font-semibold uppercase tracking-wider">MoM Variance</span>
                  </div>
                  <p className="text-xl font-bold text-green-600">+1.24%</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center text-slate-500 mb-2">
                    <ShieldAlert className="w-4 h-4 mr-1.5" />
                    <span className="text-xs font-semibold uppercase tracking-wider">DQ Issues</span>
                  </div>
                  <p className="text-xl font-bold text-slate-800">
                    0 <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded ml-1 border border-green-200">Clean</span>
                  </p>
                </div>
              </div>

              {/* Details & Comments */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 bg-white">
                      <h4 className="font-semibold text-slate-800">Payroll Financial Summary</h4>
                    </div>
                    <div className="p-0">
                      <table className="w-full text-sm">
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50"><td className="py-3 px-5 text-slate-600">Base Salary</td><td className="py-3 px-5 text-right font-medium text-slate-800">82%</td></tr>
                          <tr className="hover:bg-slate-50"><td className="py-3 px-5 text-slate-600">Overtime & Bonuses</td><td className="py-3 px-5 text-right font-medium text-slate-800">6%</td></tr>
                          <tr className="hover:bg-slate-50"><td className="py-3 px-5 text-slate-600">Employer Taxes</td><td className="py-3 px-5 text-right font-medium text-slate-800">8%</td></tr>
                          <tr className="hover:bg-slate-50"><td className="py-3 px-5 text-slate-600">Benefits & Contributions</td><td className="py-3 px-5 text-right font-medium text-slate-800">4%</td></tr>
                        </tbody>
                        <tfoot className="bg-slate-50 border-t border-slate-200">
                          <tr>
                            <td className="py-3 px-5 font-semibold text-slate-800">Total Run Value</td>
                            <td className="py-3 px-5 text-right font-bold text-blue-600">{selectedRun.totalAmount}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full flex flex-col">
                    <h4 className="font-semibold text-slate-800 mb-3">Reviewer Comments</h4>
                    <textarea
                      className="w-full flex-1 border border-slate-200 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 bg-slate-50 mb-3 resize-none min-h-[100px]"
                      placeholder="Add audit notes, justifications, or explanations here..."
                    ></textarea>
                    <div className="text-xs text-slate-500 flex items-start mt-auto">
                      <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
                      Notes will be permanently attached to the compliance audit log.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end space-x-3 shrink-0">
              <button
                onClick={() => setSelectedRun(null)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-sm"
              >
                Cancel
              </button>

              {selectedRun.status !== 'Submission of payment' && (
                <>
                  {selectedRun.status !== 'Payroll approved' && (
                    <button
                      onClick={() => handleAction(selectedRun.id, 'Draft & data quality check')}
                      className="px-5 py-2.5 text-sm font-medium text-red-600 bg-white hover:bg-red-50 border border-red-200 rounded-lg transition-colors flex items-center shadow-sm"
                    >
                      <XCircle className="w-4 h-4 mr-2" /> Reject / Re-run
                    </button>
                  )}

                  {selectedRun.status === 'Draft & data quality check' && (
                    <button
                      onClick={() => handleAction(selectedRun.id, 'Approval in progress')}
                      className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-lg transition-colors flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-2" /> Request Email Approval
                    </button>
                  )}

                  {selectedRun.status === 'Approval in progress' && (
                    <button
                      onClick={() => handleAction(selectedRun.id, 'Payroll approved')}
                      className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-sm rounded-lg transition-colors flex items-center"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Approve Payroll
                    </button>
                  )}

                  {selectedRun.status === 'Payroll approved' && (
                    <button
                      onClick={() => handleAction(selectedRun.id, 'Submission of payment')}
                      className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm rounded-lg transition-colors flex items-center"
                    >
                      <Database className="w-4 h-4 mr-2" /> Release for Payment
                    </button>
                  )}
                </>
              )}

              {selectedRun.status === 'Submission of payment' && (
                <button
                  onClick={() => setSelectedRun(null)}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 shadow-sm rounded-lg transition-colors"
                >
                  Close Viewer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AuditLogView = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('All');
  const [filterEntity, setFilterEntity] = useState('All');

  const filteredLogs = MOCK_AUDIT_LOGS.filter(log => {
    const matchPeriod = filterPeriod === 'All' || log.month === filterPeriod;
    const matchEntity = filterEntity === 'All' || log.entity === filterEntity;
    return matchPeriod && matchEntity;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">Historical Approval Log</h2>
        <p className="text-sm text-slate-500 mt-1">Immutable record of all payroll actions for audit and compliance.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 relative">
          <div className="flex space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-3 py-1.5 text-sm border rounded-md transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'}`}
              >
                <Filter className="w-4 h-4 mr-2" /> Filter {(filterPeriod !== 'All' || filterEntity !== 'All') && <span className="ml-1.5 w-2 h-2 rounded-full bg-blue-600"></span>}
              </button>

              {/* Filter Dropdown */}
              {showFilters && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Period</label>
                      <select
                        value={filterPeriod}
                        onChange={(e) => setFilterPeriod(e.target.value)}
                        className="w-full border border-slate-300 rounded-md text-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="All">All Periods</option>
                        {MOCK_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Entity</label>
                      <select
                        value={filterEntity}
                        onChange={(e) => setFilterEntity(e.target.value)}
                        className="w-full border border-slate-300 rounded-md text-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="All">All Entities</option>
                        {MOCK_COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    {(filterPeriod !== 'All' || filterEntity !== 'All') && (
                      <button
                        onClick={() => { setFilterPeriod('All'); setFilterEntity('All'); }}
                        className="w-full text-xs text-slate-500 hover:text-slate-800 font-medium py-1"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button className="flex items-center px-3 py-1.5 text-sm border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-600">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">User / System</th>
                <th className="p-4 font-medium">Entity & Period</th>
                <th className="p-4 font-medium">Action Type</th>
                <th className="p-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 whitespace-nowrap text-slate-500">{log.date}</td>
                  <td className="p-4 font-medium">{log.user}</td>
                  <td className="p-4">
                    <div className="text-slate-800 font-medium">{log.entity}</div>
                    <div className="text-xs text-slate-500">{log.month}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs border border-slate-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{log.details}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 bg-white">No logs match the selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DataGovernanceView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">Data Quality Governance</h2>
        <p className="text-sm text-slate-500 mt-1">Validate and govern payroll results exported from EC Payroll system.</p>
      </div>
      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm">
        <RefreshCw className="w-4 h-4 mr-2" /> Sync from EC Payroll
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="text-4xl font-bold text-green-500 mb-2">98.5%</div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Overall Data Quality</p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="text-4xl font-bold text-orange-500 mb-2">{MOCK_DQ_ISSUES.length}</div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Anomalies</p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="text-4xl font-bold text-blue-500 mb-2">12</div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Validation Rules Active</p>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
      <div className="p-5 border-b border-slate-200 bg-slate-50/50">
        <h3 className="font-semibold text-slate-800 flex items-center">
          <ShieldAlert className="w-5 h-5 mr-2 text-orange-500" />
          Detected Data Anomalies
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">Issue ID</th>
              <th className="p-4 font-medium">Severity</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Entity / Emp</th>
              <th className="p-4 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
            {MOCK_DQ_ISSUES.map((issue) => (
              <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-900">{issue.id}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${issue.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                      issue.severity === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                    {issue.severity}
                  </span>
                </td>
                <td className="p-4 font-medium">{issue.type}</td>
                <td className="p-4">
                  <div className="text-xs">{issue.entity}</div>
                  <div className="text-slate-500 text-xs">{issue.employee}</div>
                </td>
                <td className="p-4 text-slate-600 max-w-md">{issue.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const ConfigurationView = () => {
  const [orgUnits, setOrgUnits] = useState(MOCK_ORG_UNITS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUnit, setNewUnit] = useState({ region: 'Americas', country: '', legalEntity: '', reportingUnit: '' });

  const handleSaveUnit = () => {
    if (!newUnit.country || !newUnit.legalEntity || !newUnit.reportingUnit) {
      alert("Please fill in all fields.");
      return;
    }
    const newRecord = {
      id: Date.now(),
      ...newUnit
    };
    setOrgUnits([...orgUnits, newRecord]);
    setIsAddModalOpen(false);
    setNewUnit({ region: 'Americas', country: '', legalEntity: '', reportingUnit: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Configuration Console</h2>
          <p className="text-sm text-slate-500 mt-1">Manage organizational hierarchy and structural setup.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Org Unit
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex space-x-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Filter by Region</label>
            <select className="w-full border border-slate-300 rounded-md text-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Regions</option>
              <option>Americas</option>
              <option>EMEA</option>
              <option>APAC</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Search Legal Entity</label>
            <input type="text" placeholder="Type to search..." className="w-full border border-slate-300 rounded-md text-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Region</th>
                <th className="p-4 font-medium">Country</th>
                <th className="p-4 font-medium">Legal Entity</th>
                <th className="p-4 font-medium">Reporting Unit</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {orgUnits.map((unit) => (
                <tr key={unit.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{unit.region}</td>
                  <td className="p-4">{unit.country}</td>
                  <td className="p-4">
                    <span className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-slate-400" />
                      {unit.legalEntity}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{unit.reportingUnit}</td>
                  <td className="p-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">Deactivate</button>
                  </td>
                </tr>
              ))}
              {orgUnits.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">No organizational units found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Org Unit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                Add New Org Unit
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 bg-slate-50/50">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Region</label>
                <select
                  value={newUnit.region}
                  onChange={(e) => setNewUnit({ ...newUnit, region: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg text-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="Americas">Americas</option>
                  <option value="EMEA">EMEA</option>
                  <option value="APAC">APAC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  placeholder="e.g., United Kingdom"
                  value={newUnit.country}
                  onChange={(e) => setNewUnit({ ...newUnit, country: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg text-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Legal Entity</label>
                <input
                  type="text"
                  placeholder="e.g., Acme UK Ltd"
                  value={newUnit.legalEntity}
                  onChange={(e) => setNewUnit({ ...newUnit, legalEntity: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg text-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reporting Unit</label>
                <input
                  type="text"
                  placeholder="e.g., London HQ"
                  value={newUnit.reportingUnit}
                  onChange={(e) => setNewUnit({ ...newUnit, reportingUnit: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg text-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUnit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-lg transition-colors flex items-center"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Save Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Approval Dashboard', icon: LayoutDashboard },
    { id: 'audit', label: 'Historical Log', icon: History },
    { id: 'governance', label: 'Data Governance', icon: Database },
    { id: 'config', label: 'Configuration', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-wide">Payroll Cockpit</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium tracking-wider uppercase ml-11">SAP BTP Extension</p>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-900/20'
                    : 'hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center px-4 py-3 bg-slate-800 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white mr-3">
              JD
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Jane Doe</p>
              <p className="text-xs text-slate-400">Global Payroll Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center text-sm text-slate-500">
            <span>Your Payroll Cockpit</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-slate-800">
              {navItems.find(i => i.id === activeTab)?.label}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              Connected to EC Payroll
            </span>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'audit' && <AuditLogView />}
            {activeTab === 'governance' && <DataGovernanceView />}
            {activeTab === 'config' && <ConfigurationView />}
          </div>
        </div>
      </main>
    </div>
  );
}