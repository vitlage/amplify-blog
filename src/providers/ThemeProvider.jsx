"use client";

import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useEffect, useState } from "react";

const ThemeProvider = ({ children }) => {
    const { theme } = useContext(ThemeContext);
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    if (!mounted) {
        // Return children without theme class during SSR to prevent hydration mismatch
        return <div>{children}</div>;
    }
    
    return <div className={theme}>{children}</div>;
};

export default ThemeProvider;