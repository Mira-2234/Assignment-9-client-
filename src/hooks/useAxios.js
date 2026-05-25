"use client";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const axiosInstance = axios.create({ baseURL: "/api" });

export default function useAxios() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const id = axiosInstance.interceptors.response.use(
      (res) => res,
      async (err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          await logout();
          router.push("/login");
        }
        return Promise.reject(err);
      }
    );
    return () => axiosInstance.interceptors.response.eject(id);
  }, [logout, router]);

  return axiosInstance;
}
