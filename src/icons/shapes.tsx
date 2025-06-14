const strokeWidth: number = 1.3

export const CircleIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        style={{ verticalAlign: 'middle', display: 'inline-block' }}
    >
        <circle cx="8" cy="8" r="6" />
    </svg>
);

export const SquareIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        style={{ verticalAlign: 'middle', display: 'inline-block' }}
    >
        <rect x="2" y="2" width="12" height="12" />
    </svg>
);

export const TriangleIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ verticalAlign: 'middle', display: 'inline-block' }}
    >
        <polygon points="8,2 14,14 2,14" />
    </svg>
);
