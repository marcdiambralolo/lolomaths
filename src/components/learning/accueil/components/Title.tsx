'use client';

const Title = () => (
    <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
        <span className="bg-gradient-to-r from-amber-200 via-yellow-200 to-orange-200 bg-clip-text text-transparent">
            Le classement
        </span>
        {" "}
        <span className="relative inline-block">
            est tombé
            <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M1 5.5C67 -0.5 133 -0.5 199 5.5" stroke="url(#underlineGrad)" strokeWidth="2" strokeLinecap="round" />
                <defs>
                    <linearGradient id="underlineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#FCD34D" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#FCD34D" stopOpacity="0.3" />
                    </linearGradient>
                </defs>
            </svg>
        </span>
    </h3>
);

export default Title;