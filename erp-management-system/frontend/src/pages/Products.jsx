import CrudPage from '../components/CrudPage.jsx';
import { money } from '../api.js';

export default function Products() {
  return (
    <CrudPage
      title="Inventory"
      endpoint="/products"
      columns={[
        { label: 'Name', render: (r) => r.name },
        { label: 'SKU', render: (r) => r.sku },
        { label: 'Category', render: (r) => r.category },
        { label: 'Price', render: (r) => money(r.price) },
        {
          label: 'Stock',
          render: (r) => (
            <span className={r.stockQuantity <= r.reorderLevel ? 'badge low' : 'badge ok'}>
              {r.stockQuantity}
            </span>
          ),
        },
        { label: 'Reorder at', render: (r) => r.reorderLevel },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'sku', label: 'SKU', required: true },
        { name: 'category', label: 'Category' },
        { name: 'price', label: 'Price', type: 'number', required: true },
        { name: 'stockQuantity', label: 'Stock quantity', type: 'number', required: true },
        { name: 'reorderLevel', label: 'Reorder level', type: 'number', required: true },
      ]}
    />
  );
}
