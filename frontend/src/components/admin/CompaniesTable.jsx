import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Trash2, Eye } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CompaniesTable = ({ companies }) => {
    const { searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) return true;
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);

    return (
        <div className="rounded-xl overflow-hidden border border-gray-100">
            <Table>
                <TableCaption className="py-4 bg-gradient-to-r from-violet-50 to-cyan-50">
                    {filterCompany.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-3">🏢</div>
                            <p className="text-gray-500">No companies registered yet</p>
                        </div>
                    ) : (
                        `A list of ${filterCompany.length} registered companies`
                    )}
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gradient-to-r from-violet-50 to-cyan-50">
                        <TableHead className="font-semibold text-violet-900">Logo</TableHead>
                        <TableHead className="font-semibold text-violet-900">Name</TableHead>
                        <TableHead className="font-semibold text-violet-900">Date</TableHead>
                        <TableHead className="text-right font-semibold text-violet-900">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterCompany?.map((company) => (
                        <TableRow 
                            key={company._id}
                            className="hover:bg-gradient-to-r hover:from-violet-50/30 hover:to-cyan-50/30 transition-colors duration-200"
                        >
                            <TableCell>
                                <Avatar className="h-10 w-10 rounded-lg border-2 border-gray-100">
                                    <AvatarImage src={company.logo} className="object-contain p-1"/>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{company.name}</TableCell>
                            <TableCell className="text-gray-600">
                                {new Date(company.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </TableCell>
                            <TableCell className="text-right">
                                <Popover>
                                    <PopoverTrigger>
                                        <div className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                                            <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-40 p-2">
                                        <div className="space-y-1">
                                            <button 
                                                onClick={() => navigate(`/admin/companies/${company._id}`)}
                                                className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-violet-50 text-sm transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4 text-violet-600" />
                                                <span>Edit Company</span>
                                            </button>
                                            <button 
                                                className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-violet-50 text-sm transition-colors"
                                            >
                                                <Eye className="w-4 h-4 text-violet-600" />
                                                <span>View Details</span>
                                            </button>
                                            <button 
                                                className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-red-50 text-sm text-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable