"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import toast from "react-hot-toast";
import { HiX, HiCheckCircle, HiXCircle } from "react-icons/hi";

export default function RequestsModal({ pet, onClose }) {
  const axios = useAxios();
  const qc    = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["petRequests", pet._id],
    queryFn: () => axios.get(`/requests/pet/${pet._id}`).then(r => r.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => axios.patch(`/requests/${id}`, { status }),
    onSuccess: (_, { status }) => {
      toast.success(`Request ${status}!`);
      qc.invalidateQueries(["petRequests", pet._id]);
      qc.invalidateQueries(["myListings"]);
    },
    onError: err => toast.error(err.response?.data?.message || "Action failed"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Adoption Requests</h2>
            <p className="text-xs text-gray-400">For: {pet.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition"><HiX size={18}/></button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-10"><div className="w-8 h-8 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin"/></div>
          ) : requests.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No requests yet for {pet.name}.</p>
          ) : requests.map(req => (
            <div key={req._id} className="border border-gray-100 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-sm text-gray-900">{req.requesterName}</p>
                  <p className="text-xs text-gray-400">{req.requesterEmail}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Pickup: {new Date(req.pickupDate).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</p>
                </div>
                <span className={`badge text-xs ${req.status==="approved"?"bg-green-100 text-green-700":req.status==="rejected"?"bg-red-100 text-red-600":"bg-amber-100 text-amber-700"}`}>
                  {req.status.charAt(0).toUpperCase()+req.status.slice(1)}
                </span>
              </div>
              <p className="text-xs text-gray-500 italic mb-3 line-clamp-2">"{req.message}"</p>
              {req.status === "pending" && (
                <div className="flex gap-2">
                  <button onClick={() => statusMutation.mutate({ id: req._id, status: "approved" })}
                    disabled={statusMutation.isPending}
                    className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-4 py-2 rounded-full transition disabled:opacity-60">
                    <HiCheckCircle/> Approve
                  </button>
                  <button onClick={() => statusMutation.mutate({ id: req._id, status: "rejected" })}
                    disabled={statusMutation.isPending}
                    className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-4 py-2 rounded-full transition disabled:opacity-60">
                    <HiXCircle/> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
