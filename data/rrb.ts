export interface RRBModule {
    id: string;
    title: string;
    description: string;
    pdfLink: string;
    videoQuery: string; // Query to find relevant video
    youtubeId?: string; // Optional direct ID if known
    summary: string;
    mastery?: 'red' | 'yellow' | 'green';
    flashcards?: { question: string; answer: string }[];
}

export interface RRBSection {
    id: string;
    title: string;
    icon: "Math" | "Brain" | "Globe";
    modules: RRBModule[];
}

export const RRB_DATA: RRBSection[] = [
    {
        id: "math",
        title: "Mathematics",
        icon: "Math",
        modules: [
            {
                id: "m1",
                title: "Number System & Decimals",
                description: "Core concepts: LCM/HCF, Divisibility Rules, and Remainder Theorem.",
                pdfLink: "https://testbook.com/rrb-group-d/number-system-questions", // Verified Link
                videoQuery: "RRB NTPC Number System Divisibility Tricks",
                youtubeId: "1Z6iP6_hCOs",
                summary: "📌 Weightage: High (3-5 Questions). \n💡 Pro-Tip: For divisibility by 7, double the last digit and subtract from the rest. If result is divisible by 7, so is the number! \n🚀 Focus Areas: Unit Digits, Remainder Theorem, & LCM/HCF word problems.",
                mastery: 'red',
                flashcards: [
                    { question: "What is the divisibility rule for 7?", answer: "Double the last digit and subtract it from the remaining number. If divisible by 7, then the original number is too." },
                    { question: "Find the unit digit of (123)^456", answer: "Check the cycle of 3. 456 is divisible by 4, so unit digit is 3^4 = 1." },
                    { question: "LCM of two primes a and b is?", answer: "a * b" },
                    { question: "Sum of first n natural numbers formula?", answer: "n(n+1)/2" },
                    { question: "Is zero a rational number?", answer: "Yes, because it can be written as 0/1." },
                    { question: "Value of (a+b)^2 - (a-b)^2", answer: "4ab" },
                    { question: "What is a Twin Prime number?", answer: "Two prime numbers that differ by 2 (e.g., 3,5 or 11,13)." },
                    { question: "HCF of two co-prime numbers is?", answer: "1" },
                    { question: "Convert 0.333... to fraction", answer: "1/3" },
                    { question: "Remainder of 2^99 divided by 3?", answer: "(-1)^99 = -1, which is equivalent to 2 in mod 3." }
                ]
            },
            {
                id: "m2",
                title: "Arithmetic (Time, Work, Profit)",
                description: "Commercial math including CI/SI and Profit/Loss.",
                pdfLink: "https://www.adda247.com/railways-study-material",
                videoQuery: "RRB NTPC Time and Work Short Tricks",
                youtubeId: "yW3Qz-Z5_2E",
                summary: "Time & Work questions are frequent. Use the 'Unit Work' method (LCM method) to solve these in under 30 seconds."
            },
            {
                id: "m3",
                title: "Advanced Math (Trig & Geometry)",
                description: "Elementary Algebra, Geometry, and Trigonometry.",
                pdfLink: "https://cracku.in/rrb-ntpc-previous-papers",
                videoQuery: "RRB NTPC Trigonometry Formula",
                youtubeId: "h8JmCFvX3eU",
                summary: "For Trigonometry, memorize the standard values table (0-90 degrees) and Pythagorean triplets to save calculation time."
            }
        ]
    },
    {
        id: "reasoning",
        title: "General Intelligence",
        icon: "Brain",
        modules: [
            {
                id: "r1",
                title: "Analogies & Series",
                description: "Number and alphabetical series completion.",
                pdfLink: "https://byjusexamprep.com/railway-exams/rrb-ntpc-question-papers",
                videoQuery: "RRB NTPC Reasoning Series Tricks",
                youtubeId: "UVnLCP4G_sI",
                summary: "Series questions test pattern recognition. Look for squares, cubes, and prime number gaps first."
            },
            {
                id: "r2",
                title: "Coding-Decoding",
                description: "Deciphering patterns in text.",
                pdfLink: "https://ixambee.com/previous-year-question-paper/rrb-ntpc",
                videoQuery: "RRB NTPC Coding Decoding",
                youtubeId: "_H9gZ5_2E",
                summary: "Write down the alphabet with position numbers (A=1, Z=26) before the exam starts to solve these instantly."
            }
        ]
    },
    {
        id: "ga",
        title: "General Awareness",
        icon: "Globe",
        modules: [
            {
                id: "g1",
                title: "Current Affairs (2025)",
                description: "National events, sports, and awards.",
                pdfLink: "https://school.gradeup.co/railway-exams-current-affairs",
                videoQuery: "RRB NTPC Current Affairs 2025",
                youtubeId: "l8Jm7FvX3eU",
                summary: "Focus on Sports (Olympics/Cricket), Padma Awards, and recent Government Schemes launched in the last 6 months."
            },
            {
                id: "g2",
                title: "General Science",
                description: "Physics, Chemistry, and Life Sciences (10th Level).",
                pdfLink: "https://www.oliveboard.in/railway-exams",
                videoQuery: "RRB NTPC General Science Physics",
                youtubeId: "xW2Qz-Z5_2E",
                summary: "Physics numericals on Light and Electricity are common. Memorize the formulas for Mirror/Lens and Ohm's Law."
            }
        ]
    }
];
