import toast from "react-hot-toast";

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const DOC_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

const useFileValidation = () => {
    const validate = ({
        files,
        allowedTypes=IMAGE_TYPES,
        maxSizeMB=5,
        maxCount=null,
        currentCount=0
    }) => {
        if (!files || files.length === 0) return [];

        const maxBytes = maxSizeMB * 1024 * 1024;
        const valid = [];

        for (const file of files) {
            if (!allowedTypes.includes(file.type)) {
                const ext = allowedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ");
                toast.error(`"${file.name}" is not allowed. Use ${ext} files`)
                return []
            }

            if (file.size > maxBytes) {
                toast.error(`"${file.name}" is too large. Max size is ${maxSizeMB}MB.`)
                return [];
            }

            valid.push(file)
        }

        if (maxCount !== null && currentCount + valid.length > maxCount) {
            toast.error(`You can only have ${maxCount} file${maxCount !== 1 ? "s" : ""} total ` + `You already have ${currentCount}`)
            return []
        }
        return valid;
    }
    return {validate,IMAGE_TYPES,DOC_TYPES}
};

export default useFileValidation;