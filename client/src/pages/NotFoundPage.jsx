import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-slate-200 to-slate-100 text-slate-800 min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-[8rem] font-extrabold leading-none mb-6 select-none md:text-[10rem]">
          404
        </h1>
        <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-lg mx-auto">
          Oops! The page you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-block bg-slate-800 text-stone-100 px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-slate-900 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-700"
          aria-label="Go to home page"
        >
          Go Home
        </button>
      </div>
    </section>
  );
}