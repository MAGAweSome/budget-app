import React, { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CategoryForm from '@/components/category-form';
import { Progress } from '@/components/ui/progress';

interface Income {
    id: number;
    amount: number;
    date: string;
}

interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
    user_id: number;
    created_at: string;
    updated_at: string;
}

interface Allocation {
    id: number;
    amount: number;
    income_id: number;
    category_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    category: Category;
}

interface DashboardProps extends PageProps {
    incomes: Income[];
    categories: Category[];
    allocations: Allocation[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const Dashboard: React.FC<DashboardProps> = ({ auth }) => {
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [allocations, setAllocations] = useState<Allocation[]>([]);

    const fetchIncomes = useCallback(async () => {
        try {
            const response = await fetch('/api/incomes', {
                headers: {
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setIncomes(data.data);
        } catch (error) {
            console.error("Error fetching incomes:", error);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch('/api/categories', {
                headers: {
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCategories(data.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, []);

    const fetchAllocations = useCallback(async () => {
        try {
            const response = await fetch('/api/allocations', {
                headers: {
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAllocations(data.data);
        } catch (error) {
            console.error("Error fetching allocations:", error);
        }
    }, []);

    useEffect(() => {
        fetchIncomes();
        fetchCategories();
        fetchAllocations();
    }, [fetchIncomes, fetchCategories, fetchAllocations]);

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalAllocated = allocations.reduce((sum, allocation) => sum + allocation.amount, 0);
    const unallocated = totalIncome - totalAllocated;

    const incomeCategories = categories.filter(cat => cat.type === 'income');
    const expenseCategories = categories.filter(cat => cat.type === 'expense');

    return (
        <AppLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h2 className="text-2xl font-semibold mb-4">Budget Overview</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Overall Summary Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Overall Summary</CardTitle>
                                        <CardDescription>Your current financial snapshot.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>Total Income:</span>
                                                <span className="font-medium">{formatCurrency(totalIncome)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Total Allocated:</span>
                                                <span className="font-medium">{formatCurrency(totalAllocated)}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between font-bold">
                                                <span>Unallocated:</span>
                                                <span>{formatCurrency(unallocated)}</span>
                                            </div>
                                            <Progress value={totalIncome > 0 ? (totalAllocated / totalIncome) * 100 : 0} className="w-full mt-4" />
                                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                                {totalIncome > 0 ? ((totalAllocated / totalIncome) * 100).toFixed(2) : '0.00'}% Allocated
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Income Categories Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Income Categories</CardTitle>
                                        <CardDescription>Breakdown of your income sources.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {incomeCategories.length > 0 ? (
                                            <ul className="space-y-2">
                                                {incomeCategories.map(category => {
                                                    const categoryAllocations = allocations.filter(alloc => alloc.category_id === category.id);
                                                    const allocatedAmount = categoryAllocations.reduce((sum, alloc) => sum + alloc.amount, 0);
                                                    return (
                                                        <li key={category.id} className="flex justify-between">
                                                            <span>{category.name}:</span>
                                                            <span className="font-medium">{formatCurrency(allocatedAmount)}</span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400">No income categories defined.</p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Expense Categories Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Expense Categories</CardTitle>
                                        <CardDescription>Where your money is going.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {expenseCategories.length > 0 ? (
                                            <ul className="space-y-2">
                                                {expenseCategories.map(category => {
                                                    const categoryAllocations = allocations.filter(alloc => alloc.category_id === category.id);
                                                    const allocatedAmount = categoryAllocations.reduce((sum, alloc) => sum + alloc.amount, 0);
                                                    return (
                                                        <li key={category.id} className="flex justify-between">
                                                            <span>{category.name}:</span>
                                                            <span className="font-medium">{formatCurrency(allocatedAmount)}</span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400">No expense categories defined.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <Separator className="my-6" />

                            <div className="flex justify-end">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button>Add New Category</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Add New Category</DialogTitle>
                                            <DialogDescription>
                                                Create a new category for your budget.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <CategoryForm onSuccess={() => {
                                            fetchCategories();
                                            // Optionally close dialog here if needed
                                        }} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;
