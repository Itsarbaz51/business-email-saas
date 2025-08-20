
function Footer({ setSidebarOpen }) {

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center items-center">
            <span>
                Developed by{" "}
                <strong
                    className="cursor-pointer hover:text-gray-800 duration-300"
                    onClick={() => window.open("https://azzunique.com", "_blank")}
                >
                    Azzunique Software Pvt. Ltd.
                </strong>
            </span>
            <span>•</span>
            <span>&copy; {new Date().getFullYear()}</span>
        </div>
    );
}

export default Footer;
