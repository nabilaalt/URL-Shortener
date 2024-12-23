import { useState, useCallback } from "react";

const useFetch = (apiFunction, params) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch function
  const fn = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunction(params); // Fetch API data
      setData(response); // Update data state
    } catch (err) {
      setError(err); // Update error state
    } finally {
      setLoading(false); // Stop loading
    }
  };


  return { loading, data, error, fn };
};

export default useFetch;
