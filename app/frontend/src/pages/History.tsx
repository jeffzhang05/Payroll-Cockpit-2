import { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '../store';
import { Title, Button, Table, TableHeaderRow, TableHeaderCell, TableRow, TableCell, Label, ObjectStatus, FlexBox, FlexBoxJustifyContent, FlexBoxAlignItems, Input, Select, Option, Icon } from '@ui5/webcomponents-react';
import '@ui5/webcomponents-icons/dist/download.js';
import '@ui5/webcomponents-icons/dist/filter.js';
import '@ui5/webcomponents-icons/dist/document-text.js';

export default function History() {
    const { auditLogs, fetchAuditLogs } = useAppStore();
    const [filterPeriod, setFilterPeriod] = useState('');
    const [filterEntity, setFilterEntity] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchAuditLogs();
    }, [fetchAuditLogs]);

    const filteredLogs = useMemo(() => {
        return auditLogs
            .filter(log => filterPeriod ? log.month === filterPeriod : true)
            .filter(log => filterEntity ? log.entity.toLowerCase().includes(filterEntity.toLowerCase()) : true)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [auditLogs, filterPeriod, filterEntity]);

    const handleExport = () => {
        const headers = ['Timestamp', 'User', 'Entity & Period', 'Action Type', 'Details'];
        const rows = filteredLogs.map(log =>
            `"${log.date}","${log.user}","${log.entity} / ${log.month}","${log.action}","${log.details}"`
        );
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "audit_log.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getActionState = (action: string) => {
        if (action.includes('Accept') || action.includes('Approve') || action.includes('Released') || action.includes('Resolved')) return 'Positive';
        if (action.includes('Reject') || action.includes('Fail') || !!action.match(/critical/i)) return 'Negative';
        if (action.includes('Email') || action.includes('Status') || action.includes('Data Import')) return 'Information';
        return 'None';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
            <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems={FlexBoxAlignItems.Center}>
                <Title level="H2">Historical Approval Log</Title>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button 
                        icon="filter" 
                        design={showFilters ? "Emphasized" : "Transparent"} 
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        Filter
                    </Button>
                    <Button icon="download" onClick={handleExport}>Export CSV</Button>
                </div>
            </FlexBox>

            {showFilters && (
                <div style={{ padding: '1rem', backgroundColor: 'var(--sapNeutralBackground)', borderRadius: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <Label style={{ display: 'block', marginBottom: '0.25rem' }}>Period</Label>
                        <Select value={filterPeriod} onChange={(e) => setFilterPeriod(e.detail.selectedOption.textContent !== 'All Periods' ? e.detail.selectedOption.textContent || '' : '')}>
                            <Option>All Periods</Option>
                            <Option>October 2025</Option>
                            <Option>November 2025</Option>
                            <Option>December 2025</Option>
                            <Option>January 2026</Option>
                            <Option>February 2026</Option>
                            <Option>March 2026</Option>
                        </Select>
                    </div>
                    <div>
                        <Label style={{ display: 'block', marginBottom: '0.25rem' }}>Entity Name</Label>
                        <Input placeholder="e.g. Acme EMEA" value={filterEntity} onInput={(e) => setFilterEntity((e.target as unknown as HTMLInputElement).value)} />
                    </div>
                    <Button design="Transparent" onClick={() => { setFilterPeriod(''); setFilterEntity(''); }}>Clear</Button>
                </div>
            )}

            <Table>
                <TableHeaderRow slot="headerRow">
                    <TableHeaderCell><Label>Timestamp</Label></TableHeaderCell>
                    <TableHeaderCell><Label>User</Label></TableHeaderCell>
                    <TableHeaderCell><Label>Entity & Period</Label></TableHeaderCell>
                    <TableHeaderCell><Label>Action Type</Label></TableHeaderCell>
                    <TableHeaderCell><Label>Details</Label></TableHeaderCell>
                </TableHeaderRow>
                {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                        <TableCell>
                            <Label>
                                {new Date(log.date).toLocaleString(undefined, {
                                    year: 'numeric', month: '2-digit', day: '2-digit',
                                    hour: '2-digit', minute: '2-digit'
                                })}
                            </Label>
                        </TableCell>
                        <TableCell><Label>{log.user}</Label></TableCell>
                        <TableCell>
                            <FlexBox direction="Column">
                                <Label style={{ fontWeight: 'bold' }}>{log.entity}</Label>
                                <Label style={{ fontSize: '0.75rem', color: 'var(--sapContent_LabelColor)' }}>{log.month}</Label>
                            </FlexBox>
                        </TableCell>
                        <TableCell>
                            <ObjectStatus state={getActionState(log.action)}>
                                {log.action}
                            </ObjectStatus>
                        </TableCell>
                        <TableCell>
                            <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '0.5rem' }}>
                                <Icon name="document-text" style={{ color: 'var(--sapContent_NonInteractiveIconColor)' }} />
                                <Label>{log.details}</Label>
                            </FlexBox>
                        </TableCell>
                    </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                    <TableRow>
                        <TableCell><Label>No audit logs found matching your filters.</Label></TableCell>
                    </TableRow>
                )}
            </Table>
        </div>
    );
}
