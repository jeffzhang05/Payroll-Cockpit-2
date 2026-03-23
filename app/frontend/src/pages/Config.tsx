import { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '../store';
import type { Region, OrgUnit } from '../types';
import { 
    Title, Button, Table, TableHeaderRow, TableHeaderCell, TableRow, TableCell, 
    Label, ObjectStatus, FlexBox, FlexBoxJustifyContent, FlexBoxAlignItems, FlexBoxWrap, 
    Input, Select, Option, Dialog, Icon, MessageStrip
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents-icons/dist/add.js';
import '@ui5/webcomponents-icons/dist/sys-find.js';
import '@ui5/webcomponents-icons/dist/building.js';
import '@ui5/webcomponents-icons/dist/globe.js';
import '@ui5/webcomponents-icons/dist/map-2.js';
import '@ui5/webcomponents-icons/dist/edit.js';
import '@ui5/webcomponents-icons/dist/delete.js';
import '@ui5/webcomponents-icons/dist/shield.js';
import '@ui5/webcomponents-icons/dist/sys-help-2.js';

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
            <div>
                <Title level="H1">Configuration Console</Title>
                <Label style={{ display: 'block', marginTop: '0.5rem' }}>Manage system settings, organizational structures, and automation rules.</Label>
            </div>

            {/* Organizational Unit Section */}
            <div>
                <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems={FlexBoxAlignItems.End} style={{ marginBottom: '1rem' }} wrap={FlexBoxWrap.Wrap}>
                    <div>
                        <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '0.5rem' }}>
                            <Icon name="building" style={{ color: 'var(--sapBrandColor)', fontSize: '1.5rem' }} />
                            <Title level="H2">Organizational Units</Title>
                        </FlexBox>
                        <Label style={{ display: 'block', marginTop: '0.5rem' }}>Manage the hierarchy and structural setup of reporting entities.</Label>
                    </div>
                    <Button icon="add" design="Emphasized" onClick={() => setShowModal(true)}>Add Org Unit</Button>
                </FlexBox>

                <div style={{ backgroundColor: 'var(--sapGroup_ContentBackground)', borderRadius: '8px', boxShadow: 'var(--sapContent_Shadow0)' }}>
                    <FlexBox style={{ padding: '1rem', backgroundColor: 'var(--sapList_HeaderBackground)', gap: '1.5rem' }} wrap={FlexBoxWrap.Wrap}>
                        <FlexBox direction="Column" style={{ flex: 1, minWidth: '200px' }}>
                            <Label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Filter By Region</Label>
                            <Select value={filterRegion} onChange={(e) => setFilterRegion(e.detail.selectedOption.textContent || 'All Regions')}>
                                <Option>All Regions</Option>
                                <Option>Americas</Option>
                                <Option>EMEA</Option>
                                <Option>APAC</Option>
                            </Select>
                        </FlexBox>
                        <FlexBox direction="Column" style={{ flex: 2, minWidth: '250px' }}>
                            <Label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Search Legal Entity</Label>
                            <Input 
                                icon={<Icon name="sys-find" />} 
                                placeholder="Type to search..." 
                                value={searchEntity}
                                onInput={(e) => setSearchEntity((e.target as unknown as HTMLInputElement).value)}
                                style={{ width: '100%' }}
                            />
                        </FlexBox>
                    </FlexBox>

                    <Table>
                        <TableHeaderRow slot="headerRow">
                            <TableHeaderCell><Label>Region</Label></TableHeaderCell>
                            <TableHeaderCell><Label>Country</Label></TableHeaderCell>
                            <TableHeaderCell><Label>Legal Entity</Label></TableHeaderCell>
                            <TableHeaderCell><Label>Reporting Unit</Label></TableHeaderCell>
                            <TableHeaderCell><Label style={{ textAlign: 'right', display: 'block', width: '100%' }}>Actions</Label></TableHeaderCell>
                        </TableHeaderRow>
                        {filteredUnits.length === 0 && (
                            <TableRow>
                                <TableCell><Label>No organizations found.</Label></TableCell>
                            </TableRow>
                        )}
                        {filteredUnits.map(unit => (
                            <TableRow key={unit.id}>
                                <TableCell>
                                    <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '0.5rem' }}>
                                        <Icon name="globe" style={{ color: 'var(--sapInformationColor)' }} />
                                        <Label>{unit.region}</Label>
                                    </FlexBox>
                                </TableCell>
                                <TableCell>
                                    <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '0.5rem' }}>
                                        <Icon name="map-2" style={{ color: 'var(--sapNegativeColor)' }} />
                                        <Label>{unit.country}</Label>
                                    </FlexBox>
                                </TableCell>
                                <TableCell>
                                    <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '0.5rem' }}>
                                        <Icon name="building" style={{ color: 'var(--sapContent_NonInteractiveIconColor)' }} />
                                        <Label style={{ fontWeight: 'bold' }}>{unit.legalEntity}</Label>
                                    </FlexBox>
                                </TableCell>
                                <TableCell><Label>{unit.reportingUnit}</Label></TableCell>
                                <TableCell>
                                    <FlexBox justifyContent={FlexBoxJustifyContent.End} style={{ gap: '0.5rem' }}>
                                        <Button icon="edit" design="Transparent" title="Edit" />
                                        <Button icon="delete" design="Transparent" title="Deactivate" onClick={() => handleDelete(unit.id)} style={{ color: 'var(--sapNegativeColor)' }} />
                                    </FlexBox>
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </div>
            </div>

            {/* Validation Rules Section */}
            <div style={{ marginTop: '1rem' }}>
                <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems={FlexBoxAlignItems.End} style={{ marginBottom: '1rem' }} wrap={FlexBoxWrap.Wrap}>
                    <div>
                        <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '0.5rem' }}>
                            <Icon name="shield" style={{ color: 'var(--sapBrandColor)', fontSize: '1.5rem' }} />
                            <Title level="H2">Payroll Validation Rules</Title>
                        </FlexBox>
                        <Label style={{ display: 'block', marginTop: '0.5rem' }}>Configure automated logical checks applied during payroll data import.</Label>
                    </div>
                    <Button icon="add" design="Emphasized" onClick={() => setShowRuleModal(true)}>Add Rule</Button>
                </FlexBox>

                <div style={{ backgroundColor: 'var(--sapGroup_ContentBackground)', borderRadius: '8px', boxShadow: 'var(--sapContent_Shadow0)' }}>
                    <Table>
                        <TableHeaderRow slot="headerRow">
                            <TableHeaderCell><Label>Rule ID</Label></TableHeaderCell>
                            <TableHeaderCell><Label>Payroll Field</Label></TableHeaderCell>
                            <TableHeaderCell><Label>Logical Operator</Label></TableHeaderCell>
                            <TableHeaderCell><Label>Calculation Value</Label></TableHeaderCell>
                            <TableHeaderCell><Label>Status</Label></TableHeaderCell>
                            <TableHeaderCell><Label style={{ textAlign: 'right', display: 'block', width: '100%' }}>Actions</Label></TableHeaderCell>
                        </TableHeaderRow>
                        {rules.map(rule => (
                            <TableRow key={rule.id}>
                                <TableCell><Label style={{ fontWeight: 'bold' }}>{rule.id}</Label></TableCell>
                                <TableCell>
                                    <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '0.5rem' }}>
                                        <Icon name="sys-help-2" style={{ color: 'var(--sapInformationColor)' }} />
                                        <Label style={{ fontWeight: 'bold', color: 'var(--sapBrandColor)' }}>{rule.field}</Label>
                                    </FlexBox>
                                </TableCell>
                                <TableCell>
                                    <Label style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--sapButton_Background)', borderRadius: '4px', fontWeight: 'bold' }}>{rule.operator}</Label>
                                </TableCell>
                                <TableCell><Label style={{ fontWeight: 'bold' }}>{rule.value}</Label></TableCell>
                                <TableCell>
                                    <ObjectStatus state={rule.isActive ? 'Positive' : 'None'} inverted>
                                        {rule.isActive ? 'Active' : 'Inactive'}
                                    </ObjectStatus>
                                </TableCell>
                                <TableCell>
                                    <FlexBox justifyContent={FlexBoxJustifyContent.End} style={{ gap: '0.5rem' }}>
                                        <Button design="Transparent" onClick={() => toggleRuleActive(rule.id)} style={{ color: rule.isActive ? 'var(--sapWarningColor)' : 'var(--sapPositiveColor)' }}>
                                            {rule.isActive ? 'Disable' : 'Enable'}
                                        </Button>
                                        <Button icon="delete" design="Transparent" title="Delete" onClick={() => deleteRule(rule.id)} style={{ color: 'var(--sapNegativeColor)' }} />
                                    </FlexBox>
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </div>
            </div>

            {/* Org Unit Modal */}
            <Dialog open={showModal} headerText="Add Org Unit" onClose={() => setShowModal(false)}>
                <div style={{ minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
                    <FlexBox direction="Column" style={{ gap: '0.5rem' }}>
                        <Label>Region</Label>
                        <Select value={newUnit.region} onChange={e => setNewUnit({ ...newUnit, region: e.detail.selectedOption.textContent as Region })}>
                            <Option>Americas</Option>
                            <Option>EMEA</Option>
                            <Option>APAC</Option>
                        </Select>
                    </FlexBox>
                    <FlexBox direction="Column" style={{ gap: '0.5rem' }}>
                        <Label required>Country</Label>
                        <Input value={newUnit.country} placeholder="e.g. France" onInput={e => setNewUnit({ ...newUnit, country: (e.target as unknown as HTMLInputElement).value })} />
                    </FlexBox>
                    <FlexBox direction="Column" style={{ gap: '0.5rem' }}>
                        <Label required>Legal Entity</Label>
                        <Input value={newUnit.legalEntity} placeholder="e.g. Acme France SAS" onInput={e => setNewUnit({ ...newUnit, legalEntity: (e.target as unknown as HTMLInputElement).value })} />
                    </FlexBox>
                    <FlexBox direction="Column" style={{ gap: '0.5rem' }}>
                        <Label required>Reporting Unit</Label>
                        <Input value={newUnit.reportingUnit} placeholder="e.g. Paris Office" onInput={e => setNewUnit({ ...newUnit, reportingUnit: (e.target as unknown as HTMLInputElement).value })} />
                    </FlexBox>
                </div>
                <div slot="footer" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', padding: '0.5rem 0', gap: '0.5rem' }}>
                    <Button design="Transparent" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button design="Emphasized" onClick={handleSave} disabled={!isFormValid}>Save</Button>
                </div>
            </Dialog>

            {/* Rule Modal */}
            <Dialog open={showRuleModal} headerText="Configure Validation Rule" onClose={() => setShowRuleModal(false)}>
                <div style={{ minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
                    <FlexBox direction="Column" style={{ gap: '0.5rem' }}>
                        <Label required>Payroll Field</Label>
                        <Select value={newRule.field} onChange={e => setNewRule({ ...newRule, field: e.detail.selectedOption.textContent || '' })}>
                            <Option>Net Pay</Option>
                            <Option>Gross Pay</Option>
                            <Option>Overtime Hours</Option>
                            <Option>Base Salary</Option>
                            <Option>Deductions</Option>
                            <Option>Bank Details</Option>
                            <Option>Cost Center</Option>
                        </Select>
                    </FlexBox>
                    <FlexBox style={{ gap: '1rem' }} wrap={FlexBoxWrap.Wrap}>
                        <FlexBox direction="Column" style={{ flex: 1, gap: '0.5rem' }}>
                            <Label required>Logical Operator</Label>
                            <Select value={newRule.operator} onChange={e => setNewRule({ ...newRule, operator: e.detail.selectedOption.textContent?.split(' ')[0] || '' })}>
                                <Option>&gt; (Greater Than)</Option>
                                <Option>&lt; (Less Than)</Option>
                                <Option>== (Equals)</Option>
                                <Option>!= (Not Equal)</Option>
                                <Option>Missing (Is Missing/Null)</Option>
                                <Option>Exceed (Exceeds Field)</Option>
                            </Select>
                        </FlexBox>
                        <FlexBox direction="Column" style={{ flex: 1, gap: '0.5rem' }}>
                            <Label required>Value / Target</Label>
                            <Input value={newRule.value} placeholder="e.g. 50, Gross Pay" onInput={e => setNewRule({ ...newRule, value: (e.target as unknown as HTMLInputElement).value })} />
                        </FlexBox>
                    </FlexBox>
                    <MessageStrip design="Critical" hideCloseButton>
                        If this rule condition is met during the Data Import phase, a Data Quality (DQ) Exception will be flagged for the affected employee.
                    </MessageStrip>
                </div>
                <div slot="footer" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', padding: '0.5rem 0', gap: '0.5rem' }}>
                    <Button design="Transparent" onClick={() => setShowRuleModal(false)}>Cancel</Button>
                    <Button design="Emphasized" onClick={handleSaveRule} disabled={!newRule.field || !newRule.operator}>Add Rule</Button>
                </div>
            </Dialog>
        </div>
    );
}
