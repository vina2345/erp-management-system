import CrudPage from '../components/CrudPage.jsx';
import { money } from '../api.js';

export default function Employees() {
  return (
    <CrudPage
      title="Employees"
      endpoint="/employees"
      columns={[
        { label: 'Name', render: (r) => `${r.firstName} ${r.lastName}` },
        { label: 'Email', render: (r) => r.email },
        { label: 'Job Title', render: (r) => r.jobTitle },
        { label: 'Department', render: (r) => r.department?.name ?? '-' },
        { label: 'Salary', render: (r) => money(r.salary) },
        { label: 'Hired', render: (r) => r.hireDate },
      ]}
      fields={[
        { name: 'firstName', label: 'First name', required: true },
        { name: 'lastName', label: 'Last name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'jobTitle', label: 'Job title' },
        { name: 'salary', label: 'Salary', type: 'number', required: true },
        { name: 'hireDate', label: 'Hire date', type: 'date' },
        { name: 'department', label: 'Department', type: 'select', optionsFrom: '/departments', optionLabel: 'name' },
      ]}
    />
  );
}
