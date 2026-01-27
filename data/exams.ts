export type ExamCategory = "RRB" | "SSC" | "Banking";

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
    }
];
