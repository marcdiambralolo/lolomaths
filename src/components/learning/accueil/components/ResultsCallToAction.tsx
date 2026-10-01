'use client';
import { memo } from 'react';
import ActionButton from "./ActionButton";
import Badge from "./Badge";
import CardContainer from "./CardContainer";
import Description from "./Description";
import Title from "./Title";

const ResultsCallToAction = memo(() => {
    return (
        <CardContainer>
            <Badge />
            <Title />
            <Description />
            <ActionButton />
        </CardContainer>
    );
});

export default ResultsCallToAction;