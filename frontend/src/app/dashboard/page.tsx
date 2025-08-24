"use client";

import { useApp } from "@/contexts/AppProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MyButton } from "../components/ui-components/my-button";
import { Candidate } from "@/types";
import { CandidateCard } from "../components/ui-components/candidate-card";
import { CreateCandidateModal } from "../components/modals/create-candidate-modal";

export default function DashboardPage() {
  const {
    currentUser,
    logout,
    loading,
    candidates,
    candidatesLoading,
    createCandidate,
    updateCandidate,
    deleteCandidate,
  } = useApp();
  const router = useRouter();
  const [isCreateCandidateModalOpen, setIsCreateCandidateModalOpen] =
    useState(false);
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }
  const handleAddCandidate = () => {
    setIsCreateCandidateModalOpen(true);
  };
  return (
    <div className="min-h-screen bg-gray-50 px-[10%]">
      <CreateCandidateModal
        isOpen={isCreateCandidateModalOpen}
        onClose={() => setIsCreateCandidateModalOpen(false)}
      />
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {currentUser.name}!
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Candidates Section */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {/* Header with title and add button */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Candidates:
                </h3>
                <MyButton
                  title="+ Add Candidate"
                  onClick={handleAddCandidate}
                />
              </div>

              {/* Candidates Grid */}
              <div className="flex flex-col gap-4">
                {candidatesLoading ? (
                  <div className="col-span-full text-center py-8">
                    <div className="text-gray-500">Loading candidates...</div>
                  </div>
                ) : candidates.length > 0 ? (
                  candidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                  ))
                ) : (
                  /* Empty state when no candidates */
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="mt-2">No candidates found</p>
                    <p className="text-sm">
                      Get started by adding your first candidate
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
