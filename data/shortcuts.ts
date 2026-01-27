export interface MathShortcut {
    id: string;
    title: string;
    category: "Algebra" | "Trigonometry" | "Geometry" | "Arithmetic" | "Calculus";
    formula: string; // LaTeX
    description: string;
}

export const SHORTCUTS: MathShortcut[] = [
    {
        id: "1",
        title: "Quadratic Formula",
        category: "Algebra",
        formula: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
        description: "Find the roots of any quadratic equation ax^2 + bx + c = 0."
    },
    {
        id: "2",
        title: "Pythagorean Theorem",
        category: "Geometry",
        formula: "a^2 + b^2 = c^2",
        description: "Relation between the sides of a right-angled triangle."
    },
    {
        id: "3",
        title: "Sum of N natural numbers",
        category: "Arithmetic",
        formula: "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}",
        description: "Quickly calculate the sum of the first n integers."
    },
    {
        id: "4",
        title: "Compound Interest",
        category: "Arithmetic",
        formula: "A = P(1 + \\frac{r}{n})^{nt}",
        description: "Calculate the amount with compound interest."
    },
    {
        id: "5",
        title: "Trig Identity",
        category: "Trigonometry",
        formula: "\\sin^2\\theta + \\cos^2\\theta = 1",
        description: "Fundamental trigonometric Pythagorean identity."
    },
    {
        id: "6",
        title: "Area of Circle",
        category: "Geometry",
        formula: "A = \\pi r^2",
        description: "Calculate the area of a circle with radius r."
    }
];
