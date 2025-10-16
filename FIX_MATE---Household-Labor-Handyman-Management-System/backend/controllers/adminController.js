import User from '../models/userModel.js';
import Supplier from '../models/supplierModel.js';
import Vendor from '../models/vendorModel.js';
import Delivery from '../models/deliveryModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import SupplyOrder from '../models/supplyOrderModel.js';

export const getUsersCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (err) {
        console.error('Error getting users count:', err);
        res.status(200).json({ count: 0 });
    }
};

export const getSuppliersCount = async (req, res) => {
    try {
        const count = await Supplier.countDocuments();
        res.json({ count });
    } catch (err) {
        console.error('Error getting suppliers count:', err);
        res.status(200).json({ count: 0 });
    }
};

export const getVendorsCount = async (req, res) => {
    try {
        const count = await Vendor.countDocuments();
        res.json({ count });
    } catch (err) {
        console.error('Error getting vendors count:', err);
        res.status(200).json({ count: 0 });
    }
};

export const getDeliveryDriversCount = async (req, res) => {
    try {
        const count = await Delivery.countDocuments();
        res.json({ count });
    } catch (err) {
        console.error('Error getting delivery drivers count:', err);
        res.status(200).json({ count: 0 });
    }
};

export const getProductsCount = async (req, res) => {
    try {
        const count = await Product.countDocuments();
        res.json({ count });
    } catch (err) {
        console.error('Error getting products count:', err);
        res.status(200).json({ count: 0 });
    }
};

export const getAdminRevenue = async (req, res) => {
    try {
        // Helper: normalize status
        const norm = (s) => (typeof s === 'string' ? s.trim().toLowerCase() : '');

        // VENDOR: completed service orders
        const vendorOrders = await Order.find({});
        const completedVendorOrders = vendorOrders.filter(o => norm(o.status) === 'done' || norm(o.status) === 'completed');
        const vendorAdminFee = completedVendorOrders.reduce((sum, order) => {
            const serviceFee = Number(order.serviceFee) || null; // already the admin fee if present
            if (serviceFee !== null) return sum + serviceFee;
            const totalAmount = Number(order.totalAmount) || 0;
            // fallback: 20% of total amount
            return sum + (totalAmount * 0.2);
        }, 0);

        // SUPPLIER: delivered product orders
        const supplyOrders = await SupplyOrder.find({});
        const deliveredSupplyOrders = supplyOrders.filter(o => {
            const s = norm(o.status);
            return s === 'delivered' || s === 'delivered✔' || s === 'complete' || s === 'completed';
        });
        const supplierAdminFee = deliveredSupplyOrders.reduce((sum, order) => {
            // prefer explicit serviceFee if available
            const serviceFee = (order.serviceFee !== undefined && order.serviceFee !== null) ? Number(order.serviceFee) : null;
            if (serviceFee !== null && !Number.isNaN(serviceFee)) return sum + serviceFee;

            // compute gross order value via totalAmount or amount*price
            const totalAmount = Number(order.totalAmount);
            if (!Number.isNaN(totalAmount) && totalAmount > 0) return sum + (totalAmount * 0.2);

            const qty = Number(order.amount) || 1;
            const price = Number(order?.productId?.price) || Number(order?.price) || 0;
            const gross = qty * price;
            return sum + (gross * 0.2);
        }, 0);

        // DELIVERY: admin gets 20% of delivery fee (delivery fee = 10% of order value)
        const deliveryAdminFee = deliveredSupplyOrders.reduce((sum, order) => {
            // consider delivered orders; if available use totalAmount or qty*price
            const totalAmount = Number(order.totalAmount);
            let gross = 0;
            if (!Number.isNaN(totalAmount) && totalAmount > 0) {
                gross = totalAmount;
            } else {
                const qty = Number(order.amount) || 1;
                const price = Number(order?.productId?.price) || Number(order?.price) || 0;
                gross = qty * price;
            }
            const deliveryFee = gross * 0.1; // platform charges 10% for delivery
            const adminCut = deliveryFee * 0.2; // admin gets 20% of delivery fee
            return sum + adminCut;
        }, 0);

        const totalRevenue = vendorAdminFee + supplierAdminFee + deliveryAdminFee;

        // Recent activity (top 10 by updatedAt or createdAt)
        const vendorActivities = completedVendorOrders.map(order => ({
            type: 'Vendor Service Fee (20%)',
            amount: (Number(order.serviceFee) || (Number(order.totalAmount) || 0) * 0.2),
            date: new Date(order.updatedAt || order.createdAt || Date.now())
        }));
        const supplierActivities = deliveredSupplyOrders.map(order => {
            const amount = (order.serviceFee !== undefined && order.serviceFee !== null)
                ? Number(order.serviceFee)
                : (Number(order.totalAmount) || ((Number(order.amount) || 1) * (Number(order?.productId?.price) || Number(order?.price) || 0))) * 0.2;
            return {
                type: 'Supplier Product Fee (20%)',
                amount,
                date: new Date(order.updatedAt || order.createdAt || Date.now())
            };
        });
        const deliveryActivities = deliveredSupplyOrders.map(order => {
            const gross = (Number(order.totalAmount) || ((Number(order.amount) || 1) * (Number(order?.productId?.price) || Number(order?.price) || 0)));
            const amount = (gross * 0.1) * 0.2; // 20% of 10%
            return {
                type: 'Delivery Admin Commission (20% of 10%)',
                amount,
                date: new Date(order.updatedAt || order.createdAt || Date.now())
            };
        });

        const recentActivity = [...vendorActivities, ...supplierActivities, ...deliveryActivities]
            .sort((a, b) => b.date - a.date)
            .slice(0, 10)
            .map(a => ({ ...a, date: a.date.toLocaleDateString() }));

        res.json({
            totalRevenue,
            vendorRevenue: vendorAdminFee,
            supplierRevenue: supplierAdminFee,
            deliveryRevenue: deliveryAdminFee,
            recentActivity
        });
    } catch (err) {
        console.error('Error getting admin revenue:', err);
        res.status(200).json({
            totalRevenue: 0,
            vendorRevenue: 0,
            supplierRevenue: 0,
            deliveryRevenue: 0,
            recentActivity: []
        });
    }
};