import toast from "react-hot-toast";

const handleApiError = (error, fallback = "Something went wrong") => {
    if (!error) {
        toast.error(fallback)
        return
    }

    const data = error?.data;

    if (data?.error) {
        toast.error(data.message || data.error)
        return
    }

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
        data.errors.forEach((msg) => toast.error(msg))
        return
    }

    if (data?.message) {
        toast.error(data.message)
        return
    }

    toast.error(fallback)
};

export default handleApiError;