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
import Card from "./components/ui/Card"; 
import Loader from "./components/ui/Loader";
import EmptyState from "./components/ui/EmptyState"; 

import "./styles/global.css";
import "./styles/dashboard.css";
import "./styles/components.css";
import "./styles/variables.css";

/**
 * MAIN APPLICATION COMPONENT
 * -----------------------------------------------------
 * Handles global state (via Context) and routing between views.
 */
export default function App() {
    // Context hook pulls data from useDashboardData.js
    const { 
        loading, 
        error, 
        visitor, 
        orders, 
        aiInsights, 
        refreshDashboard 
    } = useDashboard();
    
    // UI State for routing and modals
    const [activeView, setActiveView] = useState('orders'); 
    // modal structure: { type: 'cancel' | 'return' | 'track', order: {id, name, ...} }
    const [modal, setModal] = useState({ type: null, order: null });

    // --- Action Handlers (Calling Backend API) ---

    /**
     * Handles confirmation for Cancel and Return modals.
     * @param {object} data - { reason, note }
     */
    const handleActionConfirm = async (data) => {
        // Retrieve the order object stored when the modal was opened
        const orderToActOn = modal.order; 
        
        if (!orderToActOn || !orderToActOn.id) {
            // Replace alert with a Modal/Toast in production
            alert("Error: Cannot find valid order ID for action.");
            setModal({ type: null, order: null });
            return;
        }
        
        try {
            let result;
            const orderId = orderToActOn.id; 

            if (modal.type === 'cancel') {
                // API call to the Node.js backend
                result = await api.cancelOrder(orderId, data.reason); 
            } else if (modal.type === 'return') {
                // API call to the Node.js backend
                result = await api.returnOrder(orderId, data.reason, data.note);
            } else {
                 throw new Error("Unknown action type.");
            }

            if (result.success) {
                // Re-fetch all data to show the updated status in the OrderCard
                refreshDashboard(); 
                alert(`Action Success: ${result.message}`);
            } else {
                throw new Error(result.message || "Action failed.");
            }
        } catch (err) {
            console.error(`Error processing ${modal.type}:`, err);
            // Show specific API error to the operator
            alert(`Error: ${err.message || `Failed to process ${modal.type}.`}`); 
        } finally {
            setModal({ type: null, order: null }); // Always close modal
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
    
    // 2. Error State (If main data fetch failed or API keys are bad)
    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <EmptyState 
                    title="Dashboard Connection Failed" 
                    subtitle={error} 
                    icon={<XCircle size={32} className="text-danger" />}
                />
            </div>
        );
    }
    
    // 3. Fallback for missing context (No email in URL)
    if (!visitor?.email) {
        return (
            <div style={{ padding: '24px' }}>
                <EmptyState 
                    title="No Visitor Context" 
                    subtitle="Please ensure the Dashboard is opened via the Zoho SalesIQ widget link containing the customer's email and chat ID." 
                    icon={<XCircle size={32} />}
                />
            </div>
        );
    }

    // 4. Main Application Grid
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
                                // Safely access deep properties
                                totalSpend: visitor.ecommerceProfile?.totalSpend || 0,
                                orderCount: visitor.ecommerceProfile?.orderCount || 0,
                                tags: visitor.ecommerceProfile?.tags || []
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
                        visitorId={visitor.email}
                        orders={orders}
                        // Pass modal handlers
                        onCancel={(order) => setModal({ type: 'cancel', order })}
                        onReturn={(order) => setModal({ type: 'return', order })}
                        onTrack={(order) => setModal({ type: 'track', order })}
                        refreshOrders={refreshDashboard}
                    />
                )}
                
                {activeView === 'analytics' && (
                    <div className="analytics-view">
                        <ShoppingGraph orders={orders} />
                        <Card title="Spending Metrics">
                            <EmptyState subtitle="Additional analytics charts coming soon..." icon={<BarChart2 size={24} />} />
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