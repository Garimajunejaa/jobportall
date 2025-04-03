import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { Loader2 } from 'lucide-react'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        if (!companyName.trim()) {
            toast.error('Please enter a company name');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, 
                { companyName }, 
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-r from-violet-50 via-teal-50 to-cyan-50'>
            <Navbar />
            <div className='max-w-2xl mx-auto px-4 py-10'>
                <div className='bg-white rounded-2xl shadow-lg p-8'>
                    <div className='mb-8'>
                        <h1 className='text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent mb-2'>
                            Create New Company
                        </h1>
                        <p className='text-gray-500'>
                            Start by giving your company a name. You can add more details later.
                        </p>
                    </div>

                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label className="text-gray-700">Company Name</Label>
                            <Input
                                type="text"
                                className="border-gray-200 focus:ring-2 focus:ring-violet-500"
                                placeholder="e.g. Microsoft, Apple, Google"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>

                        <div className='flex items-center gap-3 pt-4'>
                            <Button 
                                variant="outline" 
                                onClick={() => navigate("/admin/companies")}
                                className="hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200"
                            >
                                Cancel
                            </Button>
                            {loading ? (
                                <Button disabled className="bg-gray-100 flex-1">
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </Button>
                            ) : (
                                <Button 
                                    onClick={registerNewCompany}
                                    className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
                                >
                                    Create Company
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate