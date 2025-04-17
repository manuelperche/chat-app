import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { LoginFormData, SignUpFormData } from "../types.js";
// import { io } from "socket.io-client";

// const BASE_URL =
//   import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

interface User {
  _id: string;
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  // socket: Socket | null;
  checkAuth: () => Promise<void>;
  signup: (data: SignUpFormData) => Promise<void>;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: string) => Promise<void>;
  //   connectSocket: () => void;
  //   disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/users/me");
      set({ authUser: res.data });
      //   get().connectSocket();
    } catch (error: unknown) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      await axiosInstance.post("/users", data);
      toast.success("Account created successfully");
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/sessions", data);
      set({ authUser: res.data.user });
      toast.success("Logged in successfully");

      //   get().connectSocket();
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.delete("/sessions");
      set({ authUser: null });
      toast.success("Logged out successfully");
      //   get().disconnectSocket();
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/users", {
        ...get().authUser,
        profilePic: data,
      });
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  //   connectSocket: () => {
  //     const { authUser } = get();
  //     if (!authUser || get().socket?.connected) return;

  //     const socket = io(BASE_URL, {
  //       query: {
  //         userId: authUser._id,
  //       },
  //     });
  //     socket.connect();

  //     set({ socket: socket });

  //     socket.on("getOnlineUsers", (userIds) => {
  //       set({ onlineUsers: userIds });
  //     });
  //   },
  //   disconnectSocket: () => {
  //     if (get().socket?.connected) get().socket.disconnect();
  //   },
}));
