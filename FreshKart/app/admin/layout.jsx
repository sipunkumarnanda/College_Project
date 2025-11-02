import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "FreshKart. - Admin",
    description: "FreshKart. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
