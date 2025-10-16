import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SupplierContext from './SupplierContextDefs';

export const SupplierContextProvider = (props) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
	const [isSupplierLoggedin, setIsSupplierLoggedin] = useState(false);
	const [supplierData, setSupplierData] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const getSupplierAuthState = useCallback(async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem('supplier_token');
			if (!token) {
				setIsSupplierLoggedin(false);
				setSupplierData(null);
				setLoading(false);
				return;
			}

			const { data } = await axios.get(backendUrl + '/api/supplier/data', { 
				withCredentials: true,
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			
			if (data.success) {
				setIsSupplierLoggedin(true);
				setSupplierData(data.supplierData);
			} else {
				setIsSupplierLoggedin(false);
				setSupplierData(null);
				localStorage.removeItem('supplier_token');
			}
		} catch (error) {
			console.error('Auth error:', error);
			setIsSupplierLoggedin(false);
			setSupplierData(null);
			localStorage.removeItem('supplier_token');
			if (error.response?.status === 401) {
				toast.error('Session expired. Please login again.');
				navigate('/supplierlogin');
			}
		} finally {
			setLoading(false);
		}
	}, [backendUrl, navigate]);

	useEffect(() => {
		getSupplierAuthState();
	}, [getSupplierAuthState]);

	const getAuthHeaders = useCallback(() => {
		const token = localStorage.getItem('supplier_token');
		return token ? {
			'Authorization': `Bearer ${token}`
		} : {};
	}, []);

	const value = {
		backendUrl,
		isSupplierLoggedin, setIsSupplierLoggedin,
		supplierData, setSupplierData,
		loading,
		getSupplierAuthState,
		getAuthHeaders,
	};

	return (
		<SupplierContext.Provider value={value}>
			{props.children}
		</SupplierContext.Provider>
	);
};
