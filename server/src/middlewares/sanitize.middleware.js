import DOMPurify from "isomorphic-dompurify";

const TEXT_FIELDS = [
    "name",
    "email",


    "description",
    "bestTimeToVisit",
    "address",
    "city",
    "state",

    "comment",

    "businessName",
    "businessAddress",

    "message",
    "reason",
    "text",
    "adminNote",
    "rejectedReason",
    "blockedReason"
];


const deepSanitize = (value) => {
    if (typeof value === "string") {
        return DOMPurify.sanitize(value.trim())
    }

    if (Array.isArray(value)) {
        return value.map(deepSanitize)
    }

    if (value !== null && typeof value === "object") {
        const sanitized = {}
        for (const [k, v] of Object.entries(value)) {
            sanitized[k]=deepSanitize(v)
        }

        return sanitized
    }

    return value
};


export const sanitizeInputs = (req, res, next) => {
    if (!req.body || typeof req.body !== "object") return next();

    for (const field of TEXT_FIELDS) {
        if (field in req.body) {
            req.body[field] =deepSanitize(req.body[field])
        }
    }


    if (req.body.location && typeof req.body.location === "object") {
        const loc = req.body.location;

        if (loc.address) loc.address = DOMPurify.sanitize(loc.address.trim())
        if (loc.city) loc.city = DOMPurify.sanitize(loc.city.trim())
        if(loc.state) loc.state=DOMPurify.sanitize(loc.state.trim())
    }
    
    if (req.body.ownerReply?.text) {
        req.body.ownerReply.text=DOMPurify.sanitize(req.body.ownerReply.text.trim())
    }

    next()
}