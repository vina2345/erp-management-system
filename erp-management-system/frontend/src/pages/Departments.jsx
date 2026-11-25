import CrudPage from '../components/CrudPage.jsx';

export default function Departments() {
  return (
    <CrudPage
      title="Departments"
      endpoint="/departments"
      columns={[
        { label: 'Name', render: (r) => r.name },
        { label: 'Description', render: (r) => r.description },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'description', label: 'Description' },
      ]}
    />
  );
}
