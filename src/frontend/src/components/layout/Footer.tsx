export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        © 2025 Blog Writing Agent. Powered by AI.
                    </p>
                    <div className="flex space-x-6 text-sm text-gray-600">
                        <a href="#" className="hover:text-primary-600 transition-colors">
                            Documentation
                        </a>
                        <a href="#" className="hover:text-primary-600 transition-colors">
                            Support
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
