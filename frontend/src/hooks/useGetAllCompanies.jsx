import { setCompanies } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [dispatch]);

  return { loading, error }; // Return something to satisfy Fast Refresh
};

export default useGetAllCompanies;
