import { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '../store';
import type { Region, OrgUnit } from '../types';
import { Plus, Search, Building2, Globe2, MapPin, X, Trash2, Edit2, AlertTriangle, Calculator, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ValidationRule {
    id: string;
    field: string;
    operator: string;
    value: string;
    isActive: boolean;
}

export default function Config() {
    const { orgUnits, fetchOrgUnits, createOrgUnit, deactivateOrgUnit } = useAppStore();

    const [filterRegion, setFilterRegion] = useState<string>('All Regions');
    const [searchEntity, setSearchEntity] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [newUnit, setNewUnit] = useState<Partial<OrgUnit>>({ region: 'Americas', country: '', legalEntity: '', reportingUnit: '' });

    // Validation Rules State
    const [rules, setRules] = useState<ValidationRule[]>([
        { id: 'RUL-001', field: 'Net Pay', operator: '<', value: '0', isActive: true },
        { id: 'RUL-002', field: 'Overtime Hours', operator: '>', value: '50', isActive: true },
        { id: 'RUL-003', field: 'Bank Details', operator: 'Missing', value: 'N/A', isActive: true },
        { id: 'RUL-004', field: 'Gross Pay', operator: '>', value: '100,000', isActive: true },
        { id: 'RUL-005', field: 'Deductions', operator: 'Exceed', value: 'Gross Pay', isActive: true },
    ]);
    const [showRuleModal, setShowRuleModal] = useState(false);
    const [newRule, setNewRule] = useState<Partial<ValidationRule>>({ field: 'Net Pay', operator: '>', value: '', isActive: true });

    useEffect(() => {
        fetchOrgUnits();
    }, [fetchOrgUnits]);

    const filteredUnits = useMemo(() => {
        return orgUnits
            .filter(u => filterRegion === 'All Regions' ? true : u.region === filterRegion)
            .filter(u => searchEntity ? u.legalEntity.toLowerCase().includes(searchEntity.toLowerCase()) : true);
    }, [orgUnits, filterRegion, searchEntity]);

    const isFormValid = newUnit.region && newUnit.country && newUnit.legalEntity && newUnit.reportingUnit;

    const handleSave = async () => {
        if (!isFormValid) return;
        await createOrgUnit(newUnit);
        setShowModal(false);
        setNewUnit({ region: 'Americas', country: '', legalEntity: '', reportingUnit: '' });
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to deactivate this Org Unit?')) {
            await deactivateOrgUnit(id);
        }
    };

    const handleSaveRule = () => {
        if (!newRule.field || !newRule.operator) return;
        setRules([...rules, { ...newRule, id: `RUL-00${rules.length + 1}`, isActive: true } as ValidationRule]);
        setShowRuleModal(false);
        setNewRule({ field: 'Net Pay', operator: '>', value: '', isActive: true });
    };

    const toggleRuleActive = (id: string) => {
        setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
    };

    const deleteRule = (id: string) => {
        if (confirm('Delete this validation rule?')) {
            setRules(rules.filter(r => r.id !== id));
        }
    };

    return (
        <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-[#0f1623] tracking-tight">Configuration Console</h1>
                <p className="text-gray-500 mt-1">Manage system settings, organizational structures, and automation rules.</p>
            </div>

            {/* Organizational Unit Section */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#0f1623] tracking-tight flex items-center"><Building2 size={24} className="mr-2 text-indigo-600" /> Organizational Units</h2>
                    <p className="text-gray-500 mt-1">Manage the hierarchy and structural setup of reporting entities.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-5 py-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-bold flex items-center transition-all min-w-[160px] justify-center"
                >
                    <Plus size={18} className="mr-2" /> Add Org Unit
                </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-10">

                {/* Filters Row */}
                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex space-x-6">
                    <div className="flex-1 max-w-xs">
                        <label className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Filter By Region</label>
                        <select
                            className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none shadow-sm"
                            value={filterRegion}
                            title="Filter by Region"
                            onChange={e => setFilterRegion(e.target.value)}
                        >
                            <option value="All Regions">All Regions</option>
                            <option value="Americas">Americas</option>
                            <option value="EMEA">EMEA</option>
                            <option value="APAC">APAC</option>
                        </select>
                    </div>
                    <div className="flex-1 max-w-md relative">
                        <label className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Search Legal Entity</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <Search size={16} />
                            </div>
                            <input
                                type="text"
                                className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 shadow-sm transition-all outline-none"
                                placeholder="Type to search..."
                                value={searchEntity}
                                onChange={(e) => setSearchEntity(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Region</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Country</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Legal Entity</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Reporting Unit</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right w-32">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUnits.length === 0 && (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No organizations found.</td></tr>
                            )}
                            {filteredUnits.map(unit => (
                                <tr key={unit.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium flex items-center text-gray-600"><Globe2 size={16} className="mr-2 text-blue-400" /> {unit.region}</td>
                                    <td className="px-6 py-4 font-medium text-gray-600"><div className="flex items-center"><MapPin size={16} className="mr-2 text-red-400" /> {unit.country}</div></td>
                                    <td className="px-6 py-4 font-bold text-gray-900 flex items-center"><Building2 size={16} className="mr-2 text-gray-400" /> {unit.legalEntity}</td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{unit.reportingUnit}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-xs"><Edit2 size={12} className="mr-1" /> Edit</button>
                                            <span className="text-gray-300">|</span>
                                            <button onClick={() => handleDelete(unit.id)} className="text-red-500 hover:text-red-700 font-medium flex items-center text-xs"><Trash2 size={12} className="mr-1" /> Deactivate</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Validation Rules Section */}
            <div className="flex justify-between items-end mb-6 mt-12">
                <div>
                    <h2 className="text-2xl font-bold text-[#0f1623] tracking-tight flex items-center"><ShieldAlert size={24} className="mr-2 text-indigo-600" /> Payroll Validation Rules</h2>
                    <p className="text-gray-500 mt-1">Configure automated logical checks applied during payroll data import.</p>
                </div>
                <button
                    onClick={() => setShowRuleModal(true)}
                    className="px-5 py-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-bold flex items-center transition-all min-w-[160px] justify-center"
                >
                    <Plus size={18} className="mr-2" /> Add Rule
                </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-12">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Rule ID</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Payroll Field</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-center">Logical Operator</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Calculation Value</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {rules.map(rule => (
                                <tr key={rule.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">{rule.id}</td>
                                    <td className="px-6 py-4 font-semibold text-indigo-900 flex items-center"><Calculator size={16} className="mr-2 text-indigo-400" /> {rule.field}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-gray-100 border border-gray-200 text-gray-800 text-xs font-black px-2.5 py-1 rounded shadow-sm">{rule.operator}</span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-700">{rule.value}</td>
                                    <td className="px-6 py-4 text-center">
                                        {rule.isActive ?
                                            <span className="inline-flex items-center text-green-700 text-xs font-bold bg-green-50 border border-green-200 px-2 py-0.5 rounded-full"><CheckCircle2 size={12} className="mr-1" /> Active</span> :
                                            <span className="inline-flex items-center text-gray-500 text-xs font-bold bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">Inactive</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => toggleRuleActive(rule.id)} className={`${rule.isActive ? 'text-orange-500 hover:text-orange-700' : 'text-green-600 hover:text-green-800'} font-medium text-xs`}>
                                                {rule.isActive ? 'Disable' : 'Enable'}
                                            </button>
                                            <span className="text-gray-300">|</span>
                                            <button onClick={() => deleteRule(rule.id)} className="text-red-500 hover:text-red-700 font-medium flex items-center text-xs"><Trash2 size={12} className="mr-1" /> Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-900">Add Org Unit</h2>
                            <button onClick={() => setShowModal(false)} title="Close Modal" className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Region</label>
                                <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                                    value={newUnit.region} title="Region" onChange={e => setNewUnit({ ...newUnit, region: e.target.value as Region })}
                                >
                                    <option value="Americas">Americas</option>
                                    <option value="EMEA">EMEA</option>
                                    <option value="APAC">APAC</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                                <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. France"
                                    value={newUnit.country} onChange={e => setNewUnit({ ...newUnit, country: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Legal Entity</label>
                                <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. Acme France SAS"
                                    value={newUnit.legalEntity} onChange={e => setNewUnit({ ...newUnit, legalEntity: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Reporting Unit</label>
                                <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. Paris Office"
                                    value={newUnit.reportingUnit} onChange={e => setNewUnit({ ...newUnit, reportingUnit: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                            <button onClick={() => setShowModal(false)} className="px-5 py-2 font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
                            <button
                                onClick={handleSave}
                                disabled={!isFormValid}
                                className={`px-5 py-2 font-bold text-white rounded-lg shadow-sm transition-all ${isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rule Modal */}
            {showRuleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
                            <h2 className="text-lg font-bold text-indigo-950 flex items-center"><Calculator size={18} className="mr-2 text-indigo-600" /> Configure Validation Rule</h2>
                            <button onClick={() => setShowRuleModal(false)} title="Close Modal" className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Payroll Field</label>
                                <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                                    value={newRule.field} onChange={e => setNewRule({ ...newRule, field: e.target.value })}
                                    title="Payroll Field"
                                >
                                    <option value="Net Pay">Net Pay</option>
                                    <option value="Gross Pay">Gross Pay</option>
                                    <option value="Overtime Hours">Overtime Hours</option>
                                    <option value="Base Salary">Base Salary</option>
                                    <option value="Deductions">Deductions</option>
                                    <option value="Bank Details">Bank Details</option>
                                    <option value="Cost Center">Cost Center</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Logical Operator</label>
                                    <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors font-mono font-bold"
                                        value={newRule.operator} onChange={e => setNewRule({ ...newRule, operator: e.target.value })}
                                        title="Logical Operator"
                                    >
                                        <option value=">">&gt; (Greater Than)</option>
                                        <option value="<">&lt; (Less Than)</option>
                                        <option value="==">== (Equals)</option>
                                        <option value="!=">!= (Not Equal)</option>
                                        <option value="Missing">Is Missing (Null)</option>
                                        <option value="Exceed">Exceeds Field</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Value / Target</label>
                                    <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors font-bold"
                                        placeholder="e.g. 50, Gross Pay"
                                        value={newRule.value} onChange={e => setNewRule({ ...newRule, value: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-xs font-medium border border-yellow-100 flex items-start">
                                <AlertTriangle size={14} className="mr-2 flex-shrink-0 mt-0.5 text-yellow-600" />
                                <p>If this rule condition is met during the Data Import phase, a Data Quality (DQ) Exception will be flagged for the affected employee.</p>
                            </div>
                        </div>

                        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                            <button onClick={() => setShowRuleModal(false)} className="px-5 py-2 font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
                            <button
                                onClick={handleSaveRule}
                                disabled={!newRule.field || !newRule.operator}
                                className={`px-5 py-2 font-bold text-white rounded-lg shadow-sm transition-all ${newRule.field && newRule.operator ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}
                            >
                                Add Rule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
