"use client";
import TransactionCard from "./TransactionCard";

const TransactionList = ({ transactions }: { transactions: any[] }) => (
    <div className="space-y-3">
        {transactions.map((transaction, index) => (
            <TransactionCard
                key={transaction._id}
                transaction={transaction}
                index={index}
            />
        ))}
    </div>
);

export default TransactionList;