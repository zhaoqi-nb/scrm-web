/* eslint-disable*/
import { useState, useEffect } from 'react';

let timer = null;

function useRem(uiSize) {
    const [remSize, setRemSize] = useState((window.innerWidth * 100) / uiSize);

    useEffect(() => {
        setFontSize();
        window.addEventListener('resize', setFontSize);
        return () => {
            window.removeEventListener('resize', setFontSize);
            window.document.querySelector('html').removeAttribute('style');
            timer && clearTimeout(timer);
        };
    }, []);

    function setFontSize() {
        timer = setTimeout(() => {
            const remSize = (window.innerWidth * 100) / uiSize;
            setRemSize(remSize);
            window.document.querySelector('html').setAttribute('style', `font-size: ${remSize}px;`);
        }, 200);
    }

    return remSize;
}

export default useRem;
