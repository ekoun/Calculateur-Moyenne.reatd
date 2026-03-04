export function MSLogo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle with Gradient */}
      <defs>
        <linearGradient id="msGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#9B2C9B", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#0E8F5A", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Outer Circle */}
      <circle cx="50" cy="50" r="48" fill="url(#msGradient)" />
      
      {/* Inner Circle for depth */}
      <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
      
      {/* CM Text */}
      <text
        x="50"
        y="50"
        fontSize="36"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Poppins, system-ui, sans-serif"
      >
        CM
      </text>
    </svg>
  );
}


