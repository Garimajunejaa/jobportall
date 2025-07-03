import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
        file: user?.profile?.resume || "",
        location: user?.profile?.location || "",
        profilePhoto: user?.profile?.profilePhoto || ""
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            const formData = new FormData();
            formData.append("fullname", input.fullname);
            formData.append("email", input.email);
            formData.append("phoneNumber", input.phoneNumber);
            formData.append("bio", input.bio);
            formData.append("skills", input.skills);
            
            if (input.file instanceof File) {
                formData.append("file", input.file);
            }

            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success('Profile updated successfully');
                setOpen(false);
                
                // Resume warning
                if (!input.file && !user?.profile?.resume) {
                    toast.warning('Adding a resume is recommended for job applications');
                }
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-xl overflow-y-auto max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                        Update Profile
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullname" className="text-gray-700">Full Name</Label>
                                <Input
                                    id="fullname"
                                    name="fullname"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="border-gray-200 focus:ring-violet-500"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className="border-gray-200 focus:ring-violet-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-gray-700">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={input.phoneNumber}
                                onChange={changeEventHandler}
                                className="border-gray-200 focus:ring-violet-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio" className="text-gray-700">Bio</Label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={input.bio}
                                onChange={changeEventHandler}
                                className="w-full h-24 rounded-md border border-gray-200 focus:ring-violet-500 p-2"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="skills" className="text-gray-700">Skills (comma separated)</Label>
                            <Input
                                id="skills"
                                name="skills"
                                value={input.skills}
                                onChange={changeEventHandler}
                                className="border-gray-200 focus:ring-violet-500"
                                placeholder="e.g. React, Node.js, TypeScript"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-gray-700">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="border-gray-200 focus:ring-violet-500"
                                placeholder="Your location"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="profilePhoto" className="text-gray-700">Profile Image</Label>
                            <Input
                                id="profilePhoto"
                                name="profilePhoto"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    setInput({ ...input, file });
                                }}
                                className="border-gray-200 focus:ring-violet-500"
                            />
                            {input.profilePhoto && typeof input.profilePhoto === 'string' && (
                                <img src={input.profilePhoto} alt="Profile" className="mt-2 h-20 w-20 rounded-full object-cover" />
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="file" className="text-gray-700">Resume (PDF)</Label>
                            <Input
                                id="file"
                                name="file"
                                type="file"
                                accept="application/pdf"
                                onChange={fileChangeHandler}
                                className="border-gray-200 focus:ring-violet-500"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        {loading ? (
                            <Button disabled className="w-full bg-gray-100">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Updating...
                            </Button>
                        ) : (
                            <Button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
                            >
                                Update Profile
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog