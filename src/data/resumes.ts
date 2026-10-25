export const resumeFilename = "Mohammed-Shajahan-Resume.pdf";
export const resumeUpdatedDate = "2026-10-25";

export const formatResumeDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
