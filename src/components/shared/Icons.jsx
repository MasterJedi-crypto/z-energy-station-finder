export function SearchIcon({ className = "size-6" }) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="2" />
        <path
          d="M16.2 16.2 20 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  export function MenuIcon({ className = "size-6" }) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  export function ChevronDownIcon({ className = "size-4" }) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 9l6 6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  export function ChevronRightIcon({ className = "size-4" }) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  export function EyeIcon({ className = "size-5" }) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  export function EyeOffIcon({ className = "size-5" }) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 3l18 18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M9.5 9.6A3.2 3.2 0 0 0 12 15.2c.6 0 1.1-.1 1.6-.4M4.2 7.4C3.3 8.6 2.8 10 2.8 12S6.2 18.2 12 18.2c1.7 0 3.2-.4 4.4-1M8.2 6C9.4 5.5 10.6 5.8 12 5.8c5.8 0 9.2 6.2 9.2 6.2a16 16 0 0 1-2.4 3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  export function CameraIcon({ className = "size-3" }) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 8.5A2.5 2.5 0 0 1 6.5 6h2.1l.7-1.2A1.5 1.5 0 0 1 10.6 4h2.8a1.5 1.5 0 0 1 1.3.8L15.4 6h2.1A2.5 2.5 0 0 1 20 8.5v7A2.5 2.5 0 0 1 17.5 18h-11A2.5 2.5 0 0 1 4 15.5v-7Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  export function CloseIcon({ className = "size-6" }) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 6l12 12M18 6 6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  export function CardArrowIcon({ className = "h-[13px] w-[21px]" }) {
    return (
      <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="13"
        viewBox="0 0 21 13"
        fill="none"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.5097 0.380165C13.7559 0.136746 14.0897 3.37796e-07 14.4377 3.22583e-07C14.7857 3.0737e-07 15.1195 0.136746 15.3656 0.380164L20.6157 5.57389C20.8618 5.81738 21 6.14759 21 6.49188C21 6.83618 20.8618 7.16638 20.6157 7.40987L15.3656 12.6036C15.2446 12.7276 15.0997 12.8265 14.9396 12.8946C14.7795 12.9626 14.6072 12.9985 14.433 13C14.2587 13.0014 14.0859 12.9686 13.9246 12.9033C13.7633 12.838 13.6167 12.7416 13.4935 12.6197C13.3702 12.4978 13.2728 12.3528 13.2068 12.1932C13.1408 12.0337 13.1076 11.8627 13.1091 11.6903C13.1106 11.5179 13.1468 11.3475 13.2156 11.1891C13.2844 11.0307 13.3844 10.8874 13.5097 10.7676L16.5193 7.79032L1.31252 7.79032C0.964416 7.79032 0.630572 7.65352 0.384427 7.41001C0.138282 7.16651 -2.69426e-07 6.83625 -2.84479e-07 6.49188C-2.99531e-07 6.14752 0.138282 5.81726 0.384427 5.57375C0.630572 5.33025 0.964416 5.19345 1.31252 5.19345L16.5193 5.19345L13.5097 2.21615C13.2637 1.97265 13.1255 1.64245 13.1255 1.29816C13.1255 0.953858 13.2637 0.623657 13.5097 0.380165Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  export function ArrowDownIcon({ className = "size-5" }) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 5v12M6 13l6 6 6-6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  export function CopyrightMarkIcon({ className = "size-10" }) {
    return (
      <svg
        className={className}
        viewBox="0 0 70 70"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="copyright-mark-left">
            <rect width="35" height="70" />
          </clipPath>
          <clipPath id="copyright-mark-right">
            <rect x="35" width="35" height="70" />
          </clipPath>
        </defs>
        <path d="M35 5.5A29.5 29.5 0 0 0 35 64.5Z" fill="#445E5C" />
        <circle cx="35" cy="35" r="29.5" stroke="#445E5C" strokeWidth="3.2" />
        <g
          clipPath="url(#copyright-mark-left)"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinejoin="round"
        >
          <rect x="18" y="21" width="30" height="20" rx="2.2" />
          <path d="M32 41v5h6M32 41v5h-6" strokeLinecap="round" />
        </g>
        <g
          clipPath="url(#copyright-mark-right)"
          stroke="#445E5C"
          strokeWidth="2.4"
          strokeLinejoin="round"
        >
          <rect x="18" y="21" width="30" height="20" rx="2.2" />
          <path d="M32 41v5h6" strokeLinecap="round" />
        </g>
      </svg>
    );
  }
  