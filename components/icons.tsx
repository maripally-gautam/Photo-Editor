import React from 'react';

type IconProps = {
    className?: string;
};

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.423-1.423L13.5 18.75l1.188-.648a2.25 2.25 0 011.423-1.423L16.25 15.5l.648 1.188a2.25 2.25 0 011.423 1.423L18.5 18.75l-1.188.648a2.25 2.25 0 01-1.423 1.423z" />
    </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const ExclamationTriangleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

export const PencilSquareIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

export const PhotoIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

export const MagicWandIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .819.162l4.223 4.223a.75.75 0 0 1 0 1.06l-1.591 1.591a.75.75 0 0 1-1.06 0l-4.224-4.224a.75.75 0 0 1-.162-.819 8.97 8.97 0 0 0-3.463.69.75.75 0 0 1-.819-.162l-4.223-4.223a.75.75 0 0 1 0-1.06l1.591-1.591a.75.75 0 0 1 1.06 0l4.224 4.224a.75.75 0 0 1 .162.819 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .819.162l4.223 4.223a.75.75 0 0 1 0 1.06l-1.591 1.591a.75.75 0 0 1-1.06 0l-4.224-4.224" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.94 18.528 1.414-1.414" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.121 21.353l1.414-1.414" /><path strokeLinecap="round" strokeLinejoin="round" d="M18.528 4.94l1.414-1.414" /><path strokeLinecap="round" strokeLinejoin="round" d="M21.353 2.121l-1.414 1.414" />
    </svg>
);

export const ArrowsRightLeftIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h18m-7.5-1.5L21 7.5m0 0L16.5 3M21 7.5H3" />
    </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

export const BookOpenIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
);

export const LightBulbIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a14.994 14.994 0 0 1-4.5 0M9.75 6.75a8.25 8.25 0 0 1 4.5 0m-4.5 0a8.25 8.25 0 0 0-4.5 0m4.5 0 0-3.75m0 3.75a8.25 8.25 0 0 1-4.5 0m4.5 0L12 3M9.75 6.75a8.25 8.25 0 0 0-4.5 0" />
    </svg>
);

export const DocumentTextIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

export const AcademicCapIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path d="M12 14.25a3.75 3.75 0 00.75-7.468V6.625a1.875 1.875 0 00-1.875-1.875h-1.75a1.875 1.875 0 00-1.875 1.875v.156a3.75 3.75 0 00.75 7.468z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-6.75m0 0a3.75 3.75 0 00.75-7.468V6.625a1.875 1.875 0 00-1.875-1.875h-1.75A1.875 1.875 0 006 6.625v.156a3.75 3.75 0 00.75 7.468v6.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.122a1.5 1.5 0 00.818 1.341l8.25 4.125a1.5 1.5 0 001.364 0l8.25-4.125a1.5 1.5 0 00.818-1.341V9.878a1.5 1.5 0 00-.818-1.341l-8.25-4.125a1.5 1.5 0 00-1.364 0L3.068 8.537a1.5 1.5 0 00-.818 1.341v2.244z" />
    </svg>
);

export const SpeakerWaveIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const UserCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export const ArrowRightOnRectangleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
);

export const ServerIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.65H8.228a3.375 3.375 0 0 0-3.285 2.65l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z" />
    </svg>
);


// --- Chatbot Icons ---
export const ChatBubbleOvalLeftEllipsisIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 10.5c0 .985-.36 1.897-1 2.624-.64.727-1.544 1.25-2.5 1.455a13.44 13.44 0 0 1-1.332.225 11.2 11.2 0 0 1-1.258.15H11.5c-.47 0-.932-.056-1.385-.165a11.1 11.1 0 0 1-1.258-.45A13.44 13.44 0 0 1 6 13.124c-.64-.727-1-1.639-1-2.624 0-1.87 1.492-3.393 3.5-3.812.51-.08 1.026-.118 1.542-.118h1.916c.516 0 1.032.038 1.542.118 2.008.42 3.5 1.942 3.5 3.812ZM18 10.5a13.42 13.42 0 0 0-1.258-5.424 11.1 11.1 0 0 0-1.258-.45A13.44 13.44 0 0 0 12.5 4.5h-1.012a13.44 13.44 0 0 0-2.988.602 11.1 11.1 0 0 0-1.258.45 13.42 13.42 0 0 0-1.258 5.424m13.5 6.376a11.2 11.2 0 0 1-.15 1.258c-.1.516-.254 1.023-.45 1.5a13.44 13.44 0 0 1-2.624 1 11.1 11.1 0 0 1-1.5.45c-.516.1-1.032.165-1.542.165h-1.916a11.2 11.2 0 0 1-1.542-.165c-.516-.1-.98-.25-1.455-.45a13.44 13.44 0 0 1-2.624-1 11.1 11.1 0 0 1-1.5-.45c-.2-.477-.35-1.023-.45-1.5a11.2 11.2 0 0 1-.15-1.258m13.5 0a13.42 13.42 0 0 1-.602 2.988c-.1.516-.254.98-.45 1.455a13.44 13.44 0 0 1-1 2.624 11.1 11.1 0 0 1-.45 1.258A13.42 13.42 0 0 1 12.5 21h-1.012a13.42 13.42 0 0 1-5.424-1.258 11.1 11.1 0 0 1-.45-1.258 13.44 13.44 0 0 1-1-2.624c-.2-.476-.35-.98-.45-1.455A13.42 13.42 0 0 1 4.5 16.5" />
    </svg>
);

export const XMarkIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const PaperAirplaneIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

export const CpuChipIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M12 4.5v-1.5m0 18v-1.5M15.75 21v-1.5m-6 .75h.008v.008H9.75v-.008Zm0 0H9.75m0 0h.008v.008H9.75m-3.75 0h.008v.008H6v-.008Zm0 0H6m0 0h.008v.008H6m1.5-3.75h.008v.008H7.5v-.008Zm0 0H7.5m0 0h.008v.008H7.5m3.75-3.75h.008v.008H11.25v-.008Zm0 0h-.008v.008h.008Zm2.25.008h.008v.008H13.5v-.008Zm0 0h-.008v.008h.008Zm2.25.008h.008v.008H15.75v-.008Zm0 0h-.008v.008h.008Zm2.25.008h.008v.008H18v-.008Zm0 0h-.008v.008h.008Zm-3.75-1.5h.008v.008H14.25v-.008Zm0 0h-.008v.008h.008Zm-2.25 0h.008v.008H12v-.008Zm0 0h-.008v.008h.008Zm-2.25 0h.008v.008H9.75v-.008Zm0 0h-.008v.008h.008ZM9 10.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm1.5.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm1.5-.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm1.5.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm1.5-.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18 9.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-1.5.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm-1.5-.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-1.5.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9 14.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm1.5.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm1.5-.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm1.5.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm1.5-.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
    </svg>
);