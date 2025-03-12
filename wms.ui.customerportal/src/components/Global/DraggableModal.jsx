import React from 'react';
import Draggable from 'react-draggable';
import Paper from '@mui/material/Paper';

const DraggableModal = ({ children, modalPosition, setModalPosition, idHandle }) => {
  return (
    <Draggable
      handle={`#${idHandle}`}
      cancel={'[class*="MuiDialogContent-root"]'}
      position={modalPosition}
      onStop={(e, data) => setTimeout(() => setModalPosition({ x: data.x, y: data.y }), 1)}
    >
      <Paper>
        {children}
      </Paper>
    </Draggable>
  );
};

export default DraggableModal;
