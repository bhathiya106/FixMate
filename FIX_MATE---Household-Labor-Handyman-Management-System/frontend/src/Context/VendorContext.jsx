import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const VendorContext = createContext();

export const VendorContextProvider = (props) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
	const [isVendorLoggedin, setIsVendorLoggedin] = useState(false);
	const [vendorData, setVendorData] = useState(null);
	const [loading, setLoading] = useState(true);

	const getVendorAuthState = async () => {
		setLoading(true);
		try {
			console.log('Checking vendor auth state...');
			const { data } = await axios.get(backendUrl + '/api/vendor/data', { withCredentials: true });
			console.log('Vendor auth response:', data);
			if (data.success) {
				setIsVendorLoggedin(true);
				setVendorData(data.vendor);
				console.log('Vendor logged in:', data.vendor);
			} else {
				setIsVendorLoggedin(false);
				setVendorData(null);
				console.log('Vendor not authenticated:', data.message);
			}
		} catch (error) {
			setIsVendorLoggedin(false);
			setVendorData(null);
			console.error('Vendor auth error:', error.response?.data || error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getVendorAuthState();
		// eslint-disable-next-line
	}, []);

	const value = {
		backendUrl,
		isVendorLoggedin, setIsVendorLoggedin,
		vendorData, setVendorData,
		loading,
		getVendorAuthState,
	};

	return (
		<VendorContext.Provider value={value}>
			{props.children}
		</VendorContext.Provider>
	);
};
