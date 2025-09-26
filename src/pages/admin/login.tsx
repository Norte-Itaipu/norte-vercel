import AdminLogin from '@/components/admin/AdminLogin';
import AdminLayout from '@/components/admin/AdminLayout';

// Desativa o layout padrão para esta página
LoginPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default function LoginPage() {
  return <AdminLogin />;
}
