import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Category {
    id: number;
    name: string;
    type: string;
}

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({ id: null, name: '', type: 'spending' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetch('/categories')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setCategories(data))
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, type: value }));
    };

    const handleEdit = (category: Category) => {
        setIsEditing(true);
        setFormData({ id: category.id, name: category.name, type: category.type });
    };

    const handleDelete = (id: number) => {
        fetch(`/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Accept': 'application/json',
            }
        })
            .then(() => {
                setCategories(prev => prev.filter(c => c.id !== id));
            });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEditing ? `/categories/${formData.id}` : '/categories';
        const method = isEditing ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ name: formData.name, type: formData.type }),
        })
            .then(response => response.json())
            .then(data => {
                if (isEditing) {
                    setCategories(prev => prev.map(c => c.id === data.id ? data : c));
                } else {
                    setCategories(prev => [...prev, data]);
                }
                setIsEditing(false);
                setFormData({ id: null, name: '', type: 'spending' });
            });
    };

    return (
        <AppLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-background overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-background border-b border-border">
                            <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Category' : 'Add Category'}</h2>

                            <form onSubmit={handleSubmit} className="flex items-center gap-4 mb-8">
                                <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Category name"
                                    className="max-w-xs"
                                />
                                <Select name="type" value={formData.type} onValueChange={handleSelectChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="spending">Spending</SelectItem>
                                        <SelectItem value="savings">Savings</SelectItem>
                                        <SelectItem value="debt_repayment">Debt Repayment</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button type="submit">{isEditing ? 'Update' : 'Add'}</Button>
                                {isEditing && (
                                    <Button variant="ghost" onClick={() => { setIsEditing(false); setFormData({ id: null, name: '', type: 'spending' }); }}>Cancel</Button>
                                )}
                            </form>

                            <h3 className="text-xl font-bold mb-4">Your Categories</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categories.map(category => (
                                    <div key={category.id} className="p-4 bg-muted rounded-lg flex justify-between items-center">
                                        <span>{category.name} ({category.type})</span>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>Delete</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
