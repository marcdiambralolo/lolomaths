"use client";
import { PillItem } from "@/lib/interfaces";
import GridRenderer from "./GridRenderer";
import Pill from "./Pill";

interface PillGridProps {
    items: PillItem[];
    columns?: { sm?: number; lg?: number };
}

function PillGrid({ items, columns = { sm: 2, lg: 4 } }: PillGridProps) {

    return (
        <GridRenderer
            items={items}
            columns={columns}
            renderItem={(item) => (
                <Pill
                    key={item.title}
                    icon={<item.icon className="h-5 w-5" />}
                    title={item.title}
                    desc={item.desc}
                    tooltip={item.tooltip}
                />
            )}
        />
    );
}

export default PillGrid;