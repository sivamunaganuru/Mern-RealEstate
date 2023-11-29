import { useEffect } from "react";
import { toast } from 'react-toastify';
import { useSelector,useDispatch } from 'react-redux';
import {clearMessages} from '../redux/userSlice';

const useSuccessToastify = () => {

    const {successMessages} = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (successMessages) {
          const toastId = toast.success(successMessages, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            onClose: () => dispatch(clearMessages()) // Clear success message when toast closes
          });
        // Optional: Clear the success message if toast is manually closed before autoClose
      return () => toast.dismiss(toastId);
      }
    }, [successMessages,dispatch]); // This effect will run when successMessages changes

}

export default useSuccessToastify;