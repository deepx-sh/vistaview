import baseTemplate from "./baseTemplate";

export const ownerReplyTemplate = (placeName, replyText) =>
    baseTemplate({
    title: "Owner Replied to Your Review",
    content: `
      <p>The owner of <strong>${placeName}</strong> replied to your review:</p>
      <blockquote>${replyText}</blockquote>
    `
  });