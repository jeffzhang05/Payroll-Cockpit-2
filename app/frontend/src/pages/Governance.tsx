import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { Title, Button, Table, TableHeaderRow, TableHeaderCell, TableRow, TableCell, Label, ObjectStatus, FlexBox, FlexBoxJustifyContent, FlexBoxAlignItems, FlexBoxWrap, Input, Select, Option, Dialog, Icon, Card, CardHeader } from '@ui5/webcomponents-react';
import '@ui5/webcomponents-icons/dist/refresh.js';
import '@ui5/webcomponents-icons/dist/activity-individual.js';
import '@ui5/webcomponents-icons/dist/alert.js';
import '@ui5/webcomponents-icons/dist/shield.js';
import '@ui5/webcomponents-icons/dist/sys-find.js';
import '@ui5/webcomponents-icons/dist/sys-help-2.js';

export default function Governance() {
    const { dqIssues, fetchDQIssues, syncDQIssues } = useAppStore();
    const [isSyncing, setIsSyncing] = useState(false);

    // Table State
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // UI State
    const [showRulesModal, setShowRulesModal] = useState(false);

    // Rule Name Mapping Helper
    const getRuleName = (ruleId: string) => {
        const rulesMap: Record<string, string> = {
            'RUL-001': 'Net Pay < 0',
            'RUL-002': 'Overtime Hours > 50',
            'RUL-003': 'Bank Details Missing',
            'RUL-004': 'Gross Pay > 100,000',
            'RUL-005': 'Deductions Exceed Gross Pay',
        };
        return rulesMap[ruleId] || ruleId;
    };

    const staticRulesList = [
        { id: 'RUL-001', field: 'Net Pay', operator: '<', value: '0' },
        { id: 'RUL-002', field: 'Overtime Hours', operator: '>', value: '50' },
        { id: 'RUL-003', field: 'Bank Details', operator: 'Missing', value: 'N/A' },
        { id: 'RUL-004', field: 'Gross Pay', operator: '>', value: '100,000' },
        { id: 'RUL-005', field: 'Deductions', operator: 'Exceed', value: 'Gross Pay' }
    ];

    useEffect(() => {
        fetchDQIssues();
    }, [fetchDQIssues]);

    const handleSync = async () => {
        setIsSyncing(true);
        await syncDQIssues();
        setTimeout(() => setIsSyncing(false), 800); // UI feel
    };

    const overallScore = dqIssues.length > 0 ? (100 - dqIssues.length * 1.5).toFixed(1) : 100;

    const filteredAndSortedIssues = [...dqIssues]
        .filter(issue => severityFilter === 'All' || issue.severity === severityFilter)
        .filter(issue =>
            issue.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.rule.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const weight: Record<string, number> = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
            const valA = weight[a.severity] || 0;
            const valB = weight[b.severity] || 0;
            return sortOrder === 'desc' ? valB - valA : valA - valB;
        });

    const getSeverityState = (sev: string) => {
        if (sev === 'Critical' || sev === 'High') return 'Negative';
        if (sev === 'Medium') return 'Critical';
        if (sev === 'Low') return 'Information';
        return 'None';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
            <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems={FlexBoxAlignItems.Center} wrap={FlexBoxWrap.Wrap}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Icon name="shield" style={{ width: '2rem', height: '2rem', color: 'var(--sapBrandColor)' }} />
                    <Title level="H2">Data Quality Governance</Title>
                </div>
                <Button 
                    icon="refresh" 
                    design="Emphasized" 
                    onClick={handleSync} 
                    disabled={isSyncing}
                >
                    {isSyncing ? 'Syncing...' : 'Sync from EC Payroll'}
                </Button>
            </FlexBox>

            <FlexBox wrap={FlexBoxWrap.Wrap} style={{ gap: '1rem' }} justifyContent={FlexBoxJustifyContent.SpaceBetween}>
                <Card style={{ flex: '1 1 30%', minWidth: '250px' }}>
                    <CardHeader titleText="Overall Data Quality" avatar={<Icon name="activity-individual" />} />
                    <div style={{ padding: '1rem', textAlign: 'center' }}>
                        <Title level="H1" style={{ fontSize: '3rem', color: 'var(--sapPositiveColor)' }}>{overallScore}%</Title>
                    </div>
                </Card>

                <Card style={{ flex: '1 1 30%', minWidth: '250px' }}>
                    <CardHeader titleText="Active Anomalies" avatar={<Icon name="alert" />} />
                    <div style={{ padding: '1rem', textAlign: 'center' }}>
                        <Title level="H1" style={{ fontSize: '3rem', color: 'var(--sapNegativeColor)' }}>{dqIssues.length}</Title>
                    </div>
                </Card>

                <Card style={{ flex: '1 1 30%', minWidth: '250px', cursor: 'pointer' }} onClick={() => setShowRulesModal(true)}>
                    <CardHeader titleText="Validation Rules Active" interactive avatar={<Icon name="sys-help-2" />} />
                    <div style={{ padding: '1rem', textAlign: 'center' }}>
                        <Title level="H1" style={{ fontSize: '3rem', color: 'var(--sapInformationColor)' }}>5</Title>
                    </div>
                </Card>
            </FlexBox>

            <div style={{ backgroundColor: 'var(--sapGroup_ContentBackground)', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--sapContent_Shadow0)' }}>
                <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems={FlexBoxAlignItems.Center} style={{ marginBottom: '1rem' }} wrap={FlexBoxWrap.Wrap}>
                    <Title level="H4">Detected Data Anomalies ({filteredAndSortedIssues.length})</Title>
                    <FlexBox style={{ gap: '1rem' }}>
                        <Input 
                            icon={<Icon name="sys-find" />} 
                            placeholder="Search anomalies..." 
                            value={searchTerm} 
                            onInput={(e) => setSearchTerm((e.target as unknown as HTMLInputElement).value)} 
                        />
                        <Select value={severityFilter} onChange={(e) => setSeverityFilter(e.detail.selectedOption.textContent || 'All')}>
                            <Option>All</Option>
                            <Option>Critical</Option>
                            <Option>High</Option>
                            <Option>Medium</Option>
                            <Option>Low</Option>
                        </Select>
                    </FlexBox>
                </FlexBox>

                <Table>
                    <TableHeaderRow slot="headerRow">
                        <TableHeaderCell><Label>Issue ID</Label></TableHeaderCell>
                        <TableHeaderCell onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}><Label style={{ cursor: 'pointer', color: 'var(--sapLinkColor)' }}>Severity ↕</Label></TableHeaderCell>
                        <TableHeaderCell><Label>Violated Rule</Label></TableHeaderCell>
                        <TableHeaderCell><Label>Type</Label></TableHeaderCell>
                        <TableHeaderCell><Label>Entity / EMP</Label></TableHeaderCell>
                        <TableHeaderCell><Label>Description</Label></TableHeaderCell>
                    </TableHeaderRow>
                    {filteredAndSortedIssues.map((issue) => (
                        <TableRow key={issue.id}>
                            <TableCell><Label style={{ fontWeight: 'bold' }}>{issue.id}</Label></TableCell>
                            <TableCell><ObjectStatus state={getSeverityState(issue.severity) as any} inverted>{issue.severity}</ObjectStatus></TableCell>
                            <TableCell><ObjectStatus state="Information" title={`Rule Name: ${getRuleName(issue.rule)}`}>{issue.rule} - {getRuleName(issue.rule)}</ObjectStatus></TableCell>
                            <TableCell><Label>{issue.type}</Label></TableCell>
                            <TableCell>
                                <FlexBox direction="Column">
                                    <Label style={{ fontWeight: 'bold' }}>{issue.entity}</Label>
                                    <Label style={{ fontSize: '0.75rem', color: 'var(--sapContent_LabelColor)' }}>{issue.employee}</Label>
                                </FlexBox>
                            </TableCell>
                            <TableCell><Label wrappingType="Normal">{issue.description}</Label></TableCell>
                        </TableRow>
                    ))}
                    {filteredAndSortedIssues.length === 0 && (
                        <TableRow>
                            <TableCell><Label>No anomalies found matching your criteria.</Label></TableCell>
                        </TableRow>
                    )}
                </Table>
            </div>

            <Dialog open={showRulesModal} headerText="Active Validation Rules" onClose={() => setShowRulesModal(false)}>
                <div style={{ minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Label wrappingType="Normal">The following data quality checking constraints are currently active on incoming payroll runs. To edit or deactivate these rules, please visit the Configuration Console.</Label>
                    <Table>
                        <TableHeaderRow slot="headerRow">
                            <TableHeaderCell><Label>Rule ID</Label></TableHeaderCell>
                            <TableHeaderCell><Label>Validation Condition</Label></TableHeaderCell>
                        </TableHeaderRow>
                        {staticRulesList.map((rule) => (
                            <TableRow key={rule.id}>
                                <TableCell><Label style={{ fontWeight: 'bold', color: 'var(--sapLinkColor)' }}>{rule.id}</Label></TableCell>
                                <TableCell>
                                    <Label>{rule.field} {rule.operator} {rule.value}</Label>
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </div>
                <div slot="footer" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', padding: '0.5rem 0' }}>
                    <Button design="Emphasized" onClick={() => setShowRulesModal(false)}>Close</Button>
                </div>
            </Dialog>
        </div>
    );
}
