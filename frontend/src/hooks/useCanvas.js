import { useState, useRef, useEffect } from 'react';

export const useCanvas = () => {
    const [stageScale, setStageScale] = useState(1);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
    const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });

    const stageRef = useRef();
    const isPanning = useRef(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    const updateCenterPosition = () => {
        const stage = stageRef.current;
        if (!stage) return;
        const scale = stage.scaleX();
        const x = (window.innerWidth / 2 - stage.x()) / scale;
        const y = (window.innerHeight / 2 - stage.y()) / scale;
        setCenterPos({ x, y });
    };

    const handleWheel = (e) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        const scaleBy = 1.05;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
        newScale = Math.max(0.25, Math.min(3, newScale));

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        setStageScale(newScale);
        setStagePos(newPos);
        setTimeout(updateCenterPosition, 0);
    };

    const handleMouseDown = (e) => {
        const clickedOnEmpty = e.target === stageRef.current;
        if (!clickedOnEmpty) return;

        isPanning.current = true;
        lastMousePos.current = {
            x: e.evt.clientX,
            y: e.evt.clientY,
        };
    };

    const handleMouseMove = (e) => {
        if (!isPanning.current) return;
        const dx = e.evt.clientX - lastMousePos.current.x;
        const dy = e.evt.clientY - lastMousePos.current.y;

        setStagePos((prev) => ({
            x: prev.x + dx,
            y: prev.y + dy,
        }));

        lastMousePos.current = {
            x: e.evt.clientX,
            y: e.evt.clientY,
        };

        setTimeout(updateCenterPosition, 0);
    };

    const handleMouseUp = () => {
        isPanning.current = false;
    };

    useEffect(() => {
        updateCenterPosition();
        const handleResize = () => updateCenterPosition();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return {
        stageScale,
        stagePos,
        centerPos,
        stageRef,
        handleWheel,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        updateCenterPosition
    };
};