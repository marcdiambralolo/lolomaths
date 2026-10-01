"use client";
import { motion, Variants } from "framer-motion";
import { Gift } from "lucide-react";
import { fadeInUp } from "./constantes";

function UnusedOfferingsSection({
    unusedError,
    unusedOfferings,
}: {
    unusedError: string | null | undefined;
    unusedOfferings: any[];
}) {
    return (
        <motion.div variants={fadeInUp} className="space-y-4">
            {unusedError ? (
                <div className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">
                    {unusedError}
                </div>
            ) : unusedOfferings.length === 0 ? (
                <div className="rounded-xl bg-white border border-gray-100 p-10 text-center shadow-sm">
                    <Gift className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucun jeton disponible</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {unusedOfferings.map((item, idx) => {
                        const o = item.offering;
                        return (
                            <motion.div
                                key={o?._id || idx}
                                variants={fadeInUp}
                                whileHover={{ y: -4 }}
                                className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                                        <Gift className="h-28 w-28 text-indigo-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-gray-800">{o?.name}</h3>
                                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                                                x{item.quantity}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-xs text-gray-500">{o?.description}</p>
                                        <p className="mt-2 text-sm font-bold text-indigo-600">
                                            {o?.price?.toLocaleString()} FCFA
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}

export default UnusedOfferingsSection;