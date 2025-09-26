import NewsForm from '@/components/admin/NewsForm';
import AdminLayout from '@/components/admin/AdminLayout';

// Desativa o layout padrão para esta página
AdminNoticiasPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default function AdminNoticiasPage() {
  return <NewsForm />;
}
