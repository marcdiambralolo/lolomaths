"use client";

const FormContainer = ({ children, onSubmit }: { children: React.ReactNode; onSubmit: (e: React.FormEvent) => void }) => (
    <form
        onSubmit={onSubmit}
        className="flex w-full flex-col items-center justify-center gap-4"
    >
        {children}
    </form>
);

export default FormContainer;