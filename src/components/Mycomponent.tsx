
import React, { FC } from 'react';
import { cn } from '@/lib/utils';

/**
 * Interface définissant les propriétés du composant
 */
interface MyComponentProps {
    title: string;
    description: string;
    className?: string;
    onClick?: () => void;
}

/**
 * Composant qui affiche un titre et une description avec un style amélioré
 * et une possibilité d'interaction
 */
const MyComponent: FC<MyComponentProps> = ({ 
    title, 
    description, 
    className, 
    onClick 
}) => {
    return (
        <div 
            className={cn(
                "rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow",
                onClick && "cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default MyComponent;
