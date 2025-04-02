// src/components/ui/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', type = 'button' }) => {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            className={`bg-primary text-white p-3 rounded-xl shadow-button transition ${className}`}
        >
            {children}
        </motion.button>
    );
};

export default Button;
