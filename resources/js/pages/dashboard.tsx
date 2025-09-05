import React, { useState, useEffect } from 'react';
import IncomeForm from '../components/income-form';
import CategoryForm from '../components/category-form';

// A single type for all income data.
interface Income {
    id: number;
    name: string;
    amount: number;
    frequency: string;
}

interface Category {
    id: number;
    name: string;
    type: string;
}

const Dashboard: React.FC = () => {
    // State to hold the list of incomes and the total.
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [totalIncome, setTotalIncome] = useState<number>(0);
    // State to control the visibility of the income form modal.
    const [showModal, setShowModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    // State to handle loading status.
    const [isLoading, setIsLoading] = useState(false);
    // State to handle any fetch errors.
    const [error, setError] = useState<string | null>(null);
    
    // A function to fetch all incomes from the API.
    const fetchIncomes = async () => {
        setIsLoading(true);
        setError(null); // Clear any previous errors.
        try {
            // Correct the fetch URL to use the new route.
            const response = await fetch('/user/incomes');
            if (!response.ok) {
                throw new Error('Failed to fetch incomes.');
            }
            const data = await response.json();
            
            // Validate the incoming data before setting state.
            if (!data.incomes || !Array.isArray(data.incomes)) {
                throw new Error('Invalid data format received from the server.');
            }

            // Convert amount to a number before using it.
            const formattedIncomes = data.incomes.map((income: any) => ({
                ...income,
                amount: parseFloat(income.amount)
            }));
            
            // Update the state with the fetched data.
            setIncomes(formattedIncomes);
            setTotalIncome(data.totalIncome);
        } catch (error: any) {
            console.error('Error fetching data:', error);
            setError(error.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('/categories');
            if (!response.ok) {
                throw new Error('Failed to fetch categories.');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error: any) {
            console.error('Error fetching categories:', error);
        }
    };
    
    // Fetch incomes and categories when the component first loads.
    useEffect(() => {
        fetchIncomes();
        fetchCategories();
    }, []);

    const handleIncomeAdded = () => {
        // Fetch the updated income list after a successful form submission.
        fetchIncomes();
        // Close the modal.
        setShowModal(false);
    };

    const handleCategoryAdded = () => {
        // Refresh the categories list after a successful form submission.
        fetchCategories();
        // Close the modal.
        setShowCategoryModal(false);
    };

    return (
        <div className="container mx-auto">
            <header className="flex justify-between items-center py-4 px-6 bg-white shadow-lg rounded-xl mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Budget Dashboard</h1>
                <nav>
                    <a href="#" 
                       onClick={(e) => {
                           e.preventDefault(); 
                           // Use type casting to tell TypeScript this is a form element
                           const form = document.getElementById('logout-form') as HTMLFormElement;
                           form?.submit();
                       }} 
                       className="text-blue-600 font-medium hover:text-blue-800 transition-colors cursor-pointer">
                        Log Out
                    </a>
                </nav>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Overall Summary Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Overall Summary</h2>
                    {isLoading ? (
                        <div className="text-center text-gray-500">Loading...</div>
                    ) : (
                        <p className="text-4xl font-bold text-blue-600 mb-2">${totalIncome.toFixed(2)}</p>
                    )}
                    <p className="text-sm text-gray-500">Total Monthly Income</p>
                    <div className="mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Allocated</span>
                            <span className="text-sm font-semibold text-green-600">$0.00</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Income Sources Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Income Sources</h2>
                    {error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : isLoading ? (
                        <div className="text-center text-gray-500">Loading...</div>
                    ) : incomes.length > 0 ? (
                        incomes.map((income) => (
                            <div key={income.id} className="flex justify-between items-center mb-2">
                                <span className="text-gray-800 font-medium">{income.name}</span>
                                <span className="text-green-600 font-bold">${income.amount.toFixed(2)}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No incomes found. Add one to get started.</p>
                    )}
                    
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full py-2 px-4 rounded-md text-white font-semibold transition-colors duration-200 mt-6
                        bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Add Income
                    </button>
                </div>
                
                {/* Other placeholder cards */}
                <div className="bg-white p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Categories</h2>
                    {categories.length > 0 ? (
                        <div className="space-y-2 mb-4">
                            {categories.map(category => (
                                <div key={category.id} className="flex justify-between items-center">
                                    <span className="text-gray-800 font-medium">{category.name}</span>
                                    <span className="text-gray-600 text-sm">{category.type.charAt(0).toUpperCase() + category.type.slice(1)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 mb-4">No categories found. Add one to get started.</p>
                    )}
                    <button
                        onClick={() => setShowCategoryModal(true)}
                        className="w-full py-2 px-4 rounded-md text-white font-semibold transition-colors duration-200 mt-6
                        bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Add Category
                    </button>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Goals</h2>
                    <p className="text-sm text-gray-500">Add goals to get started.</p>
                </div>
            </main>
            
            {/* The modal component, controlled by state */}
            <IncomeForm
                show={showModal}
                onClose={() => setShowModal(false)}
                onIncomeAdded={handleIncomeAdded}
            />
            <CategoryForm
                show={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                onCategoryAdded={handleCategoryAdded}
            />
        </div>
    );
};

export default Dashboard;
