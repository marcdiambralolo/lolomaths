"use client";
import { TipItem } from "@/lib/interfaces";
import GridRenderer from "./GridRenderer";
import TipCard from "./TipCard";

function TipGrid({ items }: { items: TipItem[] }) {
    return (
        <GridRenderer
            items={items}
            columns={{ sm: 2 }}
            renderItem={(item) => (
                <TipCard
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    desc={item.desc}
                    color={item.color}
                />
            )}
        />
    );
}

export default TipGrid;