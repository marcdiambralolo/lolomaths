"use client";
import React from "react";

const CityFieldContainer = ({ children, ref }: { children: React.ReactNode; ref: React.Ref<HTMLDivElement>; }) => (
    <div ref={ref} className="w-full">
        <div className="mx-auto w-full max-w-xl text-center">
            {children}
        </div>
    </div>
);

export default CityFieldContainer;