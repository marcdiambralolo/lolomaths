'use client';
import CacheLink from "@/components/commons/CacheLink";

const CardContainer = ({ children }: { children: React.ReactNode }) => (
    <CacheLink
        href={`/star/learning/historique/6a782428e1a75a8c30980456`}
        className="group relative block w-full overflow-hidden"
    >
        <div className="relative mx-auto w-full max-w-md">
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700/95 via-purple-700/95 to-indigo-800/95 px-6 py-6 backdrop-blur-sm text-center">
                    {children}
                </div>
            </div>
        </div>
    </CacheLink>
);

export default CardContainer;