import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem, type User } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [], user }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[], user: User }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar user={user} />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} user={user} />
                {children}
            </AppContent>
        </AppShell>
    );
}
