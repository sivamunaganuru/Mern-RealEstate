import { useEffect } from "react";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux'

const useErrorToastify = () => {

    const {apierror} = useSelector(state => state.user);

    useEffect(() => {
        if (apierror) {
          toast.error(apierror, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }, [apierror]); // This effect will run when apierror changes

}

export default useErrorToastify;