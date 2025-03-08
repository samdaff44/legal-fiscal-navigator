import React, { FC } from 'react';

// Exemple de composant après amélioration avec TypeScript et destructuration
interface MyComponentProps {
    title: string;
    description: string;
}

const MyComponent: FC<MyComponentProps> = ({ title, description }) => (
    <div>
        <h1>{title}</h1>
        <p>{description}</p>
    </div>
);

export default MyComponent;
