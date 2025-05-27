import { useCallback, useState } from "react";
import { Alert } from "react-native";

const API_URL = "http://10.0.2.2:5500/api/v1/transactions"; // For Android emulator
// OR
// const API_URL = "http://<YOUR_PC_IP>:5500/api/v1/transactions"; // For physical device

export const useTransactions = (user_id) => {
    // console.log(user_id, "useTransactions hook called");
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        income: 0,
        expenses: 0,
        balance: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${user_id}`);
            // if (!response.ok) {
            //     throw new Error("Failed to fetch transactions");
            // } 
            const data = await response.json();
            // console.log("Fetched transactions:", data);
            console.log("Fetched transactions:", data);
            setTransactions(data.data || []);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    }, [user_id]);

    const fetchSummary = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/summary/${user_id}`);
            // if (!response.ok) {
            //     throw new Error("Failed to fetch summary");
            // }
            const data = await response.json();
            console.log("Fetched summary:", data);
            setSummary(data.data || { income: 0, expenses: 0, balance: 0 }); // <-- Fix here
        } catch (error) {
            console.error("Error fetching summary:", error);
        } finally {
            setLoading(false);
        }
    }, [user_id]);

    const loadData = useCallback(async () => {
        if (!user_id) {
            console.warn("User ID is not provided");
            return;
        }

        setLoading(true);
        try {
            await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }

    }, [fetchTransactions, fetchSummary, user_id]);

    const deleteTransaction = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete transaction");
            }

            const data = await response.json();
            console.log("Deleted transaction:", data);
            Alert.alert("Success", "Transaction deleted successfully");

            // Refresh the transactions list
            loadData();
        } catch (error) {
            console.error("Error deleting transaction:", error);
            Alert.alert("Error", error.message || "Failed to delete transaction");
        }
    }

    return {
        transactions,
        summary,
        loading,
        loadData,
        deleteTransaction
    };
}