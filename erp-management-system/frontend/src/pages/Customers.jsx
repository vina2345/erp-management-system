import CrudPage from '../components/CrudPage.jsx';

export default function Customers() {
  return (
    <CrudPage
      title="Customers"
      endpoint="/customers"
      columns={[
        { label: 'Name', render: (r) => r.name },
        { label: 'Email', render: (r) => r.email },
        { label: 'Phone', render: (r) => r.phone },
        { label: 'Address', render: (r) => r.address },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phone', label: 'Phone' },
        { name: 'address', label: 'Address' },
      ]}
    />
  );
}
