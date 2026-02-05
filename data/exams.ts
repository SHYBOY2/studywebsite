export type ExamCategory = "RRB" | "SSC" | "Banking" | "Entrance";

export interface ExamEvent {
    id: string;
    name: string;
    category: ExamCategory;
    applicationStart?: string; // ISO Date String
    applicationEnd?: string;   // ISO Date String
    examDateStart?: string;    // ISO Date String
    examDateText: string;      // Human readable text like "Oct–Dec 2026 (Expected)"
    notificationLink?: string;
    applyLink?: string;
    status: "Live" | "Upcoming" | "Expected" | "Closed";
}

export const EXAM_CALENDAR_2026: ExamEvent[] = [
    {
        id: "rrb-group-d",
        name: "RRB Group D (CEN 09/2025)",
        category: "RRB",
        applicationStart: "2026-01-31T00:00:00",
        applicationEnd: "2026-03-02T23:59:59",
        examDateText: "Oct–Dec 2026 (Expected)",
        applyLink: "https://rrbapply.gov.in",
        status: "Upcoming" // This might be "Live" depending on current date logic
    },
    {
        id: "ssc-cgl",
        name: "SSC CGL 2026",
        category: "SSC",
        applicationStart: "2026-03-01T00:00:00", // Tentative for March
        examDateText: "May–June 2026",
        status: "Expected"
    },
    {
        id: "ibps-po",
        name: "IBPS PO 2026",
        category: "Banking",
        applicationStart: "2026-08-01T00:00:00", // Tentative for Aug
        examDateStart: "2026-08-22T09:00:00",
        examDateText: "Aug 22–23, 2026",
        status: "Expected"
    },
    {
        id: "ibps-clerk",
        name: "IBPS Clerk (CSA) 2026",
        category: "Banking",
        applicationStart: "2026-08-01T00:00:00", // Tentative
        examDateStart: "2026-10-10T09:00:00",
        examDateText: "Oct 10–11, 2026",
        status: "Expected"
    },
    // Entrance Exams (M.Tech/MCA)
    {
        id: "apicet-2026",
        name: "AP ICET 2026 (MBA/MCA)",
        category: "Entrance",
        applicationStart: "2026-03-01T00:00:00", // Tentative (March 1st week)
        examDateText: "May 2026 (Expected)",
        applyLink: "https://cets.apsche.ap.gov.in/ICET",
        status: "Upcoming"
    },
    {
        id: "ap-pgecet-2026",
        name: "AP PGECET 2026 (M.Tech)",
        category: "Entrance",
        applicationStart: "2026-02-06T00:00:00",
        examDateStart: "2026-04-28T09:00:00",
        examDateText: "Apr 28 – 30, 2026",
        applyLink: "https://cets.apsche.ap.gov.in/PGECET",
        status: "Upcoming" // Starts Feb 06
    },
    {
        id: "ts-icet-2026",
        name: "TS ICET 2026 (MBA/MCA)",
        category: "Entrance",
        applicationStart: "2026-02-12T00:00:00", // Tentative
        examDateStart: "2026-05-13T09:00:00",
        examDateText: "May 13 – 14, 2026",
        status: "Upcoming"
    },
    {
        id: "ts-pgecet-2026",
        name: "TS PGECET 2026 (M.Tech)",
        category: "Entrance",
        applicationStart: "2026-03-17T00:00:00", // Tentative
        examDateStart: "2026-05-28T09:00:00",
        examDateText: "May 28 – 31, 2026",
        status: "Upcoming"
    },
    {
        id: "gate-2026",
        name: "GATE 2026",
        category: "Entrance",
        examDateStart: "2026-02-07T09:00:00",
        examDateText: "Feb 7, 8, 14, 15, 2026",
        status: "Live"
    },
    {
        id: "nimcet-2026",
        name: "NIMCET 2026 (MCA)",
        category: "Entrance",
        applicationStart: "2026-03-15T00:00:00", // Expected March
        examDateText: "Jun 2026 (Tentative)",
        status: "Expected"
    }
];
