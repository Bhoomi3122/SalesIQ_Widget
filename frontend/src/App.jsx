import React, { useState } from "react";
import { useDashboard } from "./context/DashboardContext";
import { api } from "./services/api";
import { XCircle, BarChart2 } from "lucide-react"; 

import Layout from "./components/layout/Layout";
import Sidebar from "./components/layout/Sidebar";
import CustomerProfile from "./components/customer/CustomerProfile";
import OrdersPanel from "./components/orders/OrdersPanel";
import AiAssistant from "./components/ai/AiAssistant";
import ShoppingGraph from "./components/analytics/ShoppingGraph";

import CancelOrderModal from "./components/actions/CancelOrderModal";
import ReturnOrderModal from "./components/actions/ReturnOrderModal";
import TrackOrderModal from "./components/actions/TrackOrderModal";
import Modal from "./components/ui/Modal";
import Loader from "./components/ui/Loader";
import EmptyState from "./components/ui/EmptyState";

import "./styles/global.css";
import "./styles/dashboard.css";
import "./styles/components.css";
import "./styles/variables.css"; // Ensure this is imported for CSS vars

/**
 * MAIN APPLICATION COMPONENT
 * -----------------------------------------------------
 * Handles global state (via Context) and routing between views.
 */
export default function App() {
    // Context hook from useDashboardData.js
    const { 
        loading, 
        error, 
        visitor, 
        orders, 
        aiInsights, 
        refreshDashboard 
    } = useDashboard();
    
    // UI State for routing and modals
    const [activeView, setActiveView] = useState('orders'); // 'orders' | 'analytics'
    const [modal, setModal] = useState({ type: null, order: null });

    // --- Action Handlers (Calling Backend API) ---

    const handleActionConfirm = async ({ orderId, reason, note }) => {
        try {
            let result;
            if (modal.type === 'cancel') {
                result = await api.cancelOrder(orderId, reason);
            } else if (modal.type === 'return') {
                result = await api.returnOrder(orderId, reason, note);
            }

            if (result.success) {
                // Refresh data to update order status in the UI
                refreshDashboard();
                alert(`Action Success: ${result.message}`); // Use custom toast in prod
            } else {
                throw new Error(result.message || "Action failed.");
            }
        } catch (err) {
            console.error(`Error processing ${modal.type}:`, err);
            alert(`Error: Failed to process ${modal.type}. Check API logs.`); // Replace with Modal/Toast
        } finally {
            setModal({ type: null, order: null }); // Close modal
        }
    };
    
    // --- UI Rendering Logic ---

    // 1. Initial Load State
    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex' }}>
                <Loader text="Initializing OmniCom Dashboard..." />
            </div>
        );
    }
    
    // 2. Error State (If main data fetch failed)
    if (error) {
        return (
            <div className="p-4">
                <EmptyState 
                    title="Dashboard Connection Failed" 
                    subtitle={error} 
                    icon={<XCircle size={32} className="text-danger" />}
                />
            </div>
        );
    }

    // 3. Main Application Grid
    return (
        <>
            <Layout
                // LEFT SIDEBAR (Navigation + Customer Profile)
                sidebarContent={
                    <>
                        <Sidebar activeView={activeView} onViewChange={setActiveView} />
                        <CustomerProfile 
                            customer={{ 
                                ...visitor, 
                                // Pass LTV/Orders from Context
                                totalSpend: visitor.ecommerceProfile.totalSpend,
                                orderCount: visitor.ecommerceProfile.orderCount,
                            }} 
                        />
                    </>
                }
                // RIGHT PANEL (AI Assistant)
                rightPanelContent={
                    <AiAssistant 
                        sentiment={aiInsights.sentiment}
                        suggestions={aiInsights.suggestions}
                        recommendations={aiInsights.recommendations}
                    />
                }
            >
                {/* CENTER CONTENT based on activeView state */}
                {activeView === 'orders' && (
                    <OrdersPanel
                        orders={orders}
                        // Pass handlers to OrderCard via OrdersPanel
                        onCancel={(order) => setModal({ type: 'cancel', order })}
                        onReturn={(order) => setModal({ type: 'return', order })}
                        onTrack={(order) => setModal({ type: 'track', order })}
                        refreshOrders={refreshDashboard}
                    />
                )}
                
                {activeView === 'analytics' && (
                    <div className="analytics-view">
                        <ShoppingGraph orders={orders} />
                        <Card title="Order Volume by Month" style={{ minHeight: '300px' }}>
                            <EmptyState subtitle="Placeholder for future chart..." icon={<BarChart2 size={24} />} />
                        </Card>
                    </div>
                )}
                
                {activeView === 'settings' && (
                    <Card title="Settings">
                        <EmptyState title="API Configuration" subtitle="Settings panel is for future external configuration." />
                    </Card>
                )}

            </Layout>

            {/* --- MODAL RENDERING --- */}
            {modal.type === 'cancel' && (
                <CancelOrderModal 
                    isOpen={true} 
                    order={modal.order} 
                    onClose={() => setModal({ type: null, order: null })} 
                    onConfirm={handleActionConfirm}
                />
            )}
            
            {modal.type === 'return' && (
                <ReturnOrderModal 
                    isOpen={true} 
                    order={modal.order} 
                    onClose={() => setModal({ type: null, order: null })} 
                    onConfirm={handleActionConfirm} 
                />
            )}

            {modal.type === 'track' && (
                <TrackOrderModal
                    visible={true}
                    order={modal.order}
                    onClose={() => setModal({ type: null, order: null })}
                />
            )}
        </>
    );
}