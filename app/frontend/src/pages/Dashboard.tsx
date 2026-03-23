import { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '../store';
import type { PayrollRun } from '../types';
import ApprovalModal from '../components/ApprovalModal';
import { Title, Select, Option, TabContainer, Tab, Table, TableHeaderRow, TableHeaderCell, TableRow, TableCell, ObjectStatus, Input, Button, FlexBox, FlexBoxJustifyContent, FlexBoxAlignItems, Label, Icon } from '@ui5/webcomponents-react';
import '@ui5/webcomponents-icons/dist/sys-find.js';
import '@ui5/webcomponents-icons/dist/edit.js';
import '@ui5/webcomponents-icons/dist/history.js';
import '@ui5/webcomponents-icons/dist/accept.js';
import '@ui5/webcomponents-icons/dist/business-objects-experience.js';
import '@ui5/webcomponents-icons/dist/display.js';
import '@ui5/webcomponents-icons/dist/action.js';

export default function Dashboard() {
    const { currentMonth, setMonth, payrollRuns, fetchPayrollRuns } = useAppStore();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [selectedRun, setSelectedRun] = useState<PayrollRun | null>(null);

    useEffect(() => {
        fetchPayrollRuns();
    }, [currentMonth, fetchPayrollRuns]);

    const filteredRuns = useMemo(() => {
        return payrollRuns.filter(run => {
            const matchesSearch = run.company.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter ? run.status === statusFilter : true;
            return matchesSearch && matchesStatus;
        });
    }, [payrollRuns, search, statusFilter]);

    const stats = useMemo(() => ({
        all: payrollRuns.length,
        draft: payrollRuns.filter(r => r.status === 'draft').length,
        approval_in_progress: payrollRuns.filter(r => r.status === 'approval_in_progress').length,
        approved: payrollRuns.filter(r => r.status === 'approved').length,
        submitted: payrollRuns.filter(r => r.status === 'submitted').length,
    }), [payrollRuns]);

    const getStatusState = (status: string): "Information" | "Critical" | "Positive" | "None" => {
        switch (status) {
            case 'draft': return 'Information';
            case 'approval_in_progress': return 'Critical';
            case 'approved': return 'Positive';
            case 'submitted': return 'None';
            default: return 'None';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'draft': return 'Draft & DQ Validation';
            case 'approval_in_progress': return 'Approval in Progress';
            case 'approved': return 'Approved - Ready for Release';
            case 'submitted': return 'Submitted to Bank';
            default: return status;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
            <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems={FlexBoxAlignItems.Center}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Icon name="business-objects-experience" style={{ width: '2rem', height: '2rem', color: 'var(--sapBrandColor)' }} />
                    <Title level="H2">Payroll Approval Dashboard</Title>
                </div>
                <Select 
                    value={currentMonth} 
                    onChange={(e) => setMonth(e.detail.selectedOption.textContent || 'October 2025')}
                >
                    <Option>October 2025</Option>
                    <Option>November 2025</Option>
                    <Option>December 2025</Option>
                    <Option>January 2026</Option>
                    <Option>February 2026</Option>
                    <Option>March 2026</Option>
                </Select>
            </FlexBox>

            <TabContainer 
                onTabSelect={(e) => {
                    const key = e.detail.tab.dataset.key;
                    setStatusFilter(key === 'all' ? null : key || null);
                }}
            >
                <Tab text={`All Runs (${stats.all})`} data-key="all" />
                <Tab text={`Draft (${stats.draft})`} data-key="draft" icon="edit" />
                <Tab text={`Approvals (${stats.approval_in_progress})`} data-key="approval_in_progress" icon="history" />
                <Tab text={`Approved (${stats.approved})`} data-key="approved" icon="accept" />
                <Tab text={`Submitted (${stats.submitted})`} data-key="submitted" icon="sys-enter-2" />
            </TabContainer>

            <div style={{ backgroundColor: 'var(--sapGroup_ContentBackground)', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--sapContent_Shadow0)' }}>
                <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems={FlexBoxAlignItems.Center} style={{ marginBottom: '1rem' }}>
                    <Title level="H4">Entity Approvals</Title>
                    <Input 
                        icon={<Icon name="sys-find" />} 
                        placeholder="Search Company..." 
                        onInput={(e) => setSearch((e.target as any).value)} 
                        value={search} 
                    />
                </FlexBox>

                <Table>
                    <TableHeaderRow slot="headerRow">
                        <TableHeaderCell><Label>Run ID</Label></TableHeaderCell>
                        <TableHeaderCell><Label>Company</Label></TableHeaderCell>
                        <TableHeaderCell><Label>Employees</Label></TableHeaderCell>
                        <TableHeaderCell><Label>Total Amount</Label></TableHeaderCell>
                        <TableHeaderCell><Label>Status</Label></TableHeaderCell>
                        <TableHeaderCell><Label>Action</Label></TableHeaderCell>
                    </TableHeaderRow>
                    {filteredRuns.map((run) => (
                        <TableRow key={run.id}>
                            <TableCell><Label style={{ fontWeight: 'bold', color: 'var(--sapLinkColor)' }}>{run.id}</Label></TableCell>
                            <TableCell><Label>{run.company}</Label></TableCell>
                            <TableCell><Label>{run.employees.toLocaleString()}</Label></TableCell>
                            <TableCell><Label>{run.totalAmount}</Label></TableCell>
                            <TableCell>
                                <ObjectStatus state={getStatusState(run.status)}>
                                    {getStatusText(run.status)}
                                </ObjectStatus>
                            </TableCell>
                            <TableCell>
                                {run.status === 'draft' && <Button icon="action" design="Emphasized" onClick={() => setSelectedRun(run)}>Req. Approval</Button>}
                                {run.status === 'approval_in_progress' && <Button icon="accept" design="Attention" onClick={() => setSelectedRun(run)}>Force Approve</Button>}
                                {run.status === 'approved' && <Button icon="sys-enter-2" design="Positive" onClick={() => setSelectedRun(run)}>Release Pmt</Button>}
                                {run.status === 'submitted' && <Button icon="display" design="Transparent" onClick={() => setSelectedRun(run)}>Details</Button>}
                            </TableCell>
                        </TableRow>
                    ))}
                    {filteredRuns.length === 0 && (
                         <TableRow>
                             <TableCell><Label>No entities found for the current filter criteria.</Label></TableCell>
                         </TableRow>
                    )}
                </Table>
            </div>

            {selectedRun && (
                <ApprovalModal
                    run={selectedRun}
                    isOpen={!!selectedRun}
                    onClose={() => setSelectedRun(null)}
                />
            )}
        </div>
    );
}
