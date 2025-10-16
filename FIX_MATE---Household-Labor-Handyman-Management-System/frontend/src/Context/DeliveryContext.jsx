import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DeliveryContext = createContext();

const DeliveryContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const [deliveryData, setDeliveryData] = useState(null);
  const [isDeliveryLoggedin, setIsDeliveryLoggedin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  const checkAuth = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + '/api/delivery/profile');
      
      if (data.success && data.delivery) {
        setDeliveryData(data.delivery);
        setIsDeliveryLoggedin(true);
      } else {
        setDeliveryData(null);
        setIsDeliveryLoggedin(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setDeliveryData(null);
      setIsDeliveryLoggedin(false);
    } finally {
      setLoading(false);
    }
  };

  // Get delivery profile
  const getDeliveryProfile = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + '/api/delivery/profile');
      
      if (data.success && data.delivery) {
        setDeliveryData(data.delivery);
        return data.delivery;
      } else {
        toast.error(data.message || 'Failed to get profile');
        return null;
      }
    } catch (error) {
      console.error('Get profile error:', error);
      toast.error('Failed to get profile');
      return null;
    }
  };

  // Update delivery profile
  const updateDeliveryProfile = async (updateData) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(backendUrl + '/api/delivery/profile', updateData);
      
      if (data.success && data.delivery) {
        setDeliveryData(data.delivery);
        toast.success('Profile updated successfully');
        return true;
      } else {
        toast.error(data.message || 'Failed to update profile');
        return false;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      await axios.post(backendUrl + '/api/delivery/logout');
      setDeliveryData(null);
      setIsDeliveryLoggedin(false);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      setDeliveryData(null);
      setIsDeliveryLoggedin(false);
    }
  };

  const value = {
    deliveryData,
    setDeliveryData,
    isDeliveryLoggedin,
    setIsDeliveryLoggedin,
    loading,
    backendUrl,
    getDeliveryProfile,
    updateDeliveryProfile,
    logout,
    checkAuth
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <DeliveryContext.Provider value={value}>
      {props.children}
    </DeliveryContext.Provider>
  );
};

export default DeliveryContextProvider;