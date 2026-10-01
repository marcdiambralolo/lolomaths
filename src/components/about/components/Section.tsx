"use client";

interface SectionProps {
    id?: string;
    className?: string;
    children: React.ReactNode;
}

function Section({ id, className = "", children }: SectionProps) {
    return (
        <section
            id={id}
            className={`mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 ${className}`}
        >
            {children}
        </section>
    );
}

export default Section;