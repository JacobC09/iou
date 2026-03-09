"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Counter({ total, className}: {
    total: number;
    className?: string, 
}) {
    const [count, setCount] = useState(0);

    const positive = total >= 0;
        
    useEffect(() => {
        const target = Math.abs(total);
        let start = 0;
        const step = Math.max(target / 40, 0.01);
        const interval = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(interval); }
            else setCount(start);
        }, 18);

        return () => clearInterval(interval);
    }, [total]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{delay: 0.2}}
        >
            <span className={className}>
                {positive ? "+" : "-"}${count.toFixed(2)}
            </span>
        </motion.div>
    );
}