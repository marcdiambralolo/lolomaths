"use client";
import { FeatureItem } from "@/lib/interfaces";
import FeatureCard from "./FeatureCard";
import GridRenderer from "./GridRenderer";

interface FeatureGridProps {
    items: FeatureItem[];
}

function FeatureGrid({ items }: FeatureGridProps) {

    return (
        <GridRenderer
            items={items}
            columns={{ sm: 2, lg: 4 }}
            renderItem={(item) => (
                <FeatureCard key={item.title} icon={<item.icon className="h-5 w-5" />} title={item.title}>
                    {item.desc}
                </FeatureCard>
            )}
        />
    );
}

export default FeatureGrid;