'use client';
import { Sparkles, Star, Zap } from 'lucide-react';
import { FloatingParticle } from './FloatingParticle';

const PARTICLES = [
    { Icon: Star, delay: 0, x: '15%', y: '20%', color: 'text-violet-300' },
    { Icon: Sparkles, delay: 1, x: '85%', y: '25%', color: 'text-fuchsia-300' },
    { Icon: Zap, delay: 2, x: '20%', y: '75%', color: 'text-indigo-300' },
    { Icon: Star, delay: 1.5, x: '80%', y: '70%', color: 'text-violet-200' },
    { Icon: Sparkles, delay: 0.5, x: '10%', y: '50%', color: 'text-purple-200' },
    { Icon: Zap, delay: 2.5, x: '90%', y: '45%', color: 'text-amber-200' },
];

const FloatingParticlesList = () => (
    <>
        {PARTICLES.map((particle, index) => (
            <FloatingParticle
                key={index}
                Icon={particle.Icon}
                delay={particle.delay}
                x={particle.x}
                y={particle.y}
                color={particle.color}
            />
        ))}
    </>
);

export default FloatingParticlesList;