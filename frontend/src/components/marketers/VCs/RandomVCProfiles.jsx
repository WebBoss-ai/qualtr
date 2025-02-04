import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { VC_API_END_POINT } from "@/utils/constant";

const VCProfileSkeleton = () => (
    <div className="animate-pulse flex space-x-4 p-4 border-b border-gray-200">
        <div className="rounded-full bg-gray-300 h-12 w-12"></div>
        <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        </div>
    </div>
);

const RandomVCProfiles = () => {
    const [vcs, setVCs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVCs = async () => {
            try {
                const response = await axios.get(`${VC_API_END_POINT}/random`);
                setVCs(response.data.vcs || []);
            } catch (err) {
                setError('Failed to fetch VC profiles.');
            } finally {
                setLoading(false);
            }
        };
        fetchVCs();
    }, []);

    if (error) {
        return <div className="bg-white shadow rounded-lg p-4 text-center text-gray-700">{error}</div>;
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recommended VCs</h2>
            </div>
            {loading ? (
                <>
                    <VCProfileSkeleton />
                    <VCProfileSkeleton />
                    <VCProfileSkeleton />
                </>
            ) : vcs.length === 0 ? (
                <p className="text-gray-700 text-center py-4">No VCs found.</p>
            ) : (
                <div className="divide-y divide-gray-200">
                    {vcs.map(vc => {
                        return (
                            <div key={vc._id} className="p-4 hover:bg-gray-50 transition duration-150 ease-in-out">
                                <div className="flex items-center space-x-4">
                                    <a href={vc.fundWebsite} className="flex-shrink-0">
                                        <img
                                            src={vc.logo || '/default-vc-logo.jpg'}
                                            alt={vc.fundName}
                                            className="h-12 w-12 rounded-full object-cover border border-gray-300"
                                        />
                                    </a>
                                    <div className="flex-1 min-w-0">
                                        <a href={vc.fundWebsite} className="text-sm font-medium text-gray-900 truncate hover:underline">
                                            {vc.fundName}
                                        </a>
                                        <p className="text-sm text-gray-600 truncate">{vc.fundType}</p>
                                        <p className="text-xs text-gray-500 truncate">{vc.stageOfInvestment.join(', ')}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RandomVCProfiles;
