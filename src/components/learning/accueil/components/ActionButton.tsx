'use client';
import { ChevronRight, Trophy } from "lucide-react";

const ActionButton = () => (
    <div className="mt-5 flex justify-center">
        <div className="flex w-full max-w-sm items-center justify-between bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 transition-all duration-300 hover:bg-white/20 group-hover:bg-white/20">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg transition-all duration-500 group-hover:scale-110">
                        <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-amber-400 opacity-75" />
                    <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-amber-400" />
                </div>
                <span className="text-sm font-bold text-white transition-colors duration-300 group-hover:text-amber-200">
                    Voir le classement complet
                </span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-all duration-500 group-hover:scale-110 group-hover:bg-white/30">
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
        </div>
    </div>
);

export default ActionButton;