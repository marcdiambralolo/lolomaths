"use client";
import UnusedOfferingsSection from "./UnusedOfferingsSection";

const OfferingsTab = ({
    unusedError,
    unusedOfferings,
}: {
    unusedError: any;
    unusedOfferings: any[];
}) => (
    <UnusedOfferingsSection
        unusedError={unusedError}
        unusedOfferings={unusedOfferings}
    />
);

export default OfferingsTab;