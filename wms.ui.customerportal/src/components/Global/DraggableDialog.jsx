import React, { useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Dialog } from '@mui/material';

const DraggableDialog = React.memo(({ open, onClose, children }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: 'draggable-dialog',
    });

    const style = useMemo(() => ({
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        cursor: 'move',
    }), [transform]);

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" disableRestoreFocus>
                {children}
            </Dialog>
        </div>
    );
}); 

export default DraggableDialog;
