'use client'
import { useEffect, useState } from "react";

const useScroll = (scrollThreshold = 0) => {
    const [scrolled, setScrolled] = useState(false);

    // 当面板高度大于屏幕高度，设置state值，所以需要监听面板高度
    useEffect(() => {
        const scrollHandler = () => {
            setScrolled(window.scrollY > scrollThreshold);
        }

        // 初始化检查一次
        scrollHandler();

        window.addEventListener('scroll', scrollHandler, {passive: true});
        return () => window.removeEventListener('scroll', scrollHandler);

    }, [scrollThreshold]);

    return scrolled;
}

export {useScroll}