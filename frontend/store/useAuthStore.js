import { create } from "zustand";
import { axiosInstance } from "../src/lib/axios";
import { toast } from "react-hot-toast"; // Ensure toast is imported
import io from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"

export const useAuthStore = create((set,get) => ({
    authUser: null, // Initial state for authUser
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true, // Track auth check status
    socket:null,

    // Method to check authentication
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("auth/check"); // Ensure baseURL is set
            set({ authUser: res.data }); // Update state with auth user data
            get().connectSocket()
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
            get().connectSocket();
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
            get().connectSocket();
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
            get.disconnectSocket();
        } catch (error) {
            const message = error.response?.data?.message || "Logout failed. Please try again.";
            toast.error(message);
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
    },

    connectSocket:()=>{
        const {authUser} = get()
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL,{
            query:{
                userId:authUser._id,
            }
        })
        socket.connect()

        set({socket:socket})

        socket.on("getOnlineUsers" ,(userIds)=>{
            set({onlineUsers:userIds})
        })
    },

    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect();
    }
}));
