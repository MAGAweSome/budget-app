import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategoryFormProps {
    onSuccess: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState({ name: '', type: 'spending' });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, type: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        setIsSuccess(false);

        if (!formData.name) {
            setMessage("Please fill out all fields.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add category.');
            }

            setMessage('Category added successfully!');
            setIsSuccess(true);
            setFormData({ name: '', type: 'spending' });
            onSuccess();

        } catch (error: any) {
            console.error('Submission error:', error);
            setMessage(error.message);
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative p-8 bg-background w-full max-w-md m-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center text-foreground mb-6">Add New Category</h2>

            {message && (
                <div className={`p-3 rounded-md mb-4 text-sm ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-muted-foreground font-medium mb-1">Category Name</label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-transparent border-border border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="e.g., Groceries, Utilities"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="type" className="block text-muted-foreground font-medium mb-1">Type</label>
                    <Select name="type" value={formData.type} onValueChange={handleSelectChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="spending">Spending</SelectItem>
                            <SelectItem value="savings">Savings</SelectItem>
                            <SelectItem value="debt_repayment">Debt Repayment</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 rounded-md text-white font-semibold transition-colors duration-200
                    bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {isLoading ? 'Adding...' : 'Add Category'}
                </button>
            </form>
        </div>
    );
};

export default CategoryForm;
