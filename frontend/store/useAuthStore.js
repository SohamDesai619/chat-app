import { create } from "zustand";
import { axiosInstance } from "../src/lib/axios";
import { toast } from "react-hot-toast"; // Ensure toast is imported

export const useAuthStore = create((set) => ({
    authUser: null, // Initial state for authUser
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true, // Track auth check status

    // Method to check authentication
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("auth/check"); // Ensure baseURL is set
            set({ authUser: res.data }); // Update state with auth user data
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null }); // Reset authUser to null on error
        } finally {
            set({ isCheckingAuth: false }); // Mark auth check as complete
        }
    },

    // Method for user signup
    signup: async (data) => {
        set({ isSigningUp: true }); // Start signing up process
        try {
            const res = await axiosInstance.post("auth/signup", data);
            toast.success("Account created successfully");
            set({ authUser: res.data }); // Update state with new auth user
        } catch (error) {
            console.log("Error during signup:", error);
            const message = error.response?.data?.message || "Signup failed. Please try again.";
            toast.error(message);
        } finally {
            set({ isSigningUp: false }); // End signing up process
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
        } catch (error) {
            // Safely handle the error and log the appropriate message
            const message = error.response?.data?.message || error.message || "Login failed. Please try again.";
            toast.error(message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout:async ()=>{
        try {
            await axiosInstance.post("auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile:async(data)=>{
        set({isUpdatingProfile:true});
        try {
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Profile Updated Successfully");
        } catch (error) {
            console.log("error in update profile",error);
            toast.error(error.response.data.message);
            
        }finally{
            set({isUpdatingProfile:false})
        }
    }
}));
