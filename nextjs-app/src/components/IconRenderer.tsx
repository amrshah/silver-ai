"use client";

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface IconRendererProps extends LucideProps {
    name: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({ name, ...props }) => {
    // @ts-ignore - Dynamic access to Lucide icons
    const IconComponent = LucideIcons[name];

    if (!IconComponent) {
        return <LucideIcons.HelpCircle {...props} />;
    }

    return <IconComponent {...props} />;
};

export default IconRenderer;
