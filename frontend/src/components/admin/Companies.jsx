import React, { useEffect, useState } from 'react'
import AdminNavbar from '../shared/AdminNavbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { Link, useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { Building2, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const Companies = () => {
    useGetAllCompanies();  // Make sure this hook is working
    const [input, setInput] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { companies = [] } = useSelector(store => store.company); // Add default empty array

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input]);

    // Enhanced sorting function with debug logs
    const getSortedCompanies = () => {
        if (!companies || companies.length === 0) return [];
        
        console.log('Sorting companies by:', sortBy);
        console.log('Original companies:', companies);
        
        let sortedCompanies = [...companies];
        
        switch (sortBy) {
            case "newest":
                sortedCompanies.sort((a, b) => {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return dateB - dateA;
                });
                break;
            case "oldest":
                sortedCompanies.sort((a, b) => {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return dateA - dateB;
                });
                break;
            case "a-z":
                sortedCompanies.sort((a, b) => 
                    (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase())
                );
                break;
            case "z-a":
                sortedCompanies.sort((a, b) => 
                    (b.name || '').toLowerCase().localeCompare((a.name || '').toLowerCase())
                );
                break;
            default:
                console.log('Using default sort (newest)');
                sortedCompanies.sort((a, b) => {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return dateB - dateA;
                });
        }
        
        console.log('Sorted companies:', sortedCompanies);
        return sortedCompanies;
    };

    // Get sorted companies and trigger re-render when sortBy changes
    const sortedCompanies = React.useMemo(() => getSortedCompanies(), [companies, sortBy]);

    // Debug log for state changes
    useEffect(() => {
        console.log('Sort type changed to:', sortBy);
    }, [sortBy]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-violet-50 via-slate-50 to-cyan-50'>
            <AdminNavbar />
            <div className='max-w-7xl mx-auto px-4 py-8'>
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-8'
                >
                    <div className='flex items-center gap-3 mb-2'>
                        <Building2 className='w-8 h-8 text-violet-600' />
                        <h1 className='text-3xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent'>
                            Manage Companies
                        </h1>
                    </div>
                    <p className='text-gray-500 ml-11'>
                        Total Companies: <span className='font-medium text-violet-600'>{companies.length}</span>
                    </p>
                </motion.div>

                {/* Controls Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className='bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6 mb-6'
                >
                    <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                        <div className='flex items-center gap-4 w-full md:w-auto'>
                            <div className='relative flex-1 md:w-64'>
                                <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
                                <Input
                                    className="pl-10 border-gray-200 focus:ring-2 focus:ring-violet-500 w-full"
                                    placeholder="Search companies..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                            </div>
                            <Select 
                                value={sortBy} 
                                onValueChange={(value) => {
                                    console.log('Selecting new sort value:', value);
                                    setSortBy(value);
                                }}
                            >
                                <SelectTrigger className="w-[140px] border-gray-200">
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="newest">Newest First</SelectItem>
                                        <SelectItem value="oldest">Oldest First</SelectItem>
                                        <SelectItem value="a-z">A-Z</SelectItem>
                                        <SelectItem value="z-a">Z-A</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button 
                            onClick={() => navigate("/admin/companies/create")}
                            className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white w-full md:w-auto"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            New Company
                        </Button>
                    </div>
                </motion.div>

                {/* Table Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className='bg-white/50 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden'>
                        <CompaniesTable 
                            companies={sortedCompanies} 
                            key={sortBy} // Force re-render when sort changes
                        />
                    </div>
                </motion.div>

                {/* Empty State */}
                {companies.length === 0 && !input && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className='text-center py-12'
                    >
                        <Building2 className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-gray-900'>No companies yet</h3>
                        <p className='text-gray-500 mb-6'>Get started by creating your first company</p>
                        <Button 
                            onClick={() => navigate("/admin/companies/create")}
                            className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Company
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default Companies