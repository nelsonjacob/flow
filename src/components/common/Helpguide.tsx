import React from 'react';

interface HelpguideProps {
    isOpen: boolean;
    onClose: () => void;
}

const Helpguide: React.FC<HelpguideProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const shortcuts = [
        { label: "Add new task", key: "Ctrl + N" },
        { label: "Remove selected task", key: "Delete" }
    ];

    return (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-t-xl shadow-2xl max-w-2xl w-full mx-4">
                
                <header className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold">Help Guide</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                
                <section className="p-6 bg-blue-50 border border-blue-100 m-6 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-3">Keyboard Shortcuts</h3>
                    {shortcuts.map(({ label, key }) => (
                        <div key={key} className="flex justify-between items-center py-1">
                            <span>{label}</span>
                            <kbd className="bg-white border px-3 py-1 rounded text-sm font-mono shadow-sm">
                                {key}
                            </kbd>
                        </div>
                    ))}
                </section>
                
            </div>
        </div>
    );
};

export default Helpguide;