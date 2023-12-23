import Draggable, { DraggableEvent, DraggableData, DraggableEventHandler } from 'react-draggable';
import React, { useState, useRef, useEffect } from 'react';
import { directoryState, cardState, dragState } from "@/atoms/state";
import { useRecoilState } from "recoil";
import { FaTrash , FaMarker } from 'react-icons/fa';
import { calculatePosition } from '@/lib/grid';

interface Props {
  folder: {
    id: number | null | undefined;
    name: string | null | undefined;
    createdAt: string | null | undefined;
    updatedAt: string | null | undefined;
  };
  index: number;
}

export default function Folder({ folder, index }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const folderRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(calculatePosition(index));
  const [directory, setDirectory] = useRecoilState(directoryState);
  const [card, setCard] = useRecoilState(cardState);
  const [drag, setDrag] = useRecoilState(dragState);

  const handleDrag: DraggableEventHandler = (e: DraggableEvent, data: DraggableData) => {
    // Update the position during drag
    setPosition((prevPosition) => ({ x: prevPosition.x + data.deltaX, y: prevPosition.y + data.deltaY }));
    setDrag({entity: "folder", filekey: null, id: folder.id});
    if (folderRef.current) {
        folderRef.current.style.zIndex = '10';
      }
  };

  const handleDragStop = () => {
    // Reset position after dragging stops
    setTimeout(() => {
        setPosition(calculatePosition(index));
        if (folderRef.current) {
          folderRef.current.style.zIndex = '0';
        }
      }, 180); 
  };

  useEffect(() => {
    const handleResize = () => {
      setPosition(calculatePosition(index));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [index]);

  return (
    <Draggable
      axis="both"
      handle=".handle"
      defaultPosition={{ x: 0, y: 0 }}
      position={position}
      grid={[5, 5]}
      scale={1}
      bounds="parent"
      onDrag={handleDrag}
      onStop={handleDragStop}
    >
      <div
        className="w-20 h-20 handle z-0 mx-12 mt-10"
        onMouseLeave={() =>{
          setShowDetails(false)
          if (folderRef.current) {
            folderRef.current.style.zIndex = '0';
          }
        }}
        ref={folderRef}
        onDoubleClick={() =>{ 
          setDirectory(prevDirectory => [...prevDirectory, { id: folder.id, name: folder.name }]);}}
        style={{
          position: 'absolute',
          cursor: 'move',
          transition: 'transform 0.12s ease', // Add a smooth transition effect
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <img src="/folder.png" alt="Folder Icon" draggable="false"/>
        <button key={folder.id}
          className="bold text-white bg-blue-700 hover:bg-blue-800 rounded-full text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 absolute top-0 right-0 mt-1 mr-1 w-5 h-5"
          onMouseEnter={() => {
            setShowDetails(true);
            if (folderRef.current) {
              folderRef.current.style.zIndex = '10';
            }
          }}
          type="button"
        >
            i
        </button>
        <div className="flex items-center place-content-center">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">{folder.name!.length > 12 ? `${folder.name!.substring(0, 12)}...` : folder.name}</span>
        </div>
        {showDetails && (
        <div className="absolute top-0 w-44">
          <div className='h-12'></div>
          <div className='h-auto p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-white'>
            <p className='text-amber-500'>Name:</p>
            <p>{folder.name}</p>
            <p className='text-amber-500'>Created:</p>
            <p> {new Date(folder.createdAt!).toLocaleString()}</p>
            <p className='text-amber-500'>Updated:</p>
            <p>{new Date(folder.updatedAt!).toLocaleString()}</p>
            <div className="flex space-x-2 mt-2">
              <button
                className="bg-red-500 text-white px-2 py-1 text-xs rounded flex items-center"
                onClick={() => setCard({ name: "Delete", shown: true,  folderId: folder.id, filekey: null, newName: null, url: null })}
              >
                <FaTrash/>
              </button>
              <button
                className="bg-gray-500 text-white px-2 py-1 text-xs rounded flex items-center"
                onClick={() => setCard({ name: "Rename", shown: true,  folderId: folder.id, filekey: null, newName: folder.name, url: null })}
              >
                <FaMarker/>
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </Draggable>
  );
}