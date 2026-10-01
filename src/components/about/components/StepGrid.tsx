"use client";
import { StepItem } from "@/lib/interfaces";
import FeatureCard from "./FeatureCard";
import GridRenderer from "./GridRenderer";

function StepGrid({ items }: { items: StepItem[] }) {

    return (
        <GridRenderer
            items={items}
            columns={{ sm: 2, lg: 3 }}
            renderItem={(item) => (
                <FeatureCard key={item.title} icon={<item.icon className="h-5 w-5" />} title={item.title}>
                    {item.desc}
                </FeatureCard>
            )}
        />
    );
}

export default StepGrid;