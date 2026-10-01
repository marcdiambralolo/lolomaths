'use client';
import LoadingRing from './LoadingRing';

const LoadingRings = () => (
    <>
        <LoadingRing
            delay={0}
            duration={3}
            size="inset-0"
            borderClassName="border-violet-300/20"
            arcColor="rgba(196, 181, 253, 0.95)"
        />
        <LoadingRing
            delay={0.1}
            duration={4}
            size="inset-3"
            borderClassName="border-fuchsia-300/20"
            arcColor="rgba(244, 114, 182, 0.9)"
        />
        <LoadingRing
            delay={0.2}
            duration={5}
            size="inset-6"
            borderClassName="border-indigo-300/20"
            arcColor="rgba(129, 140, 248, 0.88)"
        />
    </>
);

export default LoadingRings;