export const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  day:'numeric',
  year:'numeric'
}).format;
