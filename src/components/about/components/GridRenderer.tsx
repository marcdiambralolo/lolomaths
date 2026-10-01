"use client";

interface GridRendererProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    className?: string;
    columns?: {
        sm?: number;
        lg?: number;
    };
}

function GridRenderer<T>({
    items,
    renderItem,
    className = "",
    columns = { sm: 2, lg: 4 }
}: GridRendererProps<T>) {
    const colClasses = [
        "grid gap-3",
        `sm:grid-cols-${columns.sm}`,
        `lg:grid-cols-${columns.lg}`,
    ].join(" ");

    return (
        <div className={`${colClasses} ${className}`}>
            {items.map((item, index) => renderItem(item, index))}
        </div>
    );
}

export default GridRenderer;