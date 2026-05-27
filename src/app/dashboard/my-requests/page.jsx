"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import useAxios from "@/hooks/useAxios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loading from "@/app/loading";
import { HiEye, HiTrash, HiHeart } from "react-icons/hi";

const statusCls = {
  pending:  "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

export default function MyRequestsPage() {
  const axios = useAxios();
  const qc    = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["myRequests"],
    queryFn: () => axios.get("/requests").then(r => r.data),
  });

  const cancelMutation = useMutation({
    mutationFn: id => axios.delete(`/requests/${id}`),
    onSuccess: () => { toast.success("Request cancelled"); qc.invalidateQueries(["myRequests"]); },
    onError:   err => toast.error(err.response?.data?.message || "Cancel failed"),
  });

  const handleCancel = req =>
    Swal.fire({ title: "Cancel Request?", text: `Cancel adoption request for ${req.petName}?`,
      icon: "warning", showCancelButton: true, confirmButtonColor: "#c93050",
      cancelButtonColor: "#6b7280", confirmButtonText: "Yes, cancel" })
    .then(r => r.isConfirmed && cancelMutation.mutate(req._id));

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
        <p className="text-gray-500 mt-1 text-sm">Track all your adoption applications.</p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <HiHeart className="mx-auto text-gray-300 text-6xl mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No requests yet</h3>
          <Link href="/pets" className="btn btn-primary inline-block text-center mt-4">Browse Pets</Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Pet","Requested","Pickup","Status","Actions"].map(h => (
                    <th key={h} className={`px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide ${h==="Actions"?"text-right":""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map(req => (
                  <tr key={req._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={req.petImage} alt={req.petName} className="w-10 h-10 rounded-xl object-cover" />
                        <span className="font-medium text-sm text-gray-900">{req.petName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{new Date(req.pickupDate).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</td>
                    <td className="px-5 py-4">
                      <span className={`badge text-xs ${statusCls[req.status]}`}>
                        {req.status.charAt(0).toUpperCase()+req.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/pets/${req.petId}`} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition"><HiEye size={15}/></Link>
                        {req.status !== "approved" && (
                          <button onClick={() => handleCancel(req)} className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition"><HiTrash size={15}/></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {requests.map(req => (
              <div key={req._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <img src={req.petImage} alt={req.petName} className="w-12 h-12 rounded-xl object-cover"/>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{req.petName}</p>
                    <span className={`badge text-xs mt-0.5 ${statusCls[req.status]}`}>{req.status.charAt(0).toUpperCase()+req.status.slice(1)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                  <div><span className="block text-gray-400">Requested</span>{new Date(req.createdAt).toLocaleDateString()}</div>
                  <div><span className="block text-gray-400">Pickup</span>{new Date(req.pickupDate).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/pets/${req.petId}`} className="flex-1 flex items-center justify-center gap-1 text-xs font-medium bg-blue-50 text-blue-600 py-2 rounded-xl">
                    <HiEye size={13}/> View
                  </Link>
                  {req.status !== "approved" && (
                    <button onClick={() => handleCancel(req)} className="flex-1 flex items-center justify-center gap-1 text-xs font-medium bg-red-50 text-red-500 py-2 rounded-xl">
                      <HiTrash size={13}/> Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
