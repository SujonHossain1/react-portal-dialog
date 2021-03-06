import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import * as styles from '../style/styles';

interface IProps {
    bodyStyle: React.CSSProperties;
}

export const Draggable: FC<IProps> = ({ children, bodyStyle }) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<HTMLDivElement>(null);
    const [isDragActive, setIsDragActive] = useState<boolean>(false);

    const initialPosition = useRef({ x: 0, y: 0 });

    const dragStartHandler = useCallback((event: MouseEvent) => {
        if (dragRef.current === event.target) {
            setIsDragActive(true);
            initialPosition.current = { x: event.x, y: event.y };
        }
    }, []);

    const draggingHandler = useCallback(
        (event: MouseEvent) => {
            if (isDragActive) {
                const { x, y } = initialPosition.current;

                if (boxRef.current) {
                    const { offsetLeft, offsetTop } = boxRef.current;

                    boxRef.current.style.left = `${offsetLeft -
                        (x - event.x)}px`;
                    boxRef.current.style.top = `${offsetTop - (y - event.y)}px`;
                }

                initialPosition.current = { x: event.x, y: event.y };
            }
        },
        [isDragActive]
    );

    const dragEndHandler = useCallback(() => {
        setIsDragActive(false);
        window.removeEventListener('mousemove', draggingHandler);
        window.removeEventListener('mouseup', dragEndHandler);
    }, [draggingHandler]);

    useEffect(() => {
        dragRef.current?.addEventListener('mousedown', dragStartHandler);
        window.addEventListener('mousemove', draggingHandler);
        window.addEventListener('mouseup', dragEndHandler);
    }, [dragEndHandler, dragStartHandler, draggingHandler]);

    return (
        <div ref={boxRef} style={bodyStyle} className="ReactPortalDialog__Body">
            <div
                ref={dragRef}
                style={styles.ReactPortalDialog__Move}
                className="ReactPortalDialog__Move"
            >
                Move Here
            </div>
            {children}
        </div>
    );
};
