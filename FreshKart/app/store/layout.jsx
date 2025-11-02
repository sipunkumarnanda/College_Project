import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "FreshKart. - Store Dashboard",
    description: "FreshKart. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
