import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const servicesList = [
    'SEO', 'Content Marketing', 'Social Media Marketing', 'PPC', 'Email Marketing',
    'Influencer Marketing', 'Affiliate Marketing', 'Video Marketing', 'Conversion Rate Optimization',
    'Web Design & Development', 'App Marketing', 'E-commerce Marketing', 'Analytics & Data',
    'Marketing Automation', 'Local SEO', 'Reputation Management', 'Mobile Marketing', 'Voice Search Optimization',
    'Content Strategy', 'Branding', 'Performance Marketing', 'Lead Generation', 'Community Management'
];

const metroCities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad'];

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();

    const changeHandler = (value) => {
        setSelectedValue(value);
    };

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue]);

    return (
        <div className="w-full max-w-md mx-auto bg-white p-4 max-h-[600px] overflow-y-auto">
            <h1 className="font-bold text-xl text-gray-800 mb-4">Filter Projects</h1>
            <hr className="mb-4" />

            {/* Service Category Filter */}
            <div className="mb-4">
                <h2 className="font-semibold text-lg text-gray-700 mb-2">Service Category</h2>
                <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                    <div className="flex flex-col space-y-3">
                        {servicesList.map((service, idx) => {
                            const serviceId = `service-${idx}`;
                            return (
                                <div key={idx} className="flex items-center space-x-3">
                                    <RadioGroupItem value={service} id={serviceId} className="w-5 h-5 border-2 font-light border-gray-400 checked:bg-[#17B169]" />
                                    <Label htmlFor={serviceId} className="text-gray-700">{service}</Label>
                                </div>
                            );
                        })}
                    </div>
                </RadioGroup>
            </div>

            {/* Location Filter */}
            <div className="mb-4">
                <h2 className="font-semibold text-lg text-gray-700 mb-2">Location</h2>
                <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                    <div className="flex flex-col space-y-3">
                        {metroCities.map((city, idx) => {
                            const cityId = `city-${idx}`;
                            return (
                                <div key={idx} className="flex items-center space-x-3">
                                    <RadioGroupItem value={city} id={cityId} className="w-5 h-5 border-2 border-gray-400 checked:bg-[#17B169]" />
                                    <Label htmlFor={cityId} className="text-gray-700">{city}</Label>
                                </div>
                            );
                        })}
                    </div>
                </RadioGroup>
            </div>

            {/* Reset and Apply Buttons */}
            <div className=" justify-between  items-center mt-4">
                <button
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg shadow transition-colors"
                    onClick={() => setSelectedValue('')}
                >
                    Reset Filters
                </button>
                <button
                    className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow-lg hover:bg-green-700 transition-colors"
                    onClick={() => dispatch(setSearchedQuery(selectedValue))}
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
};

export default FilterCard;
