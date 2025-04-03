import React, { useState } from 'react'
import AdminNavbar from '../shared/AdminNavbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { setUser } from '@/redux/authSlice'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { Loader2 } from 'lucide-react'

const RecruiterProfile = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        fullname: user?.fullname || '',
        email: user?.email || '',
        phone: user?.profile?.phone || '',
        company: user?.profile?.company || '',
        position: user?.profile?.position || '',
        linkedIn: user?.profile?.linkedIn || '',
        profilePhoto: user?.profile?.profilePhoto || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put(`${USER_API_END_POINT}/update-profile`, profileData, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-slate-50 to-cyan-50">
            <AdminNavbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                        Recruiter Profile
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input 
                                value={profileData.fullname}
                                onChange={(e) => setProfileData({...profileData, fullname: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input 
                                value={profileData.email}
                                disabled
                                className="bg-gray-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input 
                                value={profileData.phone}
                                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Company</Label>
                            <Input 
                                value={profileData.company}
                                onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Position</Label>
                            <Input 
                                value={profileData.position}
                                onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>LinkedIn Profile</Label>
                            <Input 
                                value={profileData.linkedIn}
                                onChange={(e) => setProfileData({...profileData, linkedIn: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label>Profile Photo URL</Label>
                            <Input 
                                value={profileData.profilePhoto}
                                onChange={(e) => setProfileData({...profileData, profilePhoto: e.target.value})}
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full mt-8 bg-gradient-to-r from-violet-600 to-cyan-600"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Updating...
                            </>
                        ) : 'Update Profile'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default RecruiterProfile;