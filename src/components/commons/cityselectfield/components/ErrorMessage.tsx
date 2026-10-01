"use client";

const ErrorMessage = ({ error }: { error: string }) => (
    <div className="mx-auto mt-2 max-w-xl text-left text-sm text-rose-700 dark:text-rose-300">
        {error}
    </div>
);

export default ErrorMessage;