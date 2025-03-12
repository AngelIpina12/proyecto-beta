import React, { useState, useEffect, useRef } from 'react'
import ConfirmationModal from '../../../components/Global/ConfirmationModal';
import CustomAlert from '../../../components/Global/CustomAlert';

export const DashboardModal = ({ modals, setModals, userId, staticMode = false }) => {
    const [dragging, setDragging] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [animateAdd, setAnimateAdd] = useState(false);
    const [animateDeleting, setAnimateDeleting] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
    const [resizing, setResizing] = useState(null);
    const [isResizing, setIsResizing] = useState(false);

    // Referencia para controlar si estamos en proceso de arrastrar/redimensionar
    const isOperationActive = useRef(false);

    // Animación de agregar
    useEffect(() => {
        if (modals.length > 0) {
            setAnimateAdd(true);
        }
    }, [modals]);

    // Event listeners globales para detectar movimiento y finalización del mouse
    useEffect(() => {
        if (staticMode) return;

        const handleGlobalMouseMove = (e) => {
            if (dragging !== null) {
                handleMouseMove(e);
            }
            if (resizing) {
                handleResizeMove(e);
            }
        };
        const handleGlobalMouseUp = () => {
            if (dragging !== null) {
                setDragging(null);
                setIsResizing(false);
                isOperationActive.current = false;
            }
            if (resizing) {
                setIsResizing(false);
                setResizing(null);
                isOperationActive.current = false;
            }
        };
        if (dragging !== null || resizing) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
            document.body.style.userSelect = 'none';
            document.body.style.cursor = resizing ? 'nwse-resize' : 'grabbing';
        }
        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
    }, [dragging, resizing, staticMode]);

    // Cuando se inicia el ajuste de medida arrastrando el mouse por los costados
    const handleResizeStart = (id, e, direction) => {
        if (staticMode) return;
        e.stopPropagation();
        e.preventDefault();
        setDragging(null);
        setIsResizing(true);
        isOperationActive.current = true;
        const modal = modals.find((modal) => modal.id === id);
        if (!modal) return;
        setResizing({
            id,
            direction,
            initialX: e.clientX,
            initialY: e.clientY,
            initialWidth: modal.width,
            initialHeight: modal.height,
            initialLeft: modal.x,
            initialTop: modal.y,
        });
    };

    // Cuando se ajusta la medida arrastrando el mouse por los costados
    const handleResizeMove = (e) => {
        if (staticMode || !resizing) return;
        const {
            id,
            direction,
            initialX,
            initialY,
            initialWidth,
            initialHeight,
            initialLeft,
            initialTop
        } = resizing;
        setModals((prevModals) =>
            prevModals.map((modal) => {
                if (modal.id === id) {
                    let newWidth = initialWidth;
                    let newHeight = initialHeight;
                    let newX = initialLeft;
                    let newY = initialTop;
                    if (direction.includes("right")) {
                        newWidth = initialWidth + (e.clientX - initialX);
                    }
                    if (direction.includes("left")) {
                        newWidth = initialWidth - (e.clientX - initialX);
                        newX = initialLeft + (e.clientX - initialX);
                    }
                    if (direction.includes("bottom")) {
                        newHeight = initialHeight + (e.clientY - initialY);
                    }
                    if (direction.includes("top")) {
                        newHeight = initialHeight - (e.clientY - initialY);
                        newY = initialTop + (e.clientY - initialY);
                    }
                    const maxWidth = 800;
                    const maxHeight = 600;
                    newWidth = Math.max(Math.min(newWidth, maxWidth), 200);
                    newHeight = Math.max(Math.min(newHeight, maxHeight), 350);
                    return {
                        ...modal,
                        width: newWidth,
                        height: newHeight,
                        x: newX,
                        y: newY,
                        iframeHeight: newHeight - 50
                    };
                }
                return modal;
            })
        );
    };

    // Cuando se inicia el arrastre del modal
    const handleMouseDown = (id, e) => {
        if (staticMode) return;
        e.preventDefault();
        setIsResizing(true);
        setDragging(id);
        isOperationActive.current = true;
        const modal = modals.find((modal) => modal.id === id);
        setOffset({
            x: e.clientX - modal.x,
            y: e.clientY - modal.y,
        });
    };

    // Cuando se mueve el mouse mientras se arrastra el modal
    const handleMouseMove = (e) => {
        if (staticMode || dragging === null) return;
        setModals((prev) =>
            prev.map((modal) => {
                if (modal.id === dragging) {
                    let newX = e.clientX - offset.x;
                    let newY = e.clientY - offset.y;
                    const containerWidth = window.innerWidth;
                    const containerHeight = window.innerHeight;
                    newX = Math.max(0, newX);
                    newY = Math.max(0, newY);
                    newX = Math.min(newX, containerWidth - modal.width);
                    newY = Math.min(newY, containerHeight - modal.height);

                    return { ...modal, x: newX, y: newY };
                }
                return modal;
            })
        );
    };

    // Manejo de eliminación de modales
    const handleDelete = (id) => {
        if (staticMode) return;
        setModals((prev) =>
            prev.map((modal) =>
                modal.id === id ? { ...modal, confirmDelete: true } : modal
            )
        );
    };

    // Manejo de confirmación de eliminación de modales
    const handleConfirmDelete = (id) => {
        if (staticMode) return;
        setAnimateDeleting(id);
        setTimeout(() => {
            setModals((prevModals) => {
                const updatedModals = prevModals.filter(modal => modal.id !== id)
                    .map(modal => ({ ...modal, confirmDelete: false }));
                if (userId) {
                    localStorage.setItem(`modalsPosition_SET_${userId}`, JSON.stringify(updatedModals));
                    localStorage.setItem(`modalsPosition_VIEW_${userId}`, JSON.stringify(updatedModals));
                }
                return updatedModals;
            });
            setAnimateDeleting(null);
        }, 300);
        setAlert({ open: true, message: 'Modal eliminado correctamente.', severity: 'success' });
    };

    // Cuando se cancela la eliminación del modal
    const handleCancelDelete = (id) => {
        setModals((prev) =>
            prev.map((modal) =>
                modal.id === id ? { ...modal, confirmDelete: false } : modal
            )
        );
    };

    // Animación y estilos de los modales
    const modalStyle = (modal) => ({
        position: "absolute",
        width: `${modal.width}px`,
        height: `${modal.height}px`,
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#eee",
        zIndex: 1000,
        cursor: isResizing ? "nwse-resize" : "grab",
        userSelect: isResizing ? "none" : "text",
        color: "black",
        top: modal.y,
        left: modal.x,
        maxWidth: "800px",
        maxHeight: "600px",
        transition: (dragging === modal.id || resizing?.id === modal.id) ? "none" : "opacity 0.3s ease, transform 0.3s ease",
        opacity: animateAdd && animateDeleting !== modal.id ? 1 : 0,
        transform: animateAdd && animateDeleting !== modal.id ? "scale(1)" : "scale(0.6)",
        boxShadow: '3px 5px 5px rgba(0,0,0,0.6)',
    });

    return (
        <div style={{ width: "100%", height: "100vh", position: "relative", margin: 0, padding: 0 }}>
            {modals.map((modal) => (
                <div
                    key={modal.id}
                    style={{ ...modalStyle(modal), cursor: "default" }}
                >
                    {!staticMode && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                color: '#333',
                                padding: '5px',
                                zIndex: 2
                            }}
                            onClick={() => handleDelete(modal.id)}
                        >
                            ✖
                        </div>
                    )}
                    <div
                        style={{
                            backgroundColor: "#f0f0f0",
                            paddingBottom: "10px",
                            cursor: !staticMode ? "grab" : "default",
                            userSelect: "none",
                        }}
                        onMouseDown={!staticMode ? (e) => handleMouseDown(modal.id, e) : undefined}
                    >
                        {modal.name}
                    </div>
                    {!staticMode && (
                        <>
                            <div
                                style={{
                                    position: "absolute",
                                    width: "12px",
                                    height: "100%",
                                    right: 0,
                                    top: 0,
                                    cursor: "ew-resize",
                                    zIndex: 1
                                }}
                                onMouseDown={(e) => handleResizeStart(modal.id, e, "right")}
                            ></div>
                            <div
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "12px",
                                    bottom: 0,
                                    left: 0,
                                    cursor: "ns-resize",
                                    zIndex: 1
                                }}
                                onMouseDown={(e) => handleResizeStart(modal.id, e, "bottom")}
                            ></div>
                            <div
                                style={{
                                    position: "absolute",
                                    width: "12px",
                                    height: "12px",
                                    right: 0,
                                    bottom: 0,
                                    cursor: "nwse-resize",
                                    zIndex: 1
                                }}
                                onMouseDown={(e) => handleResizeStart(modal.id, e, "bottom-right")}
                            ></div>
                            <div
                                style={{
                                    position: "absolute",
                                    width: "12px",
                                    height: "100%",
                                    left: 0,
                                    top: 0,
                                    cursor: "ew-resize",
                                    zIndex: 1
                                }}
                                onMouseDown={(e) => handleResizeStart(modal.id, e, "left")}
                            ></div>
                            <div
                                style={{
                                    position: "absolute",
                                    width: "12px",
                                    height: "12px",
                                    left: 0,
                                    bottom: 0,
                                    cursor: "sw-resize",
                                    zIndex: 1
                                }}
                                onMouseDown={(e) => handleResizeStart(modal.id, e, "bottom-left")}
                            ></div>
                            <div
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "12px",
                                    top: 0,
                                    left: 0,
                                    cursor: "ns-resize",
                                    zIndex: 1
                                }}
                                onMouseDown={(e) => handleResizeStart(modal.id, e, "top")}
                            ></div>
                            <div
                                style={{
                                    position: "absolute",
                                    width: "12px",
                                    height: "12px",
                                    top: 0,
                                    right: 0,
                                    cursor: "sw-resize",
                                    zIndex: 1
                                }}
                                onMouseDown={(e) => handleResizeStart(modal.id, e, "top-right")}
                            ></div>
                            <div
                                style={{
                                    position: "absolute",
                                    width: "12px",
                                    height: "12px",
                                    left: 0,
                                    top: 0,
                                    cursor: "nwse-resize",
                                    zIndex: 1
                                }}
                                onMouseDown={(e) => handleResizeStart(modal.id, e, "top-left")}
                            ></div>
                        </>
                    )}
                    <div>
                        <iframe
                            title={modal.name}
                            src={modal.url}
                            style={{
                                width: '100%',
                                height: `${modal.iframeHeight || modal.height - 50}px`,
                                border: 'none',
                                borderRadius: '5px',
                                pointerEvents: isOperationActive.current ? 'none' : 'auto',
                            }}
                            allowFullScreen
                        ></iframe>
                        <ConfirmationModal
                            open={modal.confirmDelete || false}
                            onClose={() => handleCancelDelete(modal.id)}
                            onConfirm={() => handleConfirmDelete(modal.id)}
                            disableEnforceFocus
                        />
                    </div>
                </div>
            ))}
            <CustomAlert
                open={alert.open}
                onClose={() => setAlert({ ...alert, open: false })}
                severity={alert.severity}
                message={alert.message}
            />
        </div>
    );
};