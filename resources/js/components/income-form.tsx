import React, { useState } from 'react';

// Define the shape of our form data.
interface IncomeData {
    name: string;
    amount: number | string;
    frequency: string;
}

// Define props for the component, including the show/hide state.
interface IncomeFormProps {
    show: boolean;
    onClose: () => void;
    onIncomeAdded: () => void; // A callback to refresh the parent component.
}

const IncomeForm: React.FC<IncomeFormProps> = ({ show, onClose, onIncomeAdded }) => {
    // Initialize state to hold the form data.
    const [formData, setFormData] = useState<IncomeData>({
        name: '',
        amount: '',
        frequency: 'monthly', // Set a default value.
    });
    // State for managing UI feedback like loading and success messages.
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    // This function handles changes to the form inputs.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'amount' ? parseFloat(value) : value,
        }));
    };

    // This function handles form submission.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the default form behavior of reloading the page.
        setIsLoading(true);
        setMessage(null);
        setIsSuccess(false);

        // A simple validation check.
        if (!formData.name || !formData.amount) {
            setMessage("Please fill out all fields.");
            setIsLoading(false);
            return;
        }

        try {
            // Send the form data to our API endpoint.
            const response = await fetch('/incomes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add income.');
            }

            // On success, show a success message and reset the form.
            setMessage('Income added successfully!');
            setIsSuccess(true);
            setFormData({ name: '', amount: '', frequency: 'monthly' });
            onIncomeAdded(); // Call the callback to tell the parent to refresh.

        } catch (error: any) {
            console.error('Submission error:', error);
            setMessage(error.message);
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Return null if the modal should not be shown.
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative p-8 bg-white w-full max-w-md m-4 rounded-xl shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add New Income</h2>
                
                {/* Display messages to the user */}
                {message && (
                    <div className={`p-3 rounded-md mb-4 text-sm ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Income Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Salary, Freelance"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="amount" className="block text-gray-700 font-medium mb-1">Amount ($)</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 2500.00"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="frequency" className="block text-gray-700 font-medium mb-1">Frequency</label>
                        <select
                            id="frequency"
                            name="frequency"
                            value={formData.frequency}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="monthly">Monthly</option>
                            <option value="bi-weekly">Bi-weekly</option>
                            <option value="weekly">Weekly</option>
                            <option value="one-time">One-time</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 rounded-md text-white font-semibold transition-colors duration-200
                        bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {isLoading ? 'Adding...' : 'Add Income'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default IncomeForm;
