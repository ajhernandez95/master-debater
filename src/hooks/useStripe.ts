import axios from "axios";
import { useSupabase } from "../context/SupabaseContext";

const useStripe = () => {
  const { tier } = useSupabase();
  const isFreeTier = tier === "free";

  const initiateStripePurchase = async () => {
    if (!isFreeTier) return;
    try {
      const response = await axios.post(
        "https://debateai.jawn.workers.dev/v1/stripe/create-checkout-session"
      );

      // Extract the checkout URL from the response data and navigate to it
      const checkoutUrl = response.data.url;

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return {
    initiateStripePurchase,
  };
};

export default useStripe;
